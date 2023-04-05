// csv node class, extends DcNode

import {DcNode} from "./DcNode"
// provider/subscriber
import { PubStore } from '../services/PubStore'
const providers = PubStore()

export class TablePlot extends DcNode {
  // properties
  readonly _type: string
  // constructor
  constructor(id:string) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"]
    const edges: string[] = ["d"]
    super(id,ports,edges)
    this._type = "tableplot"
    super.icon = "/img/widgets/Table.png"
    DcNode.print(this._type + " created") // no access to super._id etc here
  }
  // getters
  get type() { return this._type }
} 

  
  