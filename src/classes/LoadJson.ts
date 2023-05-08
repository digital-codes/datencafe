// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { DataFrame, toJSON } from "danfojs/dist/danfojs-browser/src";
import { NodeSpec } from "@/services/GlobalDefs";
import { StorageTypes } from "@/services/GlobalDefs";

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
    super(id, "loadjson", ports, edges, cfg as any);
    DcNode.print(LoadJson._type + " created"); // no access to super._id etc here
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
    for (const m of ["url","license","attribution"]) {
      const idx = this.config.options.findIndex((o: any) => o.id == m)
      const val = this.config.options[idx].value
      if (val != "") {
        meta[m] = val // set meta
      }
    }
    await DcNode.providers.setMeta(this.id,meta)
  }
  async load(url: string) {
    DcNode.print("Load on " + String(super.name));
    if (url === undefined) throw new Error("Invalid URL");
    if (!url.includes("http")) {
      // local urls supported ... detect full host address with port number ...
      url = window.location.href.split(window.location.pathname)[0] + url;
    }
    const fetchResult = await DcNode.fetchFile(url, "json")
    if (!fetchResult.success) {
      alert("URL cannot be loaded directly. Log in or load locally");
      await super.messaging.emit(DcNode.signals.URLOADPREFIX, url)
      return;
    }
    if ((Object.keys(fetchResult.data).includes("type")) && (fetchResult.data.type.toLowerCase() == "FeatureCollection".toLowerCase() )) {
      alert("Use GeoJson loader");
      return;
    }
    const blob = new Blob([JSON.stringify(fetchResult.data)], { type: 'application/json' });
    // Create a new File object from the Blob object
    const file = new File([blob], url, { type: 'application/json' });
    const options = {
      headers: {
        Accept: "application/json",
        // Authorization: "Bearer YWRtaW46YWRtaW4="
      },
    } as JsonInputOptionsBrowser;
    this.df = (await readJSONBrowser(file, options)) as DataFrame;
    this.df.print();
    if (!(await DcNode.providers.exists(super.id))) {
      // create item in pubstore if not exists
      await DcNode.providers.add(super.id, true); // file loaders are root nodes
    }
    const meta = await DcNode.providers.getMeta(this.id)
    const dt = await new Date().toISOString()
    meta.date = dt
    // set storage type of this class
    meta.storagetype = StorageTypes.DATAFRAME
    await DcNode.providers.update(this.id, toJSON(this.df),meta);
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
    try {
      this.df = (await readJSONBrowser(file[0], options)) as DataFrame;
      this.df.print();
      this.df.ctypes.print();
      if (!(await DcNode.providers.exists(this.id))) {
        // create item in pubstore if not exists
        await DcNode.providers.add(this.id, true); // file loaders are root nodes
      }
      await DcNode.providers.update(this.id, toJSON(this.df));
      await super.messaging.emit((DcNode.signals.UPDPREFIX as string) + this.id);
    } catch {
      alert("Cannot load this. Is it GeoJSON?")
    }
  }

  // getters
  get type() {
    return LoadJson._type;
  }
  get display() {
    return LoadJson._display;
  }
}
