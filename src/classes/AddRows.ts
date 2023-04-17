// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import {SigPort} from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';
import { DelayTimer } from "@/services/DelayTimer"

export class AddRows extends DcNode {
  // properties
  static _display = false
  private updCnt = 0
  static _type = NodeTypes.PROC
  // constructor
  constructor(id: string, typeInfo: any) {
    const ports: string[] = ['A', 'B']
    const edges: string[] = ['d']
    super(id, "addrows", ports, edges)
    DcNode.print(AddRows._type + " created") // no access to super._id etc here
    // add to providers
    DcNode.providers.add(super.id)
  }
  // getters
  get type() { return AddRows._type }
  get display() { return AddRows._display }
  async updated(msg: string, y?: any) {
    // update only when both ports attached
    // with 2 source we are neet to check if both are valid
    // check with "hasData"
    DcNode.print("Update for " + msg + ", " + this.id + "," + JSON.stringify(this.signals))
    // check ports
    if (this.signals.length < 2) {
      DcNode.print("Update. Too few sources for " + this.id)
      return
    }
    // in this case, we need to iterate over the attached signals to find the sources
    // to be more precise, we need to find source for port a and b selectively
    const sigA = this.signals.find(s => s.port == "A")
    const sigB = this.signals.find(s => s.port == "B")
    if ((sigA == undefined) || (sigB === undefined))
      throw (new Error("Invalid signals"))
    // even if sources attached, data might not be available. check this first
    if (!DcNode.providers.hasData(sigA.signal.split("-")[1])) {
      DcNode.print("No data port A")
      return
    }
    if (!DcNode.providers.hasData(sigB.signal.split("-")[1])) {
      DcNode.print("No data port B")
      return
    }
    // go ahead
    DcNode.print("Updating with input ports attached")
    this.updCnt++
    // retrieve data
    const dtA = await DcNode.providers.getDataById(sigA.signal.split("-")[1])
    const dfA = await new DcNode.dfd.DataFrame(dtA)
    const dtB = await DcNode.providers.getDataById(sigB.signal.split("-")[1])
    const dfB = await new DcNode.dfd.DataFrame(dtB)
    dfA.print()
    dfB.print()
    // result df
    const df = DcNode.dfd.concat({ dfList: [dfA,dfB], axis: 0 })

    // put data into store then send message
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(df))
    await DelayTimer(20)
    await this.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)
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


