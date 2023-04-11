// node class

// store and messaging
import eventBus from '@/services/eventBus';
// globals
import { Signals } from "@/services/GlobalDefs"
import { PreFixes } from "@/services/GlobalDefs"
// provider/subscriber
import { PubStore } from '@/services/PubStore'
const providers = PubStore()

// dataframe
//import * as dfd from 'danfojs/dist/danfojs-browser/src';
import { DataFrame, toJSON, toCSV } from 'danfojs/dist/danfojs-browser/src';

// nodeTypes
//const typeFile = "../assets/nodes/nodeTypes.json"


export class DcNode {
  // properties"
  // ports and edges are specific. define here
  readonly _ports: string[]
  readonly _edges: string[]
  _name: string;
  readonly _id: string;
  _icon: string | null = null
  _data: any = {}
  readonly _config: any = {}
  _root = false
  _valid = false
  _eval: (...parms: any[]) => any = () => {alert("eval function undefined")} 
  static debug = true // false;
  // store/messaging
  // static part
  static readonly providers = PubStore()
  static readonly signals = Signals
  static readonly pre = PreFixes
  static readonly dfd = {DataFrame:DataFrame, toJSON : toJSON, toCSV: toCSV} // dfd
  //static readonly dfd = dfd
  // instance part
  readonly _messaging = eventBus
  // --------
  // constructor
  constructor(id?:string,ports:string[]=["A"],edges:string[]=["d"],cfg={}) {
    if (id == undefined) {
      throw (new Error("Can't create instance without id"))
    }
    this._id = id
    this._ports = ports
    this._edges = edges
    this._config = cfg
    this._name = id // initialize with id as name
    DcNode.print("Created: " + this._id + " as " + this._name)
  }
  // static methods
  setDebug(dbg: boolean) {
    DcNode.debug = dbg
  }
  static print(x:string) {
    if (DcNode.debug){
      console.log("--------------------------------")
      console.log(x)
      console.log("--------------------------------")
    }
  }
  // methods
  json() {
    // stringify class only returns properties,
    // but not methods
    const j = JSON.stringify(this)
    DcNode.print("Object: " + j)
    return j
  }
  setFunction(f:(...parms: any[]) => any) {
    this._eval = f
    DcNode.print("Set function to: " + this._eval)
  }
  run(...args:any[]) {
    if (args == undefined) console.log("No args")   
    DcNode.print("Evaluating with parms: " + JSON.stringify(args))
    return this._eval(...args)
  }
  // getters/setters
  // readonly first
  get id() { return this._id }
  get ports() {return this._ports}
  get edges() {return this._edges}
  //
  get name() {return this._name }
  set name(x) { this._name = x }
  get data(): any {return this._data}
  set data(x) { this._data = x }
  get config(): any {return this._config}
  //private set config(x) { this._config = x }
  get root(): boolean { return this._root }
  set root(x) { this._root = x }
  get valid(): boolean { return this._valid }
  set valid(x) { this._valid = x }
  get icon(): string | null { return this._icon }
  set icon(x) { this._icon = x }
  get messaging() { return this._messaging }
} 

  
  