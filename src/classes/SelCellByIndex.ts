// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';

export class SelCols extends DcNode {
  // properties
  static _display = false
  static _type = NodeTypes.PROC
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,ports,edges)
    DcNode.print(SelCols._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return SelCols._type }
  get display() { return SelCols._display }

} 

  
  
