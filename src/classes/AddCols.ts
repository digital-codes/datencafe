// proc node class, extends DcNode


import { DcNode } from "./DcNode"
import { SigPort } from "./DcNode"
import { NodeSpec } from '@/services/GlobalDefs';
import { DelayTimer } from "@/services/DelayTimer"
import { StorageTypes } from "@/services/GlobalDefs";

export class AddCols extends DcNode {
  // properties
  static _type = NodeSpec.PROC
  private updCnt = 0
  static _display = false
  // constructor
  constructor(id: string, typeInfo: any) {
    const ports: string[] = ['A', 'B']
    const edges: string[] = ['d']
    const cfg = {
      pop: "mixed",
      options:
        [
          {
            id: "op",
            type: "string",
            label: "Operation",
            select: true,
            /*
            value: ["Join", "Append", "Add", "Sub", "Mul", "Div"],
            */
            value: ["Append", "Add", "Sub", "Mul", "Div"],
            current: ""
          },
        ]
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
  async configure(optionString: string) {
    // we know the config structure here, so can just use the index
    const options = JSON.parse(optionString)
    for (let i = 0; i < this.config.options.length; i++) {
      this.config.options[i].current = options[i]
      DcNode.print("Set option:" + options[i])
    }
    // now check the sources and make the operation
    // both ports need to be connect, so we must have 2 signals
    DcNode.print("Signals attached:" + JSON.stringify(this.signals))
    // check if complete
    if (this.signals.length < 2) {
      return
    }
    // just use first signal to trigger an update
    DcNode.print("Updating with:" + this.signals[0].signal)
    await this.messaging.emit(this.signals[0].signal)
  }
  // ---------------------------------------------------------
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

    // both ports connected. check columns and create config
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
    // -------
    // ------------------------
    /* old
    // check mode
    const mode = this.config.options[0].current
    if (mode == "") {
      DcNode.print("Mode not configured")
      return
    } 
    */


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
    // assume we need same index on both dataframes
    if (idxA.length != idxB.length) {
      DcNode.print("Indices not same length")
      return
    }
    // we have 2 ports, save type of columns, update config
    // get A and B columns
    const colsA = dfA.columns
    const colsB = dfB.columns
    const colsAB = colsA.filter(item => colsB.includes(item)).sort()
    const colsAOnly = colsA.filter(item => !colsB.includes(item)).sort()
    const colsBOnly = colsB.filter(item => !colsA.includes(item)).sort()
    // rename colsA and B, in Dtaaframe and list!
    const colMapA:any = {}
    for (const idx in colsAOnly) {
      colMapA[colsAOnly[idx]] = colsAOnly[idx] + "_A"
      colsAOnly[idx] = colsAOnly[idx] + "_A"
    }
    dfA.rename(colMapA, {axis:1, inplace:true});
    dfA.print()
    const colMapB:any = {}
    for (const idx in colsBOnly) {
      colMapB[colsBOnly[idx]] = colsBOnly[idx] + "_B"
      colsBOnly[idx] = colsBOnly[idx] + "_B"
    }
    dfB.rename(colMapB, {axis:1, inplace:true})
    dfB.print()

    const colsAll = [...colsAB, ...colsAOnly, ...colsBOnly].sort()
    const currentCols = this.config.options.map((o:any) => o.label).sort()
    console.log("old, new", colsAB, colsAOnly, colsBOnly, colsAll, currentCols)

    const haveSameElements = currentCols.every((value:any, index:number) => value === colsAll[index]);
    if (!haveSameElements) {
      // redo config here ...
      const config = this.config;
      config.pop = "mixed";

      config.options = []
      // push common cols
      for (const c of colsAB) {
        config.options.push(
          {
            id: c,
            type: "string",
            label: c,
            select: true,
            value: ["Ignore", "Port-A", "Port-B", "Append", "Add", "Sub", "Mul", "Div"],
            current: "Ignore",
          }
        )
      }
      // push a and b only
      for (const c of [...colsAOnly, ...colsBOnly]) {
        config.options.push(
          {
            id: c,
            type: "string",
            label: c,
            select: true,
            value: ["Ignore", "Append"],
            current: "Ignore",
          }
        )
      }
      this.config = config;
      // we're done
      console.log("New config. cancel update")
      return
    }
    console.log("Start update here")
    // here comes the real update
    /*
    // result df
    let df
    // Append mode
    if (mode == "Append") {
      DcNode.print("Append")
      df = DcNode.dfd.concat({ dfList: [dfA, dfB], axis: 1 })
    }
    // remaining ops
    if (df === undefined) {
      const colsA = dfA.columns
      const colsB = dfB.columns
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
          df = dfA.selectDtypes(['float32', "int32"]).add(dfB.selectDtypes(['float32', "int32"]))
          break
        case "Sub":
          df = dfA.selectDtypes(['float32', "int32"]).sub(dfB.selectDtypes(['float32', "int32"]))
          break
        case "Mul":
          df = dfA.selectDtypes(['float32', "int32"]).mul(dfB.selectDtypes(['float32', "int32"]))
          break
        case "Div":
          df = dfA.selectDtypes(['float32', "int32"]).div(dfB.selectDtypes(['float32', "int32"]))
          break
        default:
          throw (new Error("Invalid mode:" + mode))
      }
      // finally add string columns
      df = DcNode.dfd.concat({ dfList: [dfA.selectDtypes(['string']), df], axis: 1 })
    }

    // put data into store then send message
    const meta = await DcNode.providers.getMeta(this.id)
    meta.storagetype = StorageTypes.DATAFRAME
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(df), meta)
    await DelayTimer(20)
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
    await this.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)
    */
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
