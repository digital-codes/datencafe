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
    super(id, "addcols", ports, edges)
    DcNode.print(AddCols._type + " created") // no access to super._id etc here
    // add to providers
    DcNode.providers.add(this.id)
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
      this.config.options = []
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
    const idxA = dfA.index
    const idxB = dfB.index
    // assume we need same index on both dataframes
    if (idxA.length != idxB.length) {
      DcNode.print("Indices not same length")
      this.config.options = []
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
    const colMapA: any = {}
    for (const idx in colsAOnly) {
      colMapA[colsAOnly[idx]] = colsAOnly[idx] + "_A"
      colsAOnly[idx] = colsAOnly[idx] + "_A"
    }
    dfA.rename(colMapA, { axis: 1, inplace: true });
    const colMapB: any = {}
    for (const idx in colsBOnly) {
      colMapB[colsBOnly[idx]] = colsBOnly[idx] + "_B"
      colsBOnly[idx] = colsBOnly[idx] + "_B"
    }
    dfB.rename(colMapB, { axis: 1, inplace: true })

    const colsAll = [...colsAB, ...colsAOnly, ...colsBOnly].sort()
    const currentCols = this.config.options.map((o: any) => o.label).sort()

    const haveSameElements = currentCols.every((value: any, index: number) => value === colsAll[index]);
    if (!haveSameElements || (currentCols.length == 0)) {
      // redo config here ...
      const config = this.config;
      config.pop = "mixed";

      config.options = []
      // push common cols
      const typesA = dfA.ctypes.values as string[]
      const typesB = dfB.ctypes.values as string[]
      for (const c of colsAB) {
        // check datatype for numerics
        const idxA = colsA.findIndex((n: string) => n == c)
        const idxB = colsB.findIndex((n: string) => n == c)
        const numerics = ["int32", "float32"]
        let valueList = ["Ignore", "Only-A", "Only-B", "Append"]
        if (numerics.includes(typesA[idxA]) && numerics.includes(typesB[idxB])) {
          valueList = [...valueList, "Add", "Sub", "Mul", "Div"]
        }
        config.options.push(
          {
            id: c,
            type: "string",
            shared: true, // is on both sides
            label: c,
            select: true,
            value: valueList,
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
            shared: false, // is on one side only
            label: c,
            select: true,
            value: ["Ignore", "Append"],
            current: "Ignore",
          }
        )
      }
      this.config = config;
      // we're done
      DcNode.print("New config. cancel update")
      return
    }
    // here comes the real update
    /*
    loop over all columns and check mode
    */
    //         value: ["Ignore", "Only-A", "Only-B", "Append", "Add", "Sub", "Mul", "Div"],
    let df
    let dfEmpty = true
    const dataCols = this.config.options
    for (const c of dataCols) {
      switch (c.current) {
        case "Only-A":
          DcNode.print("A only")
          if (dfEmpty) {
            dfEmpty = false
            if (!c.shared && c.label.endsWith("_A")) df = dfA[c.label]
            if (c.shared) {
              df = dfA[c.label]
            }
          } else {
            if (!c.shared && c.label.endsWith("_A")) df = dfA[c.label]
            if (c.shared) {
              df = DcNode.dfd.concat({ dfList: [df, dfA[c.label]], axis: 1 })
            }
          }
          break
        case "Only-B":
          DcNode.print("B only")
          if (dfEmpty) {
            dfEmpty = false
            if (!c.shared && c.label.endsWith("_B")) df = dfB[c.label]
            if (c.shared) {
              df = dfB[c.label]
            }
          } else {
            if (!c.shared && c.label.endsWith("_B")) df = dfB[c.label]
            if (c.shared) {
              df = DcNode.dfd.concat({ dfList: [df, dfB[c.label]], axis: 1 })
            }
          }
          break
        case "Append":
          DcNode.print("Append")
          if (dfEmpty) {
            dfEmpty = false
            if (!c.shared && c.label.endsWith("_A")) df = dfA[c.label]
            if (!c.shared && c.label.endsWith("_B")) df = dfB[c.label]
            if (c.shared) {
              df = dfA[c.label]
              df = DcNode.dfd.concat({ dfList: [df, dfB[c.label]], axis: 1 })
            }
          } else {
            if (!c.shared && c.label.endsWith("_A")) df = DcNode.dfd.concat({ dfList: [df, dfA[c.label]], axis: 1 })
            if (!c.shared && c.label.endsWith("_B")) df = DcNode.dfd.concat({ dfList: [df, dfB[c.label]], axis: 1 })
            if (c.shared) {
              df = DcNode.dfd.concat({ dfList: [df, dfA[c.label], dfB[c.label]], axis: 1 })
            }
          }
          break
        case "Add":
          DcNode.print("Add")
          if (dfEmpty) {
            dfEmpty = false
            df = dfA[c.label].add(dfB[c.label])
          } else {
            df = DcNode.dfd.concat({ dfList: [df, dfA[c.label].add(dfB[c.label])], axis: 1 })
          }
          break
        case "Sub":
          DcNode.print("Sub")
          if (dfEmpty) {
            dfEmpty = false
            df = dfA[c.label].sub(dfB[c.label])
          } else {
            df = DcNode.dfd.concat({ dfList: [df, dfA[c.label].sub(dfB[c.label])], axis: 1 })
          }
          break
        case "Mul":
          DcNode.print("Mul")
          if (dfEmpty) {
            dfEmpty = false
            df = dfA[c.label].mul(dfB[c.label])
          } else {
            df = DcNode.dfd.concat({ dfList: [df, dfA[c.label].mul(dfB[c.label])], axis: 1 })
          }
          break
        case "Div":
          DcNode.print("Div")
          if (dfEmpty) {
            dfEmpty = false
            df = dfA[c.label].div(dfB[c.label])
          } else {
            df = DcNode.dfd.concat({ dfList: [df, dfA[c.label].div(dfB[c.label])], axis: 1 })
          }
          break
        default:
          // ignore case
          break
      }
    }
    if (dfEmpty) {
      DcNode.print("Nothing selected")
      return
    }
    /* old ...
      // finally add string columns
      df = DcNode.dfd.concat({ dfList: [dfA.selectDtypes(['string']), df], axis: 1 })
    }
    */
    // put data into store then send message
    const meta = await DcNode.providers.getMeta(this.id)
    meta.storagetype = StorageTypes.DATAFRAME
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(df), meta)
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
