// node class

export class DcNode {
  // properties
  _name: string;
  readonly _id: string;
  icon = ""
  _data: any = {}
  _config: any = {}
  _root = false
  _valid = false
  _eval: (...parms: any[]) => any = () => {alert("eval function undefined")} 
  static debug = true // false;
  // constructor
  constructor(id?:string) {
    if (id == undefined) {
      throw (new Error("Can't vreate instance without id"))
    }
    this._id = id
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
  get id() { return this._id }
  // id is readonly
  get name() {return this._name }
  set name(x) { this._name = x }
  get data(): any {return this._data}
  set data(x) { this._data = x }
  get config(): any {return this._config}
  set config(x) { this._config = x }
  get root(): boolean { return this._root }
  set root(x) { this._root = x }
  get valid(): boolean { return this._valid }
  set valid(x) { this._valid = x }
} 

  
  