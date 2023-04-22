// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { DataFrame, toJSON } from "danfojs/dist/danfojs-browser/src";
import { NodeSpec } from "@/services/GlobalDefs";

import { readJSONBrowser } from "danfojs/dist/danfojs-base/io/browser";
import { JsonInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch";

export class LoadJson extends DcNode {
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
      ],
    };
    super(id, "loadjson", ports, edges, cfg as any);
    DcNode.print(LoadJson._type + " created"); // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  async configure(options: any[]) {
    // we know the config structure here, so can just use the index
    if (options[0] != "") {
      const url = options[0];
      const config = super.config;
      config.options[0].value = url;
      super.config = config; // update config
      await this.load(url);
    }
  }
  async load(url: string) {
    DcNode.print("Load on " + String(super.name));
    if (url === undefined) throw new Error("Invalid URL");
    if (!url.includes("http")) {
      // local urls supported ... detect full host address with port number ...
      url = window.location.href.split(window.location.pathname)[0] + url;
    }
    try {
      const fetchOk = await testFetch(url, "json", false, true); // check for feature collection
      if (!fetchOk.success) {
        alert("URL cannot be loaded directly. Log in or download locally");
          // emit iframe download signal for url 
          await super.messaging.emit(DcNode.signals.URLOADPREFIX, url)
        return;
      }
      if (fetchOk.status == "geojson") {
        alert("Use GeoJson loader");
        return;
      }
    } catch (e) {
      alert("URL cannot be loaded directly");
      return;
    }
    const options = {
      headers: {
        Accept: "application/json",
        // Authorization: "Bearer YWRtaW46YWRtaW4="
      },
    } as JsonInputOptionsBrowser;
    /*
    this.df = await readCSVBrowser(url,csvOptions)
    */
    this.df = (await readJSONBrowser(url, options)) as DataFrame;
    this.df.print();
    if (!(await DcNode.providers.exists(super.id))) {
      // create item in pubstore if not exists
      await DcNode.providers.add(super.id, true); // file loaders are root nodes
    }
    await DcNode.providers.update(super.id, toJSON(this.df));
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
    await super.messaging.emit((DcNode.signals.UPDPREFIX as string) + super.id);
  }
  // overwrite upload function
  async upload(file: any) {
    if (file.length < 1) {
      throw new Error("Invalid upload");
    }
    const name = file[0].name;
    if (!(name.endsWith(".json") || name.endsWith(".geojson"))) {
      alert("Not a JSON/GeoJSON file?");
      return;
    }
    const options = {
      headers: {
        Accept: "application/json",
      },
    } as JsonInputOptionsBrowser;
    this.df = (await readJSONBrowser(file[0], options)) as DataFrame;
    this.df.print();
    this.df.ctypes.print();
    if (!(await DcNode.providers.exists(this.id))) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true); // file loaders are root nodes
    }
    await DcNode.providers.update(this.id, toJSON(this.df));
    await super.messaging.emit((DcNode.signals.UPDPREFIX as string) + this.id);
  }

  // getters
  get type() {
    return LoadJson._type;
  }
  get display() {
    return LoadJson._display;
  }
}
