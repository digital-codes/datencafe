// csv node class, extends DcNode

import {DcNode} from "./DcNode"

export class CsvNode extends DcNode {
  // properties
  readonly _type: string
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    super(id)
    this._type = "csvnode"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return this._type }
} 

  
  