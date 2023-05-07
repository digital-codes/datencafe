// csv node class, extends DcNode

import { DcNode } from "./DcNode";
//import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';
import { NodeSpec } from "@/services/GlobalDefs";
import { StorageTypes } from "@/services/GlobalDefs";

import { readCSVBrowser } from "danfojs/dist/danfojs-base/io/browser";
//import { CsvInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
//import testFetch from "@/services/TestFetch"
import { UserStore } from "@/services/UserStore";
const userStore = UserStore();

import { connect, subscribe, unsubscribe } from "mqtt"; // import connect from mqtt

const topic = "dcaf";

export class MqttSub extends DcNode {
  // properties
  static _display = false;
  static _type = NodeSpec.GENERATOR;
  private df = new DcNode.dfd.DataFrame();
  private client: any | undefined;
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = [];
    const edges: string[] = ["d"];
    // keep config in instance, the values will be stored here too ...
    const cfg = {
      pop: "value",
      options: [
        {
          id: "device",
          type: "string",
          label: "Device",
          value: "12345678",
        },
      ],
    };
    super(id, "mqttsub", ports, edges, cfg as any);
    DcNode.print(MqttSub._type + " created"); // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  async configure(options: any[]) {
    // we know the config structure here, so can just use the index
    const config = this.config;
    for (let i = 0; i < options.length; i++) {
      config.options[i].value = options[i];
    }
    // update
    this.config = config; // update config
    if (options[0] != "") {
      this.run()
    }
  }
  async run() {
    if (this.client.connected) return;
    // add to store
    // connect to mqtt broker
    this.client = connect("mqtt://mqtt.daten.cafe"); // create a client
    if (this.client === undefined) {
      throw new Error("MQTT connect failed");
    }
    // subscribe
    this.client.subscribe(topic + "/" + this.config.device);
    this.client.on('connect', alert("MQTT connected"))
    this.client.on("message", this.update);

    this.df = new DcNode.dfd.DataFrame({ date: [], message: [] });
    const meta = {
      storagetype: StorageTypes.DATAFRAME,
      generator: "mqtt",
      topic: this.config.options[0].value,
    };
    //DcNode.providers.add(super.id)
    if (!DcNode.providers.exists(this.id)) {
      await DcNode.providers.add(this.id, true); // generators are root nodes too. probabyl
    }
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(this.df), meta);
    // start generator
    DcNode.print("Connected ");
  }
  // -------------------------------------
  stop() {
    // stop generator
    if (this.client.connected) {
      this.client.unsubscribe(topic + "/" + this.config.device);
      this.client.end();
      // remove
      //DcNode.providers.remove(super.id)
      if (!DcNode.providers.exists(this.id)) return;
      DcNode.providers.remove(this.id);
      DcNode.print("Mqtt ended ");
    }
  }
  // ------------

  async update(topic: string, payload: any) {
    DcNode.print("Update on " + String(this.name));

    alert([topic, payload].join(": "));

    const date = new Date();
    const message = parseFloat("123");
    this.df.append([date, message], this.df.shape[0]);

    this.df.print();
    this.df.ctypes.print();
    if (!(await DcNode.providers.exists(this.id))) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true); // file loaders are root nodes
    }
    //const dt = await new Date().toISOString();
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(this.df));
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id);
    await super.messaging.emit((DcNode.signals.UPDPREFIX as string) + this.id);
  }
  // getters
  get type() {
    return MqttSub._type;
  }
  get display() {
    return MqttSub._display;
  }
}
