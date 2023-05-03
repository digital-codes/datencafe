// csv node class, extends DcNode

import { DcNode } from "./DcNode"
//import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';
import { NodeSpec } from '@/services/GlobalDefs';
import { StorageTypes } from "@/services/GlobalDefs";

import { readCSVBrowser } from "danfojs/dist/danfojs-base/io/browser"
//import { CsvInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
//import testFetch from "@/services/TestFetch"
import { UserStore } from "@/services/UserStore";
const userStore = UserStore()

const defaultCsvOptions = {
  //delimiter: ",",
  delimitersToGuess: [',', ';'],
  //escapeChar:"\\",
  //quoteChar:"\"",
  header: true, // header row
  preview: 0, // > 0 is how many lines previews
  skipEmptyLines: true
} as any //CsvInputOptionsBrowser

export class LoadCsv extends DcNode {
  // properties
  static _display = false
  static _type = NodeSpec.INPUT
  private df = new DcNode.dfd.DataFrame()
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
      ]
    }
    super(id, "loadcsv", ports, edges, cfg as any)
    DcNode.print(LoadCsv._type + " created") // no access to super._id etc here
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
    DcNode.print("Load on " + String(this.name))
    if (url === undefined) throw (new Error("Invalid URL"))
    if (!url.includes("http")) {
      // local urls supported ... detect full host address with port number ...
      url = window.location.href.split(window.location.pathname)[0] + url
    }
    const fetchResult = await DcNode.fetchFile(url, "csv")
    if (!fetchResult.success) {
      alert("URL cannot be loaded directly. Log in or load locally");
      await super.messaging.emit(DcNode.signals.URLOADPREFIX, url)
    } else {
      // Create a new Blob object from the CSV string
      const blob = new Blob([fetchResult.data], { type: 'text/csv' });
      // Create a new File object from the Blob object
      const file = new File([blob], url, { type: 'text/csv' });
      this.df = await readCSVBrowser(file, defaultCsvOptions)

      // this.df = await readCSVBrowser(fetchResult.data, defaultCsvOptions)
      this.df.print()
      this.df.ctypes.print()
      if (!await DcNode.providers.exists(this.id)) {
        // create item in pubstore if not exists
        await DcNode.providers.add(this.id, true) // file loaders are root nodes
      }
      const meta = await DcNode.providers.getMeta(this.id)
      const dt = await new Date().toISOString()
      meta.date = dt
      // set storage type of this class
      meta.storagetype = StorageTypes.DATAFRAME
      await DcNode.providers.update(this.id, DcNode.dfd.toJSON(this.df),meta)
      await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
      await super.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)
    }
  }
  // overwrite upload function
  async upload(file: any) {
    if (file.length < 1) {
      throw (new Error("Invalid upload"))
    }
    const name = file[0].name
    if (!name.endsWith(".csv")) {
      alert("Not a CVS file?")
      return
    }
    const csvOptions = defaultCsvOptions
    this.df = await readCSVBrowser(file[0], csvOptions)
    this.df.print()
    this.df.ctypes.print()
    if (!await DcNode.providers.exists(this.id)) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true) // file loaders are root nodes
    }
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(this.df))
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)

  }
  // getters
  get type() { return LoadCsv._type }
  get display() { return LoadCsv._display }

}



