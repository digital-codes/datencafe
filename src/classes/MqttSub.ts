// mqtt node class, extends DcNode
// actually uses websockets. mqtt protocol seems not to work from browser
// https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications


import { DcNode } from "./DcNode";
//import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';
import { NodeSpec } from "@/services/GlobalDefs";
import { StorageTypes } from "@/services/GlobalDefs";

import { readCSVBrowser } from "danfojs/dist/danfojs-base/io/browser";
//import { CsvInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
//import testFetch from "@/services/TestFetch"
import { UserStore } from "@/services/UserStore";
const userStore = UserStore();

// need event bus here due to static methods ...
import eventBus from "@/services/eventBus";
import { DelayTimer } from "@/services/DelayTimer";


/* did not work with mqtt.js Switch to websocket */
/*
import * as mqtt from "mqtt"; // import connect from mqtt
*/
// websocket is browser native, don't install anything

const topic = "dcaf";

export class MqttSub extends DcNode {
  // properties
  static _display = false;
  static _type = NodeSpec.GEN;
  private socket: any | undefined;
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
      await this.run()
    }
  }
  // ---------------------------
  async run() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN)) {
      DcNode.print("Already connected")
      await this.stop();
      await DelayTimer(500)
    }

    if (!DcNode.providers.exists(this.id)) {
      await DcNode.providers.add(this.id, true); // generators are root nodes too. probabyl
    }
    const meta = {
      storagetype: StorageTypes.DATAFRAME,
      generator: "mqtt",
      topic: this.config.options[0].value,
    };
    DcNode.providers.setMeta(this.id,meta)

    
    // finally add socket event handlers
    this.socket = new WebSocket("wss://daten.cafe/ws") // create a socket
    if (this.socket === undefined) {
      throw new Error("Socket connect failed");
    }

    // this.socket.addEventListener('open', async (event: any) => {
      this.socket.onopen = async (event: any) => {
      // get  app id from user store
      const appId = userStore.getAppId()
      const device = this.config.options[0].value
      await this.socket.send(JSON.stringify({ 
        'action': 'subscribe', 
        'topic': 'dcaf', 
        "id":appId,
        "device": device
       }))
    };

    // this.socket.addEventListener('message', this.update)
    
    // this.socket.addEventListener('message', async (event: any) => {
    this.socket.onmessage = async (event: any) => {
      MqttSub.update(this.id,event.data)
    };


    this.socket.onclose = async () => {
      DcNode.print('WebSocket connection closed');
    };


    DcNode.print("Connected ");
  }
  // -------------------------------------
  async stop() {
    // stop generator
    if (this.socket && (this.socket.readyState === WebSocket.OPEN)) {
      // get  app id from user store
      const appId = await userStore.getAppId()
      await this.socket.send(JSON.stringify({ 'action': 'unsubscribe', 'topic': 'dcaf', "id":appId }))
      await this.socket.close()
      // remove
      /*
      this.socket.removeEventListener('open');
      this.socket.removeEventListener('message');
      this.socket.removeEventListener('close');
      */
  
      //DcNode.providers.remove(super.id)
      if (!DcNode.providers.exists(this.id)) return;
      await DcNode.providers.remove(this.id);
      await DcNode.print("Mqtt ended ");
    }
  }
  // ------------
  // event handler looses this => static method with id
  static async update(id: string, data: any) {
    DcNode.print("Update on " + String(id));

    const date = Date.now();
    const message = parseFloat(data);


    // check data existing
    let df 
    if (await this.providers.hasData(id)) {
      const dt = await DcNode.providers.getDataById(id)
      df = await new DcNode.dfd.DataFrame(dt)
      const df2 = await new DcNode.dfd.DataFrame({"date":[date],"message":[message]});
      //await df.append(row,idx,{inplace:true});
      df = await DcNode.dfd.concat({ dfList: [df, df2], axis: 0 });
    } else {
      df = await new DcNode.dfd.DataFrame({"date":[date],"message":[message]});
    }

    //const dt = await new Date().toISOString();
    await DcNode.providers.update(id, DcNode.dfd.toJSON(df));
    await eventBus.emit(DcNode.signals.NODEANIMATE, id);
    await eventBus.emit((DcNode.signals.UPDPREFIX as string) + id);
  }
  // getters
  get type() {
    return MqttSub._type;
  }
  get display() {
    return MqttSub._display;
  }
}
