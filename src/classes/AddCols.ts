// proc node class, extends DcNode


import { DcNode } from "./DcNode"
import { SigPort } from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';
import { DelayTimer } from "@/services/DelayTimer"

export class AddCols extends DcNode {
  // properties
  static _type = NodeTypes.PROC
  private updCnt = 0
  static _display = false
  // constructor
  constructor(id: string, typeInfo: any) {
    const ports: string[] = ['A', 'B']
    const edges: string[] = ['d']
    const cfg = {
      pop: "select",
      options:
      {
        id: "op",
        type: "string",
        label: "Operation",
        value: ["Join", "Append", "Add", "Sub", "Mul", "Div"],
        current: ""
      },
    }
    super(id, "addcols", ports, edges, cfg as any)
    DcNode.print(AddCols._type + " created") // no access to super._id etc here
    // add to providers
    DcNode.providers.add(super.id)
  }
  // getters/setters
  get type() { return AddCols._type }
  get display() { return AddCols._display }
  // methods
  async configure(option: string) {
    // we know the config structure here, so can just use the index
    this.config.options.current = option
    DcNode.print("Set option:" + option)
    // now check the sources and make the operation
    // both ports need to be connect, so we must have 2 signals
    DcNode.print("Signals attached:" + JSON.stringify(this.signals))
    // check if complete
    if (this.signals.length < 2) {
      return
    }
  }
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
    // check mode
    const mode = this.config.options.current
    if (mode == "") {
      DcNode.print("Mode not configured")
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
    const idxA = dfA.index
    const idxB = dfB.index
    console.log("DFs index:", idxA, idxB)
    // assume we need same index on both dataframes
    if (idxA.length != idxB.length) {
      DcNode.print("Indices not same length")
      return
    }
    // result df
    let df
    // Append mode
    if (mode == "Append") {
      DcNode.print("Append")
      df = DcNode.dfd.concat({ dfList: [dfA,dfB], axis: 1 })
    }
    // join mode on index col
    if (mode == "Join") {
      DcNode.print("Join")
      df = DcNode.dfd.merge({ "left": dfA, "right": dfB, "on": [dfA.columns[0]], how: "inner"})
    }
    // remaining ops
    if ( df === undefined) { 
      const colsA = dfA.selectDtypes(['float32', "int32"]).columns
      const colsB = dfB.selectDtypes(['float32', "int32"]).columns
      console.log("DF numeric cols:", colsA, colsB)
      // find matching columns for math ops
      const sharedCols: string[] = []
      colsA.forEach((c) => { if (colsB.includes(c)) sharedCols.push(c) })
      DcNode.print("Shared:" + JSON.stringify(sharedCols))
      // remove non-shared columns on both DFs
      colsA.forEach((c) => {
        if (!sharedCols.includes(c)) {
          dfA.drop({ columns: [c], inplace: true })
        }
      })
      colsB.forEach((c) => {
        if (!sharedCols.includes(c)) {
          dfB.drop({ columns: [c], inplace: true })
        }
      })
    // DF has math operations add,sub,mul,div
    DcNode.print("Performing operation:" + mode)
      switch (mode) {
        case "Add":
          df = dfA.add(dfB)
          break
        case "Sub":
          df = dfA.sub(dfB)
          break
        case "Mul":
          df = dfA.mul(dfB)
          break
        case "Div":
          df = dfA.div(dfB)
          break
        default:
          throw (new Error("Invalid mode:" + mode))
      }
    }

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
