// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import {DataFrame, toJSON} from 'danfojs/dist/danfojs-browser/src';
import { NodeSpec } from '@/services/GlobalDefs';

import { readCSVBrowser } from "danfojs/dist/danfojs-base/io/browser"
import { CsvInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch" 
import { UserStore } from "@/services/UserStore";
const userStore = UserStore()

const defaultCsvOptions = {
  //delimiter: ",",
  delimitersToGuess: [',', ';'],
  //escapeChar:"\\",
  //quoteChar:"\"",
  header:true, // header row
  preview:0, // > 0 is how many lines previews
  skipEmptyLines:true
} as any //CsvInputOptionsBrowser

export class LoadCsv extends DcNode {
  // properties
  static _display = false
  static _type = NodeSpec.INPUT
  private df = new DataFrame()
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = []
    const edges: string[] = ["d"]
    // keep config in instance, the values will be stored here too ...
    const cfg = {
      pop:"value",
      options: [
        {
          id:"url",
          type:"url",
          label:"URL",
          value:""
        }
      ]
    }
    super(id,"loadcsv",ports,edges,cfg as any)
    DcNode.print(LoadCsv._type + " created") // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  async configure(options: any[]) {
    console.log("configure with: ",options)
    // we know the config structure here, so can just use the index
    if (options[0] != "") {
      const url = options[0]
      //console.log("Config URL: ",url)
      const config = this.config
      //console.log("Old config: ",config)
      // set the config value(s)
      config.options[0].value = url
      this.config = config // update config
      await this.load(url)
    } 
  }
  async load (url: string) {
  DcNode.print("Load on " + String(this.name))
  if (url === undefined) throw (new Error("Invalid URL"))
  if (!url.includes("http")) {
    // local urls supported ... detect full host address with port number ...
    url = window.location.href.split(window.location.pathname)[0]  + url
    console.log("Local url: ",url)
  }
  let corsRequired = false
  try {
      const fetchOk = await testFetch(url,"csv")
      console.log("Test:",fetchOk)
      if (!fetchOk.success) {
        const userStore = UserStore()
        if (userStore.exists()) {
          corsRequired = true
        } else {
          alert("URL cannot be loaded directly. Log in and retry")
          return
        }
      }      
    } catch (e) {
      console.log("Fetch failed: ",e)
      alert("URL cannot be loaded directly2")
      return
    }
    const csvOptions = defaultCsvOptions
    // maybe try cors as well
    if (corsRequired) {
      try {
        const fetchOk = await testFetch(url,"csv", true)
        console.log("Test:",fetchOk)
        if (!fetchOk.success) {
          alert("CORS loading failed. Check URL")
            return
        }
        // update url and hdrs
        url = fetchOk.url
        csvOptions.downloadRequestHeaders = {"Authorization":"Bearer " + userStore.getToken()}
      } catch (e) {
        console.log("Fetch failed: ",e)
        alert("URL cannot be loaded. Check URL")
        return
      }
    } 
    this.df = await readCSVBrowser(url,csvOptions)
    this.df.print()
    this.df.ctypes.print()
    /*
    console.log("Values:",this.df.values)
    console.log("Columns:",this.df.columns)
    */
    if (!await DcNode.providers.exists(this.id)) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id,true) // file loaders are root nodes
    }
    await DcNode.providers.update(this.id,toJSON(this.df))
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)
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
    this.df = await readCSVBrowser(file[0],csvOptions)
    this.df.print()
    this.df.ctypes.print()
    if (!await DcNode.providers.exists(this.id)) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id,true) // file loaders are root nodes
    }
    await DcNode.providers.update(this.id,toJSON(this.df))
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)

  }
  // getters
  get type() { return LoadCsv._type }
  get display() { return LoadCsv._display }

} 

  
  
