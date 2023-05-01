// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { SigPort } from "./DcNode";
import { NodeSpec } from "@/services/GlobalDefs";

export class ScatterPlot extends DcNode {
  // properties
  private updCnt = 0;
  static _display = true;
  static _type = NodeSpec.CHART; //"chart"
  private plot: any = null;
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"];
    const edges: string[] = ["d"];
    super(id, "scatterplot", ports, edges);
    DcNode.print(ScatterPlot._type + " created"); // no access to super._id etc here
  }
  // getters/setters
  get type() {
    return ScatterPlot._type;
  }
  get display() {
    return ScatterPlot._display;
  }
  // methods
  // --------------------------------------------------
  async configure(optionString: string) {
    // we know the config structure here, so can just use the index
    const options = JSON.parse(optionString);
    for (let i = 0; i < this.config.options.length; i++) {
      this.config.options[i].current = options[i];
      DcNode.print("Set option:" + options[i]);
    }
    if (this.signals.length < 1) {
      return;
    }
    // just use first signal to trigger an update
    const src = this.signals[0].signal.split("-")[1];
    DcNode.print("Updating from:" + src);
    await this.draw(src)
  }
  // --------------------------------------------------
  async updated(msg: string, y?: any) {
    this.updCnt++;
    const src = msg.split("-")[1];
    DcNode.print(
      src +
      " updated " +
      this.id +
      ": " +
      String(this.updCnt) +
      "..." +
      String(y)
    );
    const dt = DcNode.providers.getDataById(src);
    const df = new DcNode.dfd.DataFrame(dt);
    // pick first column as x
    const cols = df.columns;
    // -------
    // set config from columns
    const config = this.config;
    config.pop = "mixed";
    config.options = [
      {
        id: "xaxis",
        type: "string",
        label: "X-Axis",
        select: true,
        value: cols,
        current: cols[cols.length - 1],
      },
    ];
    this.config = config;
    await this.draw(src);
  }
  // ------- do the drawing
  private async draw(src: string) {
    const dt = DcNode.providers.getDataById(src);
    const df = new DcNode.dfd.DataFrame(dt);
    const divId = DcNode.pre.PLOTPREFIX + this.id;
    const target = await document.getElementById(divId);
    if (target === undefined || target == null) {
      throw new Error("Invalid ID: " + String(divId));
    }
    // new plot
    // Define layout and trace
    // check if we have the xaxis configured
    const xConfig = this.config.options.find(
      (option: any) => option.id == "xaxis"
    );
    const cols = df.columns;
    let xCol = cols[cols.length - 1]; // will become variable
    if (xConfig !== undefined && xConfig.current != "") {
      xCol = xConfig.current;
    }
    const xIdx = cols.findIndex((name) => name == xCol);
    const X = df[cols[xIdx]].values;
    const traces = [];
    for (let i = 0; i < cols.length; i++) {
      if (i == xIdx) continue;
      const trace = {
        x: X,
        y: df[cols[i]].values,
        mode: "markers",
        type: "scatter",
        /*
        line: {
          //color: 'rgb(55, 128, 191)',
          width: 3,
        },
        */
        name: cols[i],
      };
      traces.push(trace);
    }

    const layout = {
      title: "Scatter Plot",
      xaxis: { title: cols[xIdx] },
      yaxis: { title: "Y axis" },
      /*
      height: 400,
      width: 800,
      */
    };

    this.plot = await DcNode.Plotly.newPlot(
      divId,
      traces as any,
      layout as any
    );

    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id);
    //await super.messaging.emit(divId) // div used for signalling ..
    /*
    df.describe().print()
    df.print()
    */
  }
  msgOn(x: string, y: string) {
    // set event listener for signal
    DcNode.print("msg ON for " + x + " on port " + y);
    super.messaging.on(x, (y: any) => {
      this.updated(x, y);
    });
    const sigs = this.signals;
    if (sigs.find((s) => s.signal == x) === undefined) {
      sigs.push({ signal: x, port: y } as SigPort);
    }
    this.signals = sigs;
    DcNode.print("Signals now: " + JSON.stringify(this.signals));
  }
  msgOff(x: string) {
    // set event listener for signal
    DcNode.print("msg OFF for " + x);
    super.messaging.off(x);
    const sigs = this.signals;
    const idx = sigs.findIndex((s) => s.signal == x);
    if (idx == -1) throw new Error("Invalid signal");
    sigs.splice(idx, 1);
    this.signals = sigs;
    DcNode.print("Signals now: " + JSON.stringify(this.signals));
  }
  async getImage() {
    if (this.plot == null) {
      DcNode.print("Empty plot");
      return "";
    }
    const png = await DcNode.Plotly.toImage(this.plot, {
      format: "png",
      width: 1280,
      height: 720,
    });
    return png;
  }
}


/*
refresh maybe like so
setTimeout(() => {
  // Update layout
  const newLayout = {
    title: 'Updated Plot'
  };

  // Update plot layout
  Plotly.update('plot', {}, newLayout);
}, 5000);

or // Update plot with new data and layout
  Plotly.react('plot', newData, newLayout);
}, 5000);


*/