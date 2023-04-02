// csv node class, extends DcNode

import {DcNode} from "./DcNode"
// provider/subscriber
import { PubStore } from '../services/PubStore'
//const providers = PubStore()

export class BarPlot extends DcNode {
  // properties
  readonly _type: string
  private updCnt = 0
  readonly providers:any = PubStore()
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    super(id)
    this._type = "barchart"
    super.icon = "/img/widgets/BarPlot.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters/setters
  get type() { return this._type }
  // methods
  async updated(msg:string,y?:any) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + super.id +": " + String(this.updCnt))
    const dt = this.providers.getDataById(src)
    const df = new DcNode.dfd.DataFrame(dt)
    const divId = DcNode.signals.PLOTPREFIX + super.id
    console.log("Target:",divId)
    const target = document.getElementById(divId)
    if ((target === undefined) || (target == null) ) {
      throw (new Error("Invalid ID: " + String(divId)))
    }
    await df.plot(divId).bar()
    await super.messaging.emit(divId) // div used for signalling ..
    /*
    df.describe().print()
    df.print()
    */
  }
  msgOn(x: string) {
    // set event listener for signal 
    DcNode.print("msg on for " + x)
    super.messaging.on(x,(y:any)=>{this.updated(x,y)})
  }
  msgOff(x: string) {
    // set event listener for signal 
    DcNode.print("msg off for " + x)
    super.messaging.off(x)
  }

} 

  
  