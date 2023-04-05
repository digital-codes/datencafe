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
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,ports,edges)
    this._type = "datainfo"
    super.icon = "/img/widgets/DataInfo.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters/setters
  get type() { return this._type }
  // methods
  async updated(msg:string,y?:any) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + super.id +": " + String(this.updCnt))
    const dt = DcNode.providers.getDataById(src)
    const df = new DcNode.dfd.DataFrame(dt)
    const divId = DcNode.signals.PLOTPREFIX + super.id
    // check valid target id
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
    // get number of columns for table width adjustment
    // assume 5 rem per columns ~ 80 px
    const maxWidth = 600
    const width = ds1.columns.length * 80
    if (width > maxWidth) {
      if (!target.style) throw (new Error("No style on div"))
      //target.style.width = String(Math.min(width,maxWidth)) + "px"
      target.style.width = String(width) + "px"
    }
    ds1.plot(divId).table()

    /* compute table width from number of columns in display class
    and set width via item prop. Scrolling-X handled via chartitem  */

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

  
  