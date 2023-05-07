// node class

// store and messaging
import eventBus from "@/services/eventBus";
// globals
import { Signals } from "@/services/GlobalDefs";
import { PreFixes } from "@/services/GlobalDefs";
// provider/subscriber
import { PubStore } from "@/services/PubStore";
import testFetch from "@/services/TestFetch";
import { UserStore } from "@/services/UserStore";
const userStore = UserStore();
// plotly
import Plotly from "plotly.js-dist-min"; // v2.8


// dataframe
//import * as dfd from 'danfojs/dist/danfojs-browser/src';
import {
  DataFrame,
  concat,
  merge,
  toJSON,
  toCSV,
  readCSV,
  readJSON,
  readExcel,
} from "danfojs/dist/danfojs-browser/src";

// nodeTypes
//const typeFile = "../assets/nodes/nodeTypes.json"

export interface SigPort {
  signal: string;
  port: string;
}

export interface DataSpecs {
  port:string
  columns: string []
  types: string[]
}

export class DcNode {
  // properties"
  // ports and edges are specific. define here
  readonly _cls: string;
  readonly _ports: string[];
  readonly _edges: string[];
  private _specs = [] as DataSpecs [] // data specs
  _name: string;
  readonly _id: string;
  _icon: string | null = null;
  _data: any = {};
  _config: any = {};
  _signals: SigPort[] = []; // listening to
  _root = false;
  _valid = false;
  _eval: (...parms: any[]) => any = () => {
    alert("eval function undefined");
  };
  static debug = true; // false;
  // store/messaging
  // static part
  static readonly consent = false // normally not needed
  static readonly providers = PubStore();
  static readonly signals = Signals;
  static readonly pre = PreFixes;
  static readonly Plotly = Plotly
  static readonly dfd = {
    DataFrame: DataFrame,
    toJSON: toJSON,
    toCSV: toCSV,
    readExcel: readExcel,
    readCVS: readCSV,
    readJSON: readJSON,
    concat: concat,
    merge: merge,
  }; // dfd
  //static readonly dfd = dfd
  // instance part
  readonly _messaging = eventBus;
  // --------
  // constructor
  constructor(
    id?: string,
    cls?: string,
    ports: string[] = ["A"],
    edges: string[] = ["d"],
    cfg = {}
  ) {
    if (id == undefined) {
      throw new Error("Can't create instance without id");
    }
    if (cls == undefined) {
      throw new Error("Can't create instance without classname");
    }
    this._id = id;
    this._cls = cls;
    this._ports = ports;
    this._edges = edges;
    this._config = cfg;
    this._name = id; // initialize with id as name
    DcNode.print("Created: " + this._id + " as " + this._name);
  }
  // static methods
  // data specs
  
  // debugging
  setDebug(dbg: boolean) {
    DcNode.debug = dbg;
  }
  // 
  static print(x: string) {
    if (DcNode.debug) {
      console.log("--------------------------------");
      console.log(x);
      console.log("--------------------------------");
    }
  }
  static async fetchFile(url: string, type = "csv") {
    let fetchResult: any;
    try {
      fetchResult = await testFetch(url, type);
      if (fetchResult.success) {
        // done
        return fetchResult
      }
      // check token
      if (!userStore.exists()) {
        // emit iframe download signal for url
        await eventBus.emit(DcNode.signals.URLOADPREFIX, url);
        return { success: false };
      }
    } catch (e: any) {
      alert("URL cannot be loaded directly2 " + String(e));
      return { success: false };
    }
    // try cors as well
    try {
      fetchResult = await testFetch(url, type, true);
      if (fetchResult.success) {
        // done
        return fetchResult
      }
      alert("CORS loading failed. Check URL");
      return { success: false };
    } catch (e) {
      alert("URL cannot be loaded. Check URL");
      return { success: false };
    }
  }
  // methods
  json() {
    // return props with config. Data fails due to wrong json method
    // but not methods
    //const j = JSON.stringify(this)
    // const j = JSON.stringify({id:this.id,name:this.name,ports:this.ports,edges:this.edges,config:this.config})
    //const j = {id:this.id,name:this.name,ports:this.ports,edges:this.edges,config:this.config,sigs:this.signals}
    // ports and edges are fixed
    const j = {
      id: this.id,
      name: this.name,
      classname: this.classname,
      config: this.config,
      sigs: this.signals,
    };
    DcNode.print("Object: " + JSON.stringify(j));
    return j;
  }
  setFunction(f: (...parms: any[]) => any) {
    this._eval = f;
    DcNode.print("Set function to: " + this._eval);
  }
  run(...args: any[]) {
    if (args == undefined) console.log("No args");
    DcNode.print("Evaluating with parms: " + JSON.stringify(args));
    return this._eval(...args);
  }
  // dummy up
  upload(file: any) {
    DcNode.print("upload");
  }
  // getters/setters
  // readonly first
  get id() {
    return this._id;
  }
  get classname() {
    return this._cls;
  }
  get ports() {
    return this._ports;
  }
  get edges() {
    return this._edges;
  }
  //
  get name() {
    return this._name;
  }
  set name(x) {
    this._name = x;
  }
  get signals() {
    return this._signals.filter((s) => s.signal);
  }
  protected set signals(x) {
    this._signals = x;
  }
  get data(): any {
    return this._data;
  }
  set data(x) {
    this._data = x;
  }
  get config(): any {
    return this._config;
  }
  protected set config(x) {
    this._config = x;
  }
  get root(): boolean {
    return this._root;
  }
  set root(x) {
    this._root = x;
  }
  get valid(): boolean {
    return this._valid;
  }
  set valid(x) {
    this._valid = x;
  }
  get icon(): string | null {
    return this._icon;
  }
  set icon(x) {
    this._icon = x;
  }
  get messaging() {
    return this._messaging;
  }
  get consent() {
    return DcNode.consent;
  }
}
