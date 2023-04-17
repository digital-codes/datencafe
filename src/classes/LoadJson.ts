// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import {DataFrame, toJSON} from 'danfojs/dist/danfojs-browser/src';
import { NodeTypes } from '@/services/GlobalDefs';

import { readJSONBrowser } from "danfojs/dist/danfojs-base/io/browser"
import { JsonInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch" 

export class LoadJson extends DcNode {
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
    super(id,"loadjson",ports,edges,cfg as any)
    DcNode.print(LoadJson._type + " created") // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  async configure(options: any[]) {
    console.log("configure with: ",options)
    // we know the config structure here, so can just use the index
    if (options[0] != "") {
      const url = options[0]
      //console.log("Config URL: ",url)
      const config = super.config
      //console.log("Old config: ",config)
      // set the config value(s)
      config.options[0].value = url
      super.config = config // update config
      await this.load(url)
    } 
  }
  async load (url: string) {
  DcNode.print("Load on " + String(super.name))
  if (url === undefined) throw (new Error("Invalid URL"))
  if (!await DcNode.providers.exists(super.id)) {
    // create item in pubstore if not exists
    await DcNode.providers.add(super.id,true) // file loaders are root nodes
  }
  if (!url.includes("http")) {
    // local urls supported ... detect full host address with port number ...
    url = window.location.href.split(window.location.pathname)[0]  + url
    console.log("Local url: ",url)
  }
  try {
      const fetchOk = await testFetch(url,false,true) // check for feature collection 
      console.log("Test:",fetchOk)
      if (!fetchOk.success) {
        alert("URL cannot be loaded directly")
        return
      }
      if (fetchOk.status == "geojson") {
        alert("Use GeoJson loader")
        return
      }      
    } catch (e) {
      console.log("Fetch failed: ",e)
      alert("URL cannot be loaded directly")
      return
    }
    const options = {
        headers: {
          Accept: "application/json",
          // Authorization: "Bearer YWRtaW46YWRtaW4="
        }
    } as JsonInputOptionsBrowser
    /*
    this.df = await readCSVBrowser(url,csvOptions)
    */
    this.df = await readJSONBrowser(url,options) as DataFrame
    this.df.print()
    /*
    console.log("Values:",this.df.values)
    console.log("Columns:",this.df.columns)
    */
    await DcNode.providers.update(super.id,toJSON(this.df))
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + super.id)
  }

  // getters
  get type() { return LoadJson._type }
  get display() { return LoadJson._display }

} 

  
  
