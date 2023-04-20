// csv node class, extends DcNode

import { DcNode } from "./DcNode"
import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';
import { NodeTypes } from '@/services/GlobalDefs';

import { CsvInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch"
import { UserStore } from "@/services/UserStore";
const userStore = UserStore()

import { read, utils } from "xlsx";

export class LoadExcel extends DcNode {
  // properties
  static _display = false
  static _type = NodeTypes.INPUT
  private df = new DataFrame()
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = []
    const edges: string[] = ["d"]
    // keep config in instance, the values will be stored here too ...
    const cfg = {
      pop: "value",
      options: [
        {
          id: "url",
          type: "url",
          label: "URL",
          value: ""
        },
        {
          id: "sheet",
          type: "text",
          label: "Sheet",
          value: ""
        }
      ]
    }
    super(id, "loadexcel", ports, edges, cfg as any)
    DcNode.print(LoadExcel._type + " created") // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  async configure(options: any[]) {
    // we know the config structure here, so can just use the index
    const config = this.config
    for (let i = 0; i < options.length; i++) {
      config.options[i].value = options[i]
    }
    // update
    this.config = config // update config
    if (options[0] != "") {
      await this.load(options[0])
    }
  }
  async load(url: string) {
    DcNode.print("Load on " + String(this.name))
    if (url === undefined) throw (new Error("Invalid URL"))
    if (!await DcNode.providers.exists(this.id)) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true) // file loaders are root nodes
    }
    if (!url.includes("http")) {
      // local urls supported ... detect full host address with port number ...
      url = window.location.href.split(window.location.pathname)[0] + url
    }

    // probably we have to use fetch to get an array buffer, which can be loaded by loadExcel
    // see https://docs.sheetjs.com/docs/solutions/input

    let corsRequired = false
    let fileData
    let fileType
    try {
      const fetchOk = await testFetch(url, "xls")
      if (!fetchOk.success) {
        const userStore = UserStore()
        if (userStore.exists()) {
          corsRequired = true
        } else {
          alert("URL cannot be loaded directly. Log in and retry")
          return
        }
      }
      if (fetchOk.data) {
        fileData = fetchOk.data
        fileType = fetchOk.mime
      }
    } catch (e) {
      alert("URL cannot be loaded directly2")
      return
    }

    // maybe try cors as well
    if (corsRequired) {
      try {
        const fetchOk = await testFetch(url, "xls", true)
        if (!fetchOk.success) {
          alert("CORS loading failed. Check URL")
          return
        }
        if (fetchOk.data) {
          fileData = fetchOk.data
          fileType = fetchOk.mime
        } else {
          DcNode.print("No file data")
          return
        }
      } catch (e) {
        alert("URL cannot be loaded. Check URL")
        return
      }
    }
    //this.df = await DcNode.dfd.readExcel(url,csvOptions) as DataFrame
    // Assuming you already have an existing ArrayBuffer named "myExcelArrayBuffer"
    const myBlob = new Blob([fileData], { type: fileType }) //"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const myFile = new File([myBlob], "filename.xlsx", { type: fileType }) //  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    // check requested sheet name from config
    const sheet = this.config.options[1].value
    //
    try {
      const workbook = read(fileData, { type: 'buffer' });
      let sheetNames = workbook.SheetNames;
      if (sheet != "") {
        sheetNames = sheetNames.filter(s => s == sheet)
      } else {
        if (sheetNames.length > 1) {
          alert(`Warning: Multiple sheets: ${JSON.stringify(sheetNames)}. Picking first one`)
          sheetNames = sheetNames.slice(0, 1)
        }
      }
      // Parse each sheet into a JSON object
      const worksheet = await workbook.Sheets[sheetNames[0]];
      // for header see https://docs.sheetjs.com/docs/api/utilities
      // header:1 results in array of array. later replace
      // header with row 0
      const data = await utils.sheet_to_json(worksheet, { header: 1 }) as any
      //console.log(data[0][0],typeof(data[0][0]))
      if (data[0][0] === undefined) {
        data[0][0] = "Index"
      }
      // all rows must be of same length
      for (let i = 1; i< data.length; i++) {
        while (data[i].length < data[0].length) data[i].push(NaN)
        if (data[i].length > data[0].length) {
          data[i] = data[i].slice(0,data[0].length)
        }
      }
      this.df = await new DcNode.dfd.DataFrame(data, { columns: data[0] }) // , {columns: data[0]});
      await this.df.drop({ index: [0] , inplace:true});
      await this.df.resetIndex({inplace:true})
    } catch (e) {
      await DcNode.print("xlsx failed:" + String(e))
      alert("xlsx failed:" + String(e))
      return
    }
    /*     
    try {
      this.df = await DcNode.dfd.readExcel(myFile,{parsingOptions:{sheets:i}}) as DataFrame
      this.df.print()
      this.df.ctypes.print()
    } catch (e) {
      console.log("danfo failed:",i,e)
    }
  }
  if (sheet != "") {
    console.log("Sheet:",sheet)
    this.df = await DcNode.dfd.readExcel(myFile,{parsingOptions:{sheets:sheet}}) as DataFrame
  } else {
    this.df = await DcNode.dfd.readExcel(myFile) as DataFrame
  }
  */
    this.df.print()
    this.df.ctypes.print()
    /*
    console.log("Values:",this.df.values)
    console.log("Columns:",this.df.columns)
    */
    await DcNode.providers.update(this.id, toJSON(this.df))
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)
  }

  // getters
  get type() { return LoadExcel._type }
  get display() { return LoadExcel._display }

}



