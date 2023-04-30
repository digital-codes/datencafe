// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { DataFrame, toJSON } from "danfojs/dist/danfojs-browser/src";
import { NodeSpec } from "@/services/GlobalDefs";

import testFetch from "@/services/TestFetch";
import { UserStore } from "@/services/UserStore";
const userStore = UserStore();

import { read, utils } from "xlsx";
import { threadId } from "worker_threads";

export class LoadExcel extends DcNode {
  // properties
  static _display = false;
  static _type = NodeSpec.INPUT;
  private df = new DataFrame();
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = [];
    const edges: string[] = ["d"];
    // keep config in instance, the values will be stored here too ...
    const cfg = {
      pop: "value",
      options: [
        {
          id: "url",
          type: "url",
          label: "URL",
          value: "",
        },
        {
          id: "sheet",
          type: "text",
          label: "Sheet",
          value: "",
        },
        {
          id: "license",
          type: "text",
          label: "License",
          value: ""
        },
        {
          id: "attribution",
          type: "text",
          label: "Attrib.",
          value: ""
        }
      ],
    };
    super(id, "loadexcel", ports, edges, cfg as any);
    DcNode.print(LoadExcel._type + " created"); // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  async configure(options: any[]) {
    // we know the config structure here, so can just use the index
    const config = this.config;
    for (let i = 0; i < options.length; i++) {
      config.options[i].value = options[i];
    }
    // update
    this.config = config; // update config
    if (options[0] != "") {
      await this.load(options[0]);
    }
    // check license and attribution
    // get old meta
    // without url, id has not been added yet ...
    const exists = await DcNode.providers.exists(this.id)
    if (!exists) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true); // file loaders are root nodes
    }
    const meta = await DcNode.providers.getMeta(this.id)
    console.log("Oldmeta",meta)
    for (const m of ["url","license","attribution"]) {
      const idx = this.config.options.findIndex((o: any) => o.id == m)
      console.log(m,idx)
      const val = this.config.options[idx].value
      if (val != "") {
        console.log("Meta:",m,val)
        meta[m] = val // set meta
      }
    }
    await DcNode.providers.setMeta(this.id,meta)

  }
  // ----------------------------  
  async load(url: string) {
    DcNode.print("Load on " + String(this.name));
    if (url === undefined) throw new Error("Invalid URL");
    if (!url.includes("http")) {
      // local urls supported ... detect full host address with port number ...
      url = window.location.href.split(window.location.pathname)[0] + url;
    }

    // probably we have to use fetch to get an array buffer, which can be loaded by loadExcel
    // see https://docs.sheetjs.com/docs/solutions/input

    let corsRequired = false;
    let fileData;
    try {
      const fetchResult = await testFetch(url, "xls");
      if (!fetchResult.success) {
        const userStore = UserStore();
        if (userStore.exists()) {
          corsRequired = true;
        } else {
          alert("URL cannot be loaded directly. Log in or load locally");
          // emit iframe download signal for url 
          await super.messaging.emit(DcNode.signals.URLOADPREFIX, url)
          return;
        }
      }
      if (fetchResult.data) {
        fileData = fetchResult.data;
      }
    } catch (e) {
      alert("URL cannot be loaded directly2");
      return;
    }

    // maybe try cors as well
    if (corsRequired) {
      try {
        const fetchResult = await testFetch(url, "xls", true);
        if (!fetchResult.success) {
          alert("CORS loading failed. Check URL");
          return;
        }
        if (fetchResult.data) {
          fileData = fetchResult.data;
        } else {
          DcNode.print("No file data");
          return;
        }
      } catch (e) {
        alert("URL cannot be loaded. Check URL");
        return;
      }
    }
    await this.loadXls(fileData);
  }
  async loadXls(file: any) {
    const sheet = this.config.options[1].value;
    try {
      const workbook = await read(file, { type: "buffer" });
      let sheetNames = workbook.SheetNames;
      if (sheet != "") {
        sheetNames = sheetNames.filter((s) => s == sheet);
        if (sheetNames.length == 0) {
          alert("Invalid sheet name. CHeck Config")
          return
        }
      } else {
        if (sheetNames.length > 1) {
          alert(
            `Warning: Multiple sheets: ${JSON.stringify(
              sheetNames
            )}. Picking first one`
          );
          sheetNames = sheetNames.slice(0, 1);
        }
      }
      // Parse each sheet into a JSON object
      const worksheet = await workbook.Sheets[sheetNames[0]];
      // for header see https://docs.sheetjs.com/docs/api/utilities
      // header:1 results in array of array. later replace
      // header with row 0
      const data = (await utils.sheet_to_json(worksheet, { header: 1 })) as any;
      if (data[0][0] === undefined) {
        data[0][0] = "Index";
      }
      // all rows must be of same length
      for (let i = 1; i < data.length; i++) {
        while (data[i].length < data[0].length) data[i].push(NaN);
        if (data[i].length > data[0].length) {
          data[i] = data[i].slice(0, data[0].length);
        }
      }
      this.df = await new DcNode.dfd.DataFrame(data, { columns: data[0] }); // , {columns: data[0]});
      await this.df.drop({ index: [0], inplace: true });
      await this.df.resetIndex({ inplace: true });
    } catch (e) {
      await DcNode.print("xlsx failed:" + String(e));
      alert("xlsx failed:" + String(e));
      return;
    }
    this.df.print();
    this.df.ctypes.print();

    const exists = await DcNode.providers.exists(this.id)
    if (!exists) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true); // file loaders are root nodes
    }

    const meta = await DcNode.providers.getMeta(this.id)
    const dt = await new Date().toISOString()
    meta.date = dt
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(this.df),meta)
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
    await super.messaging.emit((DcNode.signals.UPDPREFIX as string) + this.id);
  }

  // overwrite upload function
  async upload(file: any) {
    if (file.length < 1) {
      throw new Error("Invalid upload");
    }
    const name = file[0].name;
    if (!(name.endsWith(".xls") || name.endsWith(".xlsx"))) {
      alert("Not a XLS/XLSX file?");
      return;
    }

    const fileReader = new FileReader();
    await fileReader.readAsArrayBuffer(file[0]);

    // Wait for the file to finish loading
    const buffer = await new Promise((resolve) => {
      fileReader.onload = (event) => {
        if (!event.target) throw new Error("onload error");
        resolve(event.target.result);
      };
    }).catch((error) => {
      throw new Error("Load failed");
    });

    if (!buffer) {
      throw new Error("Load failed2");
    }

    await this.loadXls(buffer);
  }

  // getters
  get type() {
    return LoadExcel._type;
  }
  get display() {
    return LoadExcel._display;
  }
}
