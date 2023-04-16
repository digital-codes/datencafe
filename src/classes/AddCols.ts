// proc node class, extends DcNode


import {DcNode} from "./DcNode"
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
  }
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
    await df.plot(divId).line()
  }
  msgOn(x: string) {
    // set event listener for signal 
    DcNode.print("msg ON for " + x)
    super.messaging.on(x,(y:any)=>{this.updated(x,y)})
    const sigs = this.signals
    if (!sigs.includes(x)) {
      sigs.push(x)
      this.signals = sigs
    }
    DcNode.print("Signals now: " + JSON.stringify(x))
  }
  msgOff(x: string) {
    // set event listener for signal 
    DcNode.print("msg OFF for " + x)
    super.messaging.off(x)
    const sigs = this.signals
    const idx = sigs.findIndex(s => s == x)
    if (idx == -1) throw (new Error("Invalid signal"))
    sigs.splice(idx,1)
    this.signals = sigs
    DcNode.print("Signals now: " + JSON.stringify(sigs))
  }
} 
