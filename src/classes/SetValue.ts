// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import { NodeSpec } from '@/services/GlobalDefs';
import { StorageTypes } from "@/services/GlobalDefs";

export class SetValue extends DcNode {
  // properties
  static _display = false
  static _type = NodeSpec.PROC
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,"setvalue",ports,edges)
    DcNode.print(SetValue._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return SetValue._type }
  get display() { return SetValue._display }

} 

  
  
