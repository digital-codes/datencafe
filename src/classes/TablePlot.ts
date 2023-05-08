// csv node class, extends DcNode

import { format } from "path";
import { DcNode } from "./DcNode"
import { SigPort } from "./DcNode"
import { NodeSpec } from '@/services/GlobalDefs';


export class TablePlot extends DcNode {
  // properties
  static _display = true
  static _type = NodeSpec.TABLE
  private updCnt = 0
  private plot: any = null
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id, "tableplot", ports, edges)
    DcNode.print(TablePlot._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return TablePlot._type }
  get display() { return TablePlot._display }
  // methods
  async updated(msg: string, y?: any) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + super.id + ": " + String(this.updCnt) + "..." + String(y))
    const dt = DcNode.providers.getDataById(src)
    const df = new DcNode.dfd.DataFrame(dt)
    const divId = DcNode.pre.PLOTPREFIX + super.id
    const target = await document.getElementById(divId)
    if ((target === undefined) || (target == null)) {
      throw (new Error("Invalid ID: " + String(divId)))
    }
    // new plot
    const cols = df.columns
    const ctypes = df.ctypes.values
    const header = []
    const values = []
    const fmt = []
    for (const c in cols) { // "in" returns index, "of" returns value
      header.push(new Array(cols[c]))
      values.push(df[cols[c]].values)
      if (ctypes[c] == "string") {
        fmt.push([])
      } else {
        fmt.push(['.3f'])
      }
    }


    const data = [{
      type: 'table',
      header: {
        values: header, // [df.columns],
        align: ["left", "center"],
        line: { width: 2, color: '#444' },
        // fill: {color: '#119DFF'},
        font: { family: "Arial", size: 14, weight: "bold", color: "#000" }
      },
      cells: {
        values: values, // df.values,
        align: ["left", "center"],
        line: { color: "#444", width: 1 },
        // fill: {color: ['#25FEFD', 'white']},
        font: { family: "Arial", size: 11, color: ["#000"] },
        format: fmt
      }
    }]

    const layout = {
      title: "Table chart"
    }


    this.plot = await DcNode.Plotly.newPlot(divId, data as any, layout as any)

    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
  }
  msgOn(x: string, y: string) {
    // set event listener for signal 
    DcNode.print("msg ON for " + x + " on port " + y)
    super.messaging.on(x, (y: any) => { this.updated(x, y) })
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
    super.messaging.off(x)
    const sigs = this.signals
    const idx = sigs.findIndex(s => s.signal == x)
    if (idx == -1) throw (new Error("Invalid signal"))
    sigs.splice(idx, 1)
    this.signals = sigs
    DcNode.print("Signals now: " + JSON.stringify(this.signals))
  }
  async getImage() {
    if (this.plot == null) {
      return ""
    }
    const png = await DcNode.Plotly.toImage(this.plot, {
      format: "png",
      width: 1280,
      height: 720 * 1,
    });
    return png
  }

}



