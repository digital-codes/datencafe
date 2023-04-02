// csv node class, extends DcNode

import {DcNode} from "./DcNode"

import {DataFrame, toJSON} from 'danfojs/dist/danfojs-browser/src';



export class RandomGen extends DcNode {
  // properties
  readonly _type: string
  _period = 5 // in seconds
  _cols = 3 // columns
  _rows = 10 // rows 
  private genCnt = 0
  private df = new DataFrame()
  private active = false
  private tm: any | null = null
  // constructor
  constructor(id?:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    super(id)
    this._type = "randomgen"
    super.icon = "/img/widgets/Random.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
    //RandomGen.insts.set(id,this)
  }
  // methods
  async generate () {
    this.genCnt++
    DcNode.print("Generate " + String(this.genCnt)) 
    const dt:any = {} // [[]] as number[][] 
    const rows = this._rows/2 + Math.floor(Math.random()*this._rows/2)
    for (let c=0;c<this._cols;c++) {
      const cl = [] as any[] // number[]
      for (let r=0;r<rows;r++) {
        switch (c) {
          case 0: {
            let s = ""
            for (let i=0;i<5;i++) {
              s += String.fromCharCode(65 + Math.floor(Math.random()*26))
            }
            cl.push(s)           
            }
            break;
          case 1:
            // int on col 1
            cl.push(Math.floor(Math.random()*100))
            break;
          default:
            cl.push(Math.random()*100)
        }
      }
      const key = "COL" + String(c+1)
      dt[key] = cl
    }
    this.df = await new DataFrame(dt)
    // this.df.print()
    //await DcNode.providers.update(super.id,toJSON(this.df))
    await DcNode.providers.update(super.id,toJSON(this.df))
    //await subscribers.update(d.id,d.ep)
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + super.id,2*this.genCnt)
 

    if (this.active == true) {
        // https://stackoverflow.com/questions/5911211/settimeout-inside-javascript-class-using-this
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?retiredLocale=de
      // using an arrow function with settimeout and class instance is important
      // to prepare proper "this" context
      this.tm = setTimeout(()=>{this.generate()},this._period*1000)
    }
  }
  async run() {
    if (this.active == true) return
    // add to store
    //DcNode.providers.add(super.id)
    DcNode.providers.add(super.id)
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
    DcNode.providers.remove(super.id)
    if (this.tm != null) {
      clearTimeout(this.tm)
      this.tm = null
    }
    DcNode.print("Stop generating @ " + String(this.genCnt)) 
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

  
  