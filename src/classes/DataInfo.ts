// csv node class, extends DcNode

import { DcNode } from "./DcNode"
import { SigPort } from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';
import { DelayTimer } from "@/services/DelayTimer"

export class DataInfo extends DcNode {
  // properties
  static _display = false
  static _type = NodeTypes.PROC
  private updCnt = 0
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    // fill na option
    const cfg = {
      pop: "value",
      options: [
        {
          id: "fillna",
          type: "number",
          label: "FILL",
          value: "0",
          min:"0",
          max:"1"
        },
      ]
    }

    super(id, "datainfo", ports, edges,cfg)
    DcNode.print(DataInfo._type + " created") // no access to super._id etc here
    // add to providers
    DcNode.providers.add(super.id)
  }
  // getters/setters
  get type() { return DataInfo._type }
  get display() { return DataInfo._display }
  // methods
  async configure(options: any[]) {
    // we know the config structure here, so can just use the index
    const config = this.config
    for (let i = 0; i < options.length; i++) {
      config.options[i].value = options[i]
    }
    // update
    this.config = config // update config
    // check if we have data already
    if (this.signals.length < 1) {
      return
    }
    DcNode.print("Updating with:" + this.signals[0].signal)
    await this.messaging.emit(this.signals[0].signal)
  }
  async updated(msg: string, y?: any) {
    // with a single source we are sure that update can deliver valid data
    // no need to check "hasData"
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + this.id + ": " + String(this.updCnt))
    const dt = await DcNode.providers.getDataById(src)
    const df = await new DcNode.dfd.DataFrame(dt)
    // check fillna
    if (this.config.options[0].value != "0") {
      // NA values prevent describe!
      await df.fillNa(0,{inplace:true})
    } 
    // simple plot is missing row dlabels
    //df.describe().plot(divId).table()
    try {
      const ds = await df.describe()
      // create right column order
      const ds1 = await new DcNode.dfd.DataFrame({ "Type": ds.index })
      ds.columns.forEach(async (c) => {
        await ds1.addColumn(c, ds.column(c), { inplace: true });
      })
      //await DcNode.providers.update(super.id,toJSON(this.df))
      await DcNode.providers.update(this.id, DcNode.dfd.toJSON(ds1))
      //await subscribers.update(d.id,d.ep)
      await DelayTimer(20)
      await this.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)
    } catch (e) {
      alert("Try to set 'FILL' option")
      return
    }

  }
  msgOn(x: string, y: string) {
    // set event listener for signal 
    DcNode.print("msg ON for " + x + " on port " + y)
    this.messaging.on(x, (y: any) => { this.updated(x, y) })
    const sigs = this.signals
    if (sigs.find(s => s.signal == x) === undefined) {
      sigs.push({ signal: x, port: y } as SigPort)
    }
    this.signals = sigs
    DcNode.print("Signals now: " + JSON.stringify(this.signals))
  }
  msgOff(x: string) {
    // set event listener for signal 
    DcNode.print("msg OFF for " + x)
    this.messaging.off(x)
    const sigs = this.signals
    const idx = sigs.findIndex(s => s.signal == x)
    if (idx == -1) throw (new Error("Invalid signal"))
    sigs.splice(idx, 1)
    this.signals = sigs
    DcNode.print("Signals now: " + JSON.stringify(this.signals))
  }

}



