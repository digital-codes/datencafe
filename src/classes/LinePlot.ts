// csv node class, extends DcNode

import {DcNode} from "./DcNode"

export class LinePlot extends DcNode {
  // properties
  readonly _type: string
  private updCnt = 0
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    super(id)
    this._type = "linechart"
    super.icon = "/img/widgets/LinePlot.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters/setters
  get type() { return this._type }
  // methods
  async updated(msg:string) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + this.id +": " + String(this.updCnt))
    const dt = DcNode.providers.getDataById(src)
    const df = new DcNode.dfd.DataFrame(dt)
    /*
    df.describe().print()
    df.print()
    */
  }
  msgOn(x: string) {
    // set event listener for signal 
    DcNode.print("msg on for " + x)
    this.messaging.on(x,()=>{this.updated(x)})
  }
  msgOff(x: string) {
    // set event listener for signal 
    DcNode.print("msg off for " + x)
    this.messaging.off(x)
  }

} 

  
  