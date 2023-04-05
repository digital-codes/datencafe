// csv node class, extends DcNode

import {DcNode} from "./DcNode"

export class MathOps extends DcNode {
  // properties
  readonly _type: string
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = []
    const edges: string[] = ["d"]
    super(id,ports,edges)
    this._type = "mathops"
    super.icon = "/img/widgets/Preprocess.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return this._type }
} 

  
  