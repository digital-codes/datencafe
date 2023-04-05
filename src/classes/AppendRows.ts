// csv node class, extends DcNode

import {DcNode} from "./DcNode"

export class AppendData extends DcNode {
  // properties
  // ports and edges are specific. define here
  readonly _type: string
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A","B"]
    const edges: string[] = ["d"]
    super(id,ports,edges)
    this._type = "appenddata"
    super.icon = "/img/widgets/Concatenate.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return this._type }
} 

  
  