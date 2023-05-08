// proc node class, extends DcNode


import { DcNode } from "./DcNode"
import { SigPort } from "./DcNode"
import { NodeSpec } from '@/services/GlobalDefs';
import { DataSpecs } from "./DcNode";
import { DelayTimer } from "@/services/DelayTimer"
import { StorageTypes } from "@/services/GlobalDefs";

export class RenameCols extends DcNode {
  // properties
  static _type = NodeSpec.PROC
  private updCnt = 0
  static _display = false
  // constructor
  constructor(id: string, typeInfo: any) {
    const ports: string[] = ['A']
    const edges: string[] = ['d']
    super(id, "renamecols", ports, edges)
    DcNode.print(RenameCols._type + " created") // no access to super._id etc here
    // add to providers
    DcNode.providers.add(this.id)
  }
  // getters/setters
  get type() { return RenameCols._type }
  get display() { return RenameCols._display }
  // methods
  // methods
  async configure(optionString: string) {
    // we know the config structure here, so can just use the index
    const options = JSON.parse(optionString);
    for (let i = 0; i < this.config.options.length; i++) {
      this.config.options[i].current = options[i];
      DcNode.print("Set option:" + options[i]);
    }
    if (this.signals.length < 1) {
      return;
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
    if (this.signals.length < 1) {
      DcNode.print("Update. Too few sources for " + this.id)
      this.config.options = []
      return
    }

    const src = msg.split("-")[1];
    const dt = DcNode.providers.getDataById(src);
    const df = new DcNode.dfd.DataFrame(dt);
    const cols = df.columns;
    console.log("Rename - Cols:",cols)
    const oldSpecs = this.specs;
    const specs: DataSpecs[] = [
      {
        port: "A",
        columns: cols,
        types: df.ctypes.values as string[],
      },
    ];
    if (oldSpecs.length == 0 || this.specsChanged(specs)) {
      this.specs = specs;
      // set new config, default pick first column as x
      // -------
      // set config from columns
      const config = this.config;
      config.pop = "mixed";
      config.options = []
      // push cols
      for (const c of cols) {
        config.options.push(
          {
            id: c,
            type: "string",
            label: c,
            select: false,
            value: c,
            current: c
          }
        )
      }
      this.config = config;
      // we're done
      DcNode.print("New config. cancel update")
      return
    }

    console.log("Config:",this.config.options)
    // check if current different to label or empty
    const colMap: any = {}
    const drops = [] as string[]
    for (const o of this.config.options) {
      if (o.current == "") {
        console.log("Drop:", o.label)
        drops.push(o.label)
      } else {
        if (o.current != o.label) {
          console.log("Rename:", o.label, o.current)
          colMap[o.label] = o.current
        }
      }
    }
    if (drops.length > 0) {
      df.drop({ columns: drops, inplace: true })
    }
    df.rename(colMap, { axis: 1, inplace: true });
    df.print()

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
