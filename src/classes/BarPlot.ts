// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import {SigPort} from "./DcNode"
import { NodeSpec } from '@/services/GlobalDefs';

export class BarPlot extends DcNode {
  // properties
  static _display = true
  static _type = NodeSpec.CHART 
  private updCnt = 0
  private plot: any = null
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,"barplot",ports,edges)
    DcNode.print(BarPlot._type + " created") // no access to super._id etc here
  }
  // getters/setters
  get type() { return BarPlot._type }
  get display() { return BarPlot._display }
  // methods
  async updated(msg:string,y?:any) {
    this.updCnt++
    const src = msg.split("-")[1]
    DcNode.print(src + " updated " + super.id +": " + String(this.updCnt))
    const dt = DcNode.providers.getDataById(src)
    const df = new DcNode.dfd.DataFrame(dt)
    const divId = DcNode.pre.PLOTPREFIX + super.id
    const target = document.getElementById(divId)
    if ((target === undefined) || (target == null) ) {
      throw (new Error("Invalid ID: " + String(divId)))
    }
    // this.plot = await df.plot(divId).bar()
    // Define layout and trace
    // pick first column as x
    const cols = df.columns
    const xCol = cols[cols.length-1] // will become variable
    const xIdx = cols.findIndex(name => name == xCol)
    console.log("X index:",xIdx)
    const X = df[cols[xIdx]].values
    //console.log("X",X)
    const traces = []
    const mode = "stack" //"stack" // relative, group, empty
    for (let i = 0; i < cols.length; i++ ) {
      if (i == xIdx) continue
      const trace = {
        x: X,
        y: df[cols[i]].values,
        type: "bar",
      }
      traces.push(trace)
    }
  
    const layout = {
      title: "Bar Chart",
      barmode: mode,
      xaxis: {title: cols[xIdx]},
      yaxis: {title: 'Y axis'},
      /*
      height: 400,
      width: 800,
      */
    };

    this.plot = await DcNode.Plotly.newPlot(divId, traces as any, layout as any)
    /* toImg not included in danfo plotly distribution
    const img = await Plotly.toImage(plot,{height:300,width:300})
    console.log(img)
    */
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
  async getImage() {
    if (this.plot == null) {
      console.log("Empty plot")
      return ""
    }
    const png = await DcNode.Plotly.toImage(this.plot, {
      format: "png",
      width: 800,
      height: 400,
    });
    return png
  }

} 

  
  
