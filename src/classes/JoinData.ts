
// csv node class, extends DcNode

import {DcNode} from "./DcNode"

export class JoinData extends DcNode {
  // properties
  readonly _type: string
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    super(id)
    this._type = "joindata"
    super.icon = "/img/widgets/MergeData.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return this._type }
} 

  
  