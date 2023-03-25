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
  constructor(id:string) {
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
  setName(name:string) {
    this._name = name
    DcNode.print("Set name: " + this._name)
  }
  setValid(v:boolean) {
    this._valid = v
    DcNode.print("Set valid: " + this._valid)
  }
  setRoot(r:boolean) {
    this._root = r
    DcNode.print("Set root: " + this._root)
  }
  setData(d:any) {
    this._data = d
    DcNode.print("Set data: " + JSON.stringify(this._data))
  }
  setConfig(c:any) {
    this._config = c
    DcNode.print("Set config: " + JSON.stringify(this._config))
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
  // getters
  get id() { return this._id }
  get name() {return this._name }
  get data(): any {return this._data}
  get config(): any {return this._config}
  get root(): boolean { return this._root }
  get valid(): boolean { return this._valid }
} 

  
  