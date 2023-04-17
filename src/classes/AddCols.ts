// proc node class, extends DcNode


import {DcNode} from "./DcNode"
import {SigPort} from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';
import { DelayTimer } from "@/services/DelayTimer"

export class AddCols extends DcNode {
  // properties
  static _type = NodeTypes.PROC
  private updCnt = 0
  static _display = false
  // constructor
  constructor(id:string,typeInfo:any) {
    const ports: string[] = ['A','B']
    const edges: string[] = ['d']
    const cfg = {
      pop:"select",
      options: 
        {
          id:"op",
          type:"string",
          label:"Operation",
          value:["Join","Append","Add","Sub","Mul","Div"],
          current:""
        },
      }
    super(id,"addcols",ports,edges,cfg as any)
    DcNode.print(AddCols._type + " created") // no access to super._id etc here
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
  async updated(msg:string,y?:any) {
    // update only when both ports attached
    DcNode.print("Update for " +  msg + ", " + this.id + "," + JSON.stringify(this.signals))
    if (this.signals.length < 2) {
      DcNode.print("Update. Too few sources for " + this.id)
      return
    }
    DcNode.print("Updating with input ports attached")
    this.updCnt++
    // in this case, we need to iterate over the attached signals to find the sources
    // to be more precise, we need to find source for port a and b selectively
    const sigA = this.signals.find(s => s.port == "A")
    const sigB = this.signals.find(s => s.port == "B")
    if ((sigA == undefined) ||(sigB === undefined))
      throw (new Error("Invalid signals"))
    // even if sources attached, data might not be available. check this first
    if (!DcNode.providers.exists(sigA.signal.split("-")[1])) {
      DcNode.print("No data port A")
      return
    }
    if (!DcNode.providers.exists(sigB.signal.split("-")[1])) {
      DcNode.print("No data port B")
      return
    }
    const dtA = DcNode.providers.getDataById(sigA.signal.split("-")[1]) 
    const dfA = new DcNode.dfd.DataFrame(dtA)
    const dtB = DcNode.providers.getDataById(sigB.signal.split("-")[1]) 
    const dfB = new DcNode.dfd.DataFrame(dtB)
    dfA.print()
    dfB.print()
    // perform op and put data into store
    // then send message
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
