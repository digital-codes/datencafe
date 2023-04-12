// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';

export class LinePlot extends DcNode {
  // properties
  private updCnt = 0
  static _display = true
  static _type = NodeTypes.CHART //"chart"
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,ports,edges)
    DcNode.print(LinePlot._type + " created") // no access to super._id etc here
  }
  // getters/setters
  get type() { return LinePlot._type }
  get display() { return LinePlot._display }
  // methods
  async updated(msg:string,y?:any) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + super.id +": " + String(this.updCnt) + "..." + String(y))
    const dt = DcNode.providers.getDataById(src) 
    const df = new DcNode.dfd.DataFrame(dt)
    const divId = DcNode.pre.PLOTPREFIX + super.id
    const target = await document.getElementById(divId)
    if ((target === undefined) || (target == null) ) {
      throw (new Error("Invalid ID: " + String(divId)))
    }
    await df.plot(divId).line()
    //await super.messaging.emit(divId) // div used for signalling ..
    /*
    df.describe().print()
    df.print()
    */
  }
  msgOn(x: string) {
    // set event listener for signal 
    DcNode.print("msg ON for " + x)
    super.messaging.on(x,(y:any)=>{this.updated(x,y)})
    const sigs = super.signals
    if (!sigs.includes(x)) {
      sigs.push(x)
      super.signals = sigs
    }
    DcNode.print("Signals now: " + JSON.stringify(x))
  }
  msgOff(x: string) {
    // set event listener for signal 
    DcNode.print("msg OFF for " + x)
    super.messaging.off(x)
    const sigs = super.signals
    const idx = sigs.findIndex(s => s == x)
    if (idx == -1) throw (new Error("Invalid signal"))
    sigs.splice(idx,1)
    super.signals = sigs
    DcNode.print("Signals now: " + JSON.stringify(sigs))
  }
} 

  
  
