// csv node class, extends DcNode

import {DcNode} from "./DcNode"

export class ScalarMath extends DcNode {
  // properties
  static _display = false
  static _type = "proc"
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = []
    const edges: string[] = ["d"]
    super(id,ports,edges)
    DcNode.print(ScalarMath._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return ScalarMath._type }
  get display() { return ScalarMath._display }

} 

  
  