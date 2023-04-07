// csv node class, extends DcNode

import {DcNode} from "./DcNode"

import { NodeTypes } from '../services/GlobalDefs';


export class TablePlot extends DcNode {
  // properties
  static _display = true
  static _type = NodeTypes.TABLE
  private updCnt = 0
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,ports,edges)
    DcNode.print(TablePlot._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return TablePlot._type }
  get display() { return TablePlot._display }
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
    await df.plot(divId).table()
  }
  msgOn(x: string) {
    // set event listener for signal 
    DcNode.print("msg ON for " + x)
    super.messaging.on(x,(y:any)=>{this.updated(x,y)})
  }
  msgOff(x: string) {
    // set event listener for signal 
    DcNode.print("msg OFF for " + x)
    super.messaging.off(x)
  }

} 

  
  
