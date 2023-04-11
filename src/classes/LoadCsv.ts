// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import {DataFrame, toJSON} from 'danfojs/dist/danfojs-browser/src';
import { NodeTypes } from '@/services/GlobalDefs';

import { readCSVBrowser } from "danfojs/dist/danfojs-base/io/browser"
import { CsvInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch" 

export class LoadCsv extends DcNode {
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
    super(id,ports,edges,cfg as any)
    DcNode.print(LoadCsv._type + " created") // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  async configure(options: any[]) {
    console.log("configure with: ",options)
    if (options[0] != "") {
      const url = options[0]
      console.log("Config URL: ",url)
      await this.load(url)
    } 
  }
  async load (url: string) {
  DcNode.print("Load on " + String(super.name))
  if (url === undefined) throw (new Error("Invalid URL"))
  if (!await DcNode.providers.exists(super.id)) {
    // create item in pubstore if not exists
    await DcNode.providers.add(super.id)
  }
  try {
      const fetchOk = await testFetch(url)
      console.log("Test:",fetchOk)
      if (!fetchOk) {
        alert("URL cannot be loaded directly")
        return
      }      
    } catch (e) {
      console.log("Fetch failed: ",e)
      alert("URL cannot be loaded directly")
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
    } as CsvInputOptionsBrowser
    this.df = await readCSVBrowser(url,csvOptions)
    this.df.print()
    /*
    console.log("Values:",this.df.values)
    console.log("Columns:",this.df.columns)
    */
    await DcNode.providers.update(super.id,toJSON(this.df))
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + super.id)
  }

  // getters
  get type() { return LoadCsv._type }
  get display() { return LoadCsv._display }

} 

  
  
