// proc node class, extends DcNode


import { DcNode } from "./DcNode"
import { SigPort } from "./DcNode"
import { NodeSpec } from '@/services/GlobalDefs';
import { DataSpecs } from "./DcNode";
import { DelayTimer } from "@/services/DelayTimer"
import { StorageTypes } from "@/services/GlobalDefs";

export class SelRows extends DcNode {
  // properties
  static _type = NodeSpec.PROC
  private updCnt = 0
  static _display = false
  // constructor
  constructor(id: string, typeInfo: any) {
    const ports: string[] = ['A', 'B']
    const edges: string[] = ['d']
    super(id, "selrows", ports, edges)
    DcNode.print(SelRows._type + " created") // no access to super._id etc here
    // add to providers
    DcNode.providers.add(this.id)
  }
  // getters/setters
  get type() { return SelRows._type }
  get display() { return SelRows._display }
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
      this.config.options = []
      this.specs = []
      return
    }
    // just use first signal to trigger an update
    DcNode.print("Updating with:" + this.signals[0].signal)
    //await this.messaging.emit(this.signals[0].signal)
    this.updated(this.signals[0].signal)
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
      this.config.options = []
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
      this.config.options = []
      return
    }
    if (!DcNode.providers.hasData(sigB.signal.split("-")[1])) {
      DcNode.print("No data port B")
      this.config.options = []
      return
    }
    // -------
    // go ahead
    DcNode.print("Updating with input ports attached")
    this.updCnt++
    // retrieve data
    const dtA = await DcNode.providers.getDataById(sigA.signal.split("-")[1])
    const dfA = await new DcNode.dfd.DataFrame(dtA)
    const colsA = dfA.columns
    const dtB = await DcNode.providers.getDataById(sigB.signal.split("-")[1])
    const dfB = await new DcNode.dfd.DataFrame(dtB)
    const colsB = dfB.columns
    if (colsB.length != 1) {
      alert("Invalid data on port B. Expect exactly 1 column")
      DcNode.print("Invalid data on port B. Expect exactly 1 column")
      return
    }
    const oldSpecs = this.specs;
    const specs: DataSpecs[] = [
      {
        port: "A",
        columns: colsA,
        types: dfA.ctypes.values as string[],
      },
      {
        port: "B",
        columns: colsB,
        types: dfB.ctypes.values as string[],
      },
    ];
    if ( oldSpecs.length == 0 || this.specsChanged(specs)) {
      this.specs = specs;
      // set new config, default pick first column as x
      const config = this.config;
      config.pop = "mixed";
      config.options = []
      config.options.push(
        {
          id: "mode",
          type: "string",
          label: "Mode",
          select: true,
          value: ["equal", "not equal", "less", "less or equal", "greater", "greater or equal"],
          current: "equal",
        }
      )
      // push columns 
      config.options.push(
        {
          id: "columns",
          type: "string",
          label: "Columns",
          select: true,
          value: colsA,
          current: colsA[0],
        }
      )
      // push filters
      config.options.push(
        {
          id: "filter",
          type: "string",
          label: "Filter",
          select: true,
          value: dfB[dfB.columns[0]].values,
          current: colsA[0],
        }
      )
      this.config = config;
      // we're done
      DcNode.print("New config. cancel update")
      return

    }
    // ------------------------
    // get column and mode
    const filterCol = this.config.options.find((o: any) => o.id == "columns").current
    const filterVal = this.config.options.find((o: any) => o.id == "filter").current
    const mode = this.config.options.find((o: any) => o.id == "mode").current
    console.log("Filter on", filterCol, filterVal, mode)

    let newDf
    switch (mode) {
      case "equal":
        newDf = dfA.query(dfA[filterCol].eq(filterVal))
        break;
      case "not equal":
        newDf = dfA.query(dfA[filterCol].ne(filterVal))
        break;
      case "less":
        newDf = dfA.query(dfA[filterCol].lt(filterVal))
        break;
      case "less or equal":
        newDf = dfA.query(dfA[filterCol].le(filterVal))
        break;
      case "greater":
        newDf = dfA.query(dfA[filterCol].gt(filterVal))
        break;
      case "greater or equal":
        newDf = dfA.query(dfA[filterCol].ge(filterVal))
        break;
      default:
        newDf = dfA[filterCol]
        break;
    }
    newDf.print()

    // put data into store then send message
    const meta = await DcNode.providers.getMeta(this.id)
    meta.storagetype = StorageTypes.DATAFRAME
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(newDf), meta)
    await DelayTimer(20)
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
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
