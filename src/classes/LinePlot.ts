// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import {SigPort} from "./DcNode"
import { NodeSpec } from '@/services/GlobalDefs';
import { DelayTimer } from "@/services/DelayTimer"
import { PlotConfigObject } from "danfojs/dist/danfojs-base/shared/types";

export class LinePlot extends DcNode {
  // properties
  private updCnt = 0
  static _display = true
  static _type = NodeSpec.CHART //"chart"
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,"lineplot",ports,edges)
    DcNode.print(LinePlot._type + " created") // no access to super._id etc here
  }
  // getters/setters
  get type() { return LinePlot._type }
  get display() { return LinePlot._display }
  // methods
  async updated(msg:string,y?:any) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + super.id +": " + String(this.updCnt) + "..." + String(y))
    const dt = DcNode.providers.getDataById(src) 
    const df = new DcNode.dfd.DataFrame(dt)
    const divId = DcNode.pre.PLOTPREFIX + super.id
    const target = await document.getElementById(divId)
    if ((target === undefined) || (target == null) ) {
      throw (new Error("Invalid ID: " + String(divId)))
    }
    //const layout = {}
    /* plotly customconfig
    interface CustomConfig extends Config {
      x: string;
      y: string;
      values: string;
      labels: string;
      rowPositions: number[];
      columnPositions: number[];
      grid: {
          rows: number;
          columns: number;
      };
      tableHeaderStyle: any;
      tableCellStyle: any;
      columns: string[];
    }
    */  
    const plotConfig: PlotConfigObject = {config:{}, layout:{}}
    await df.plot(divId).line(plotConfig)
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
    //await super.messaging.emit(divId) // div used for signalling ..
    /*
    df.describe().print()
    df.print()
    */
  }
  msgOn(x: string, y: string) {
    // set event listener for signal 
    DcNode.print("msg ON for " + x + " on port " + y)
    super.messaging.on(x,(y:any)=>{this.updated(x,y)})
    const sigs = this.signals
    if (sigs.find(s => s.signal == x) === undefined){
      sigs.push({signal:x,port:y} as SigPort)
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
    sigs.splice(idx,1)
    this.signals = sigs
    DcNode.print("Signals now: " + JSON.stringify(this.signals))
  }
} 

  
  
