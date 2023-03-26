// csv node class, extends DcNode

import {DcNode} from "./DcNode"

import * as dfd from 'danfojs/dist/danfojs-browser/src';

export class RandomGen extends DcNode {
  // properties
  readonly _type: string
  _period = 5 // in seconds
  _cols = 3 // columns
  _rows = 10 // rows 
  private df = new dfd.DataFrame()
  private active = false
  private tm: any | null = null
  private genFun: any | null = null
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    super(id)
    this._type = "randomgen"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // methods
  private async generate () {
    DcNode.print("Generate") 
    const dt:any = {} // [[]] as number[][] 
    for (let c=0;c<this._cols;c++) {
      const cl = [] as number[]
      for (let r=0;r<this._rows;r++) {
        cl.push(Math.random()*100)
      }
      const key = "COL" + String(c+1)
      dt[key] = cl
    }
    console.log(dt)
    this.df = await new dfd.DataFrame(dt)
    await this.df.print()

    if (this.active == true) {
      // https://stackoverflow.com/questions/5911211/settimeout-inside-javascript-class-using-this
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?retiredLocale=de
      this.genFun = this.generate.bind(this)
      console.log("genf:",this.genFun)
      this.tm = setTimeout(this.genFun,this._period * 1000)
      console.log("tm:",this.tm)
    }
  }
  async run() {
    if (this.active == true) return
    // start generator
    this.active = true
    await this.generate()
    DcNode.print("Start generating") 
  }
  stop() {
    // stop generator
    this.active = false
    if (this.genFun != null) {
      const r = this.genFun as RandomGen
      r.active = false
      this.genFun = null
    }
    if (this.tm != null) {
      clearTimeout(this.tm.bind(this))
      this.tm = null
    }
    DcNode.print("Stop generating") 
  }
  // getters/setters
  get type() { return this._type }
  get period() {return this._period}
  set period(x) {this._period = x}
  get cols() {return this._cols}
  set cols(x) {this._cols = x}
  get rows() {return this._rows}
  set rows(x) {this._rows = x}
} 

  
  