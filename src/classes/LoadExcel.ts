// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import {DataFrame, toJSON} from 'danfojs/dist/danfojs-browser/src';
import { NodeTypes } from '@/services/GlobalDefs';

import { CsvInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch" 
import { UserStore } from "@/services/UserStore";
const userStore = UserStore()

export class LoadExcel extends DcNode {
  // properties
  static _display = false
  static _type = NodeTypes.INPUT
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
    super(id,"loadexcel",ports,edges,cfg as any)
    DcNode.print(LoadExcel._type + " created") // no access to super._id etc here
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
  if (!await DcNode.providers.exists(this.id)) {
    // create item in pubstore if not exists
    await DcNode.providers.add(this.id,true) // file loaders are root nodes
  }
  if (!url.includes("http")) {
    // local urls supported ... detect full host address with port number ...
    url = window.location.href.split(window.location.pathname)[0]  + url
    console.log("Local url: ",url)
  }

  // probably we have to use fetch to get an array buffer, which can be loaded by loadExcel
  // see https://docs.sheetjs.com/docs/solutions/input

  let corsRequired = false
  try {
      const fetchOk = await testFetch(url,"xls")
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
    const csvOptions = {
      //delimiter: ",",
      delimitersToGuess: [',', ';'],
      //escapeChar:"\\",
      //quoteChar:"\"",
      header:true, // header row
      preview:0, // > 0 is how many lines previews
      skipEmptyLines:true
    } as any //CsvInputOptionsBrowser
    // maybe try cors as well
    if (corsRequired) {
      try {
        const fetchOk = await testFetch(url,"xls", true)
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
    this.df = await DcNode.dfd.readExcel(url,csvOptions) as DataFrame
    this.df.print()
    this.df.ctypes.print()
    /*
    console.log("Values:",this.df.values)
    console.log("Columns:",this.df.columns)
    */
    await DcNode.providers.update(this.id,toJSON(this.df))
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)
  }

  // getters
  get type() { return LoadExcel._type }
  get display() { return LoadExcel._display }

} 

  
  
