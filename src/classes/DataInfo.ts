// csv node class, extends DcNode

import {DcNode} from "./DcNode"

export class DataInfo extends DcNode {
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
    this._type = "datainfo"
    super.icon = "/img/widgets/DataInfo.png"
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
    const divId = DcNode.signals.PLOTPREFIX + this.id
    console.log("Target:",divId)
    const target = document.getElementById(divId)
    if ((target === undefined) || (target == null) ) {
      throw (new Error("Invalid ID: " + String(divId)))
    }
    // simple plot is missing row dlabels
    //df.describe().plot(divId).table()
    const ds = df.describe()
    // create right column order
    const ds1 = new DcNode.dfd.DataFrame({"Type": ds.index})
    ds.columns.forEach((c) => {
      ds1.addColumn(c, ds.column(c), {inplace:true});
    })
    ds1.plot(divId).table()
  /* compute table width from number of columns in display class
  and set width via item prop. Scrolling-X handled via chartitem  */

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

  
  