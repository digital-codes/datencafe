// csv node class, extends DcNode

import {DcNode} from "./DcNode"
import { NodeTypes } from '@/services/GlobalDefs';

export class LoadCsv extends DcNode {
  // properties
  static _display = false
  static _type = NodeTypes.INPUT
  // constructor
  constructor(id:string,typeInfo:any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = []
    const edges: string[] = ["d"]
    super(id,ports,edges)
    DcNode.print(LoadCsv._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return LoadCsv._type }
  get display() { return LoadCsv._display }

} 

  
  
