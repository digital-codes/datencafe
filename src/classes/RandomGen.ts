// csv node class, extends DcNode

import {DcNode} from "./DcNode"

import {DataFrame, toJSON} from 'danfojs/dist/danfojs-browser/src';

import { NodeTypes } from '@/services/GlobalDefs';


export class RandomGen extends DcNode {
  // properties
  // FIXME  parms must go into config, together with active state
  static _display = false
  static _type = NodeTypes.GEN
  private genCnt = 0
  private df = new DataFrame()
  private active = false
  private tm: any | null = null
  // constructor
  constructor(id:string, typeInfo:any) {
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
          id:"cols",
          type:"number",
          label:"Numeric",
          value:"1",
          min:"1",
          max:"5"
        },
        {
          id:"text",
          type:"number",
          label:"Text",
          value:"1",
          min:"0",
          max:"1"
        },
        {
          id:"rows",
          type:"number",
          label:"Rows",
          value:"10",
          min:"1",
          max:"30"
        },
        {
          id:"period",
          type:"number",
          label:"Period (s)",
          value:"5",
          min:"1",
          max:"60"
        },
        {
          id:"run",
          type:"number",
          label:"Run",
          value:"0",
          min:"0",
          max:"1"
        }
      ]
    }
    super(id,"randomgen",ports,edges,cfg as any)
    DcNode.print(RandomGen._type + " created") // no access to super._id etc here
    //RandomGen.insts.set(id,this)
  }
  // methods
  async configure(options: any[]) {
    // we know the config structure here, so can just use the index
    const config = this.config
    options.forEach((o,i) => {
      config.options[i].value = o
    })
    this.config = config // update config
    const runIdx = this.config.options.findIndex((item:any) => {return item.id == "run"})
    if (runIdx == -1) throw (new Error("Invalid config at run"))
    if (parseInt(this.config.options[runIdx].value) == 0) {
      this.stop()
    } else {
      this.run()
    }
  }
  async generate () {
    if (!this.active) {
      DcNode.print("Terminated")
      return
    }

    this.genCnt++
    DcNode.print("Generate " + String(this.genCnt)) 
    const options = this.config.options
    const dt:any = {} // [[]] as number[][] 
    const rows = options[options.findIndex((o:any) => o.id == "rows")].value
    const cols = options[options.findIndex((o:any) => o.id == "cols")].value
    const txtCols = options[options.findIndex((o:any) => o.id == "text")].value
    const period = options[options.findIndex((o:any) => o.id == "period")].value
    for (let c=0;c<cols;c++) {
      const cl = [] as any[] // number[]
      for (let r=0;r<rows;r++) {
        cl.push(Math.random()*100)
      }
      const key = "COL" + String(c+1)
      dt[key] = cl
    }
    for (let c=0;c<txtCols;c++) {
      const cl = [] as any[] // number[]
      for (let r=0;r<rows;r++) {
        let s = ""
        for (let i=0;i<5;i++) {
          s += String.fromCharCode(65 + Math.floor(Math.random()*26))
        }
        cl.push(s)           
      }
      const key = "TCOL" + String(c+1)
      dt[key] = cl
    }
    this.df = await new DataFrame(dt)
    this.df.print()
    //await DcNode.providers.update(super.id,toJSON(this.df))
    await DcNode.providers.update(this.id,toJSON(this.df))
    //await subscribers.update(d.id,d.ep)
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id,2*this.genCnt)
 

    if (this.active == true) {
        // https://stackoverflow.com/questions/5911211/settimeout-inside-javascript-class-using-this
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?retiredLocale=de
      // using an arrow function with settimeout and class instance is important
      // to prepare proper "this" context
      this.tm = setTimeout(()=>{this.generate()},this.config.options[options.findIndex((o:any) => o.id == "period")].value*1000)
    }
  }
  async run() {
    if (this.active == true) return
    // add to store
    //DcNode.providers.add(super.id)
    await DcNode.providers.add(this.id)
    // start generator
    this.active = true
    DcNode.print("Start generating @ " + String(this.genCnt)) 
    await this.generate()
  }
  stop() {
    // stop generator
    this.active = false
    // remove
    //DcNode.providers.remove(super.id)
    if (!DcNode.providers.exists(this.id))
      return
    DcNode.providers.remove(this.id)
    if (this.tm != null) {
      clearTimeout(this.tm)
      this.tm = null
    }
    DcNode.print("Stop generating @ " + String(this.genCnt)) 
  }
  // getters/setters
  get type() { return RandomGen._type }
  get display() { return RandomGen._display }
} 

  
  
