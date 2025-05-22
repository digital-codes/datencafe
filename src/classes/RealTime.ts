/**
 * @file RealTime.ts
 * @description This file defines the `RealTime` class, which extends the `DcNode` class. 
 * It provides real-time data handling functionality using WebSocket connections.
 * The class is designed to act as a generator node in a data processing pipeline.
 * 
 * @remarks
 * - The MQTT protocol is not used due to browser limitations; WebSocket is used instead.
 * - The class interacts with a WebSocket server at `wss://daten.cafe/ws`.
 * - The `RealTime` class is responsible for managing WebSocket connections, subscribing to topics, 
 *   and processing incoming messages.
 * - It uses the `eventBus` for emitting events and `DcNode.providers` for managing data.
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications Writing WebSocket client applications}
 */
// mqtt node class, extends DcNode
// actually uses websockets. mqtt protocol seems not to work from browser
// https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications


import { DcNode } from "./DcNode";
//import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';
import { NodeSpec } from "@/services/GlobalDefs";
import { StorageTypes } from "@/services/GlobalDefs";

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

/**
 * Represents a real-time data processing node that establishes a WebSocket connection
 * to manage and process real-time data streams. This class extends the `DcNode` base class
 * and provides methods for configuration, starting, stopping, and updating data streams.
 *
 * @remarks
 * - The `RealTime` class is designed to handle real-time data flow using WebSocket connections.
 * - It includes methods to configure the node, establish a connection, stop the connection,
 *   and update data dynamically.
 * - The class also manages metadata and integrates with the `DcNode.providers` registry.
 *
 * @example
 * ```typescript
 * const realTimeNode = new RealTime("node1", typeInfo);
 * await realTimeNode.configure(["topic", "password", 1]);
 * await realTimeNode.run();
 * ```
 *
 * @extends DcNode
 */
export class RealTime extends DcNode {
  // properties
  static _display = false;
  static _type = NodeSpec.GEN;
  private socket: any | undefined;
  private startTime = 0
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
        {
          id: "pwd",
          type: "string",
          label: "Password",
          value: "",
        },
        {
          id:"run",
          type:"number",
          label:"Connect",
          value:"0",
          min:"0",
          max:"1"
        }
      ],
    };
    super(id, "realtime", ports, edges, cfg as any);
    DcNode.print(RealTime._type + " created"); // no access to super._id etc here
    //setTimeout(() => {this.load(url)},1000)
  }
  // methods
  /**
   * Configures the real-time instance with the provided options.
   * Updates the internal configuration and triggers either the `run` or `stop` method
   * based on specific conditions.
   *
   * @param options - An array of configuration values to update the instance's settings.
   *                  The structure of the configuration is assumed to be known.
   *                  Each value in the array corresponds to a specific configuration option.
   *
   * @remarks
   * - The method updates the `config.options` array with the provided values.
   * - If the first option is non-empty and the third option equals `1`, the `run` method is called.
   * - Otherwise, the `stop` method is called.
   *
   * @returns A promise that resolves when the configuration process, including any
   *          asynchronous operations (`run` or `stop`), is complete.
   */
  async configure(options: any[]) {
    // we know the config structure here, so can just use the index
    const config = this.config;
    for (let i = 0; i < options.length; i++) {
      config.options[i].value = options[i];
    }
    // update
    this.config = config; // update config
    if ((options[0] != "") && (options[2] == 1)) {
      await this.run()
    } else {
      await this.stop()
    }
  }
  // ---------------------------
  /**
   * Establishes a WebSocket connection and manages real-time data flow.
   * 
   * This method performs the following steps:
   * 1. Checks if a WebSocket connection already exists and is open. If so, it stops the current connection and waits briefly.
   * 2. Ensures that the current node is registered as a provider in the `DcNode.providers` registry.
   * 3. Sets metadata for the provider, including storage type, generator type, and topic.
   * 4. Creates a new WebSocket connection to the specified URL.
   * 5. Sets up event handlers for the WebSocket:
   *    - `onopen`: Sends a subscription request with user credentials and stores the current time as a reference.
   *    - `onmessage`: Processes incoming messages and updates the real-time data using the `RealTime.update` method.
   *    - `onclose`: Logs a message when the WebSocket connection is closed.
   * 
   * @throws {Error} If the WebSocket connection fails to initialize.
   */
  async run() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN)) {
      DcNode.print("Already connected")
      await this.stop();
      await DelayTimer(200)
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
      const pwd = this.config.options[1].value
      await this.socket.send(JSON.stringify({ 
        'action': 'subscribe', 
        'topic': 'dcaf', 
        "id":appId,
        "device": device,
        "pwd": pwd
       }))
       // store current time as reference
       this.startTime = Date.now();

    };

    // this.socket.addEventListener('message', this.update)
    
    // this.socket.addEventListener('message', async (event: any) => {
    this.socket.onmessage = async (event: any) => {
      RealTime.update(this.id,this.startTime, event.data)
    };


    this.socket.onclose = async () => {
      DcNode.print('WebSocket connection closed');
    };


    DcNode.print("Connected ");
  }
  // -------------------------------------
  /**
   * Stops the real-time data stream by unsubscribing from the WebSocket topic
   * and closing the WebSocket connection. Additionally, it removes the provider
   * from the `DcNode.providers` registry if it exists.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the WebSocket is closed
   * and the provider is removed.
   *
   * @remarks
   * - Sends an `unsubscribe` action with the application ID to the WebSocket server.
   * - Ensures the WebSocket is in an open state before attempting to send or close.
   * - Logs a message indicating the MQTT connection has ended.
   *
   * @throws {Error} If any of the asynchronous operations fail.
   */
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
  /**
   * Updates the data associated with a given ID by appending new data and emitting relevant events.
   *
   * @param id - The unique identifier for the data to be updated.
   * @param startTime - The start time in milliseconds used to calculate the timestamp for the new data.
   * @param data - The new data to be appended, expected to be a JSON string.
   *
   * @throws Will alert the user if the provided `data` cannot be parsed as JSON.
   *
   * The method performs the following steps:
   * 1. Parses the input `data` and transforms it into a structured format.
   * 2. Calculates the timestamp for the new data based on the `startTime`.
   * 3. Checks if data already exists for the given `id`:
   *    - If data exists, appends the new data to the existing data.
   *    - If no data exists, creates a new data frame with the new data.
   * 4. Drops any rows with `NaN` values from the data frame.
   * 5. Updates the data provider with the modified data.
   * 6. Emits events to notify listeners about the update and trigger animations.
   */
  static async update(id: string, startTime: number, data: any) {
    DcNode.print("Update on " + String(id));
    let msg
    try {
      msg = JSON.parse(data)
    } catch (e) {
      alert("Bad response" + e)
      return
    }
    const message = {} as any
    for (const k of Object.keys(msg)) {
      message[k] = [msg[k]]
    }
    const date = (Date.now() - startTime ) / 1000 // date is in ms
    message.timestamp = [date]
    console.log("Msg:",message)

    // check data existing
    let df 
    if (await this.providers.hasData(id)) {
      const dt = await DcNode.providers.getDataById(id)
      df = await new DcNode.dfd.DataFrame(dt)
      //const df2 = await new DcNode.dfd.DataFrame({"date":[date],"message":[message]});
      const df2 = await new DcNode.dfd.DataFrame(message);
      //await df.append(row,idx,{inplace:true});
      df = await DcNode.dfd.concat({ dfList: [df, df2], axis: 0 });
    } else {
      // df = await new DcNode.dfd.DataFrame({"date":[date],"message":[message]});
      df = await new DcNode.dfd.DataFrame(message);
    }
    // drop rows with NaN
    df.dropNa({ axis: 1, inplace: true })

    //const dt = await new Date().toISOString();
    await DcNode.providers.update(id, DcNode.dfd.toJSON(df));
    await eventBus.emit(DcNode.signals.NODEANIMATE, id);
    await eventBus.emit((DcNode.signals.UPDPREFIX as string) + id);
  }
  // getters
  /**
   * Gets the type of the RealTime instance.
   * This is a static property shared across all instances of the RealTime class.
   *
   * @returns The type of the RealTime instance.
   */
  get type() {
    return RealTime._type;
  }
  /**
   * Gets the value of the static `_display` property of the `RealTime` class.
   * This property is used to retrieve the current display state.
   *
   * @returns The current value of the `_display` property.
   */
  get display() {
    return RealTime._display;
  }
}
