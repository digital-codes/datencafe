// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';
import { DelayTimer } from "@/services/DelayTimer"

export class DataInfo extends DcNode {
  // properties
  static _display = false
  static _type = NodeTypes.PROC
  private updCnt = 0
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,"datainfo",ports,edges)
    DcNode.print(DataInfo._type + " created") // no access to super._id etc here
    // add to providers
    DcNode.providers.add(super.id)
  }
  // getters/setters
  get type() { return DataInfo._type }
  get display() { return DataInfo._display }
  // methods
  async updated(msg:string,y?:any) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + super.id +": " + String(this.updCnt))
    const dt = DcNode.providers.getDataById(src)
    const df = new DcNode.dfd.DataFrame(dt)
    // simple plot is missing row dlabels
    //df.describe().plot(divId).table()
    const ds = await df.describe()
    // create right column order
    const ds1 = await new DcNode.dfd.DataFrame({"Type": ds.index})
    ds.columns.forEach(async (c) => {
      await ds1.addColumn(c, ds.column(c), {inplace:true});
    })
    //await DcNode.providers.update(super.id,toJSON(this.df))
    await DcNode.providers.update(super.id,DcNode.dfd.toJSON(ds1))
    //await subscribers.update(d.id,d.ep)
	await DelayTimer(20)
    await super.messaging.emit(DcNode.signals.UPDPREFIX as string + super.id)

  }
  msgOn(x: string) {
    // set event listener for signal 
    DcNode.print("msg ON for " + x)
    super.messaging.on(x,(y:any)=>{this.updated(x,y)})
    const sigs = this.signals
    if (!sigs.includes(x)) {
      sigs.push(x)
      this.signals = sigs
    }
    DcNode.print("Signals now: " + JSON.stringify(x))
  }
  msgOff(x: string) {
    // set event listener for signal 
    DcNode.print("msg OFF for " + x)
    super.messaging.off(x)
    const sigs = this.signals
    const idx = sigs.findIndex(s => s == x)
    if (idx == -1) throw (new Error("Invalid signal"))
    sigs.splice(idx,1)
    this.signals = sigs
    DcNode.print("Signals now: " + JSON.stringify(sigs))
  }

} 

  
  
