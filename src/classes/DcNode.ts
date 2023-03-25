// node class

export class DcNode {
  // properties
  name: string;
  readonly id: string;
  icon = ""
  data: any = {}
  config: any = {}
  root = false
  valid = false
  eval: (...parms: any[]) => any = () => {alert("eval function undefined")} 
  static debug = true // false;
  // constructor
  constructor(id:string) {
    this.id = id
    this.name = id // initialize with id as name
    DcNode.print("Created: " + this.id + " + as " + this.name)
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
    this.name = name
  }
  setValid(v:boolean) {
    this.valid = v
  }
  setRoot(r:boolean) {
    this.root = r
  }
  setData(d:any) {
    this.data = d
  }
  setConfig(c:any) {
    this.config = c
  }
  setEval(f:(...parms: any[]) => any) {
    this.eval = f
  }
  evaluate(...args:any[]) {
    return this.eval(...args)
  }
  // getters
  get(): string {
    return this.id
  }
  getName(): string {
    return this.name
  }
} 

  
  