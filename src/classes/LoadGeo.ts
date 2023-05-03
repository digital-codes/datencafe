// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { DataFrame, toJSON } from "danfojs/dist/danfojs-browser/src";
import { NodeSpec } from "@/services/GlobalDefs";
import { StorageTypes } from "@/services/GlobalDefs";

import { readJSONBrowser } from "danfojs/dist/danfojs-base/io/browser";
import { JsonInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch";

export class LoadGeo extends DcNode {
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
    super(id, "loadgeo", ports, edges, cfg as any);
    DcNode.print(LoadGeo._type + " created"); // no access to super._id etc here
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
    console.log(fetchResult,fetchResult.success)
    if (!fetchResult.success) {
      alert("URL cannot be loaded directly. Log in or load locally");
      await super.messaging.emit(DcNode.signals.URLOADPREFIX, url)
      return;
    }
    await this.saveContent(fetchResult.data)
  }
  // overwrite upload function
  async upload(files: any) {
    if (files.length < 1) {
      throw new Error("Invalid upload");
    }
    const name = files[0].name;
    if (!(name.endsWith(".json") || name.endsWith(".geojson"))) {
      alert("Not a JSON/GeoJSON file?");
      return;
    }
    const reader = new FileReader();
    const content  = await new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;

      reader.readAsText(files[0]);
    });

    const json = JSON.parse(content as string)
    await this.saveContent(json)
  }
  // save the stuff, if geojson
  async saveContent (data:any) {
    if (!(Object.keys(data).includes("type")) && (data.type.toLowerCase() == "FeatureCollection".toLowerCase())) {
      alert("No Geo Feature Collection");
      return;
    }
    if (!(await DcNode.providers.exists(this.id))) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true); // file loaders are root nodes
    }
    //await DcNode.providers.update(super.id, JSON.stringify(data));
    const meta = await DcNode.providers.getMeta(this.id)
    const dt = await new Date().toISOString()
    meta.date = dt
    // set storage type of this class
    meta.storagetype = StorageTypes.FEATURESET
    await DcNode.providers.update(this.id, data,meta);
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
    await super.messaging.emit((DcNode.signals.UPDPREFIX as string) + super.id);

  }

  // getters
  get type() {
    return LoadGeo._type;
  }
  get display() {
    return LoadGeo._display;
  }
}
