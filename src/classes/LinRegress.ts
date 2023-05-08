// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { SigPort } from "./DcNode";
import { DataSpecs } from "./DcNode";
import { NodeSpec } from "@/services/GlobalDefs";

export class LinRegress extends DcNode {
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
    super(id, "linregress", ports, edges);
    DcNode.print(LinRegress._type + " created"); // no access to super._id etc here
  }
  // getters/setters
  get type() {
    return LinRegress._type;
  }
  get display() {
    return LinRegress._display;
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
    // check dataspecs
    const oldSpecs = this.specs;
    const specs: DataSpecs[] = [
      {
        port: "A",
        columns: cols,
        types: df.ctypes.values as string[],
      },
    ];
    if (oldSpecs.length == 0 || this.specsChanged(specs)) {
      this.specs = specs;

      // set new config, default pick first column as x
      // -------
      // set config from columns
      const config = this.config
      config.pop = "mixed"
      config.options = [
        {
          id: "xaxis",
          type: "string",
          label: "Independent Var",
          select: true,
          value: cols,
          current: cols[cols.length - 1],
        },
        {
          id: "yaxis",
          type: "string",
          label: "Dependent Var",
          select: true,
          value: cols,
          current: cols[0],
        },
      ]
      this.config = config;
    }

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
    // check if we have the xaxis + yaxis configured
    const xConfig = this.config.options.find(
      (option: any) => option.id == "xaxis"
    );
    const yConfig = this.config.options.find(
      (option: any) => option.id == "yaxis"
    );

    const cols = df.columns;
    let xCol = cols[cols.length - 1]; // will become variable
    if (xConfig !== undefined && xConfig.current != "") {
      xCol = xConfig.current;
    }
    let yCol = cols[0]; // will become variable
    if (yConfig !== undefined && yConfig.current != "") {
      yCol = yConfig.current;
    }

    const xIdx = cols.findIndex((name) => name == xCol);
    const yIdx = cols.findIndex((name) => name == yCol);
    const X = df[cols[xIdx]];
    const Y = df[cols[yIdx]];

    // ---------------------
    let slope = 0
    let intercept = 0
    try {
      const xMean = X.mean();
      const yMean = Y.mean();
      const numerator = X.sub(xMean).mul(Y.sub(yMean)).sum();
      const denominator = X.sub(xMean).pow(2).sum();
      slope = numerator / denominator;
      intercept = yMean - slope * xMean;
    } catch (e) {
      console.log("Invalid column. Configure!", e)
      return
    }

    // Format the equation of the regression line
    const equation = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;

    const prediction = X.mul(slope).add(intercept)
    const residuals = Y.sub(prediction)

    const trace1 = {
      x: X.values,
      y: Y.values,
      mode: 'markers',
      name: yCol,
      error_y: {
        type: "data",
        array: residuals.values,
        visible: true,
      },
      showlegend: false
    }

    const trace2 = {
      x: X.values,
      y: prediction.values,
      mode: 'lines',
      name: 'Trend',
      text: equation,
      hoverinfo: "text",
      showlegend: false
    }

    const layout = {
      title: 'Univariate Linear Regression',
      xaxis: {
        title: xCol
      },
      yaxis: {
        title: yCol
      },
      annotations: [
        {
          x: X.min() + 0.5, // x-coordinate of the text
          y: 1.1, // Y.max() * 1.1, // Y.mean(), // y-coordinate of the text
          xref: 'x',
          yref: 'paper',
          layer: "above",
          text: equation,
          showarrow: false,
          font: {
            family: 'Courier, sans-serif',
            size: 14,
            color: '#000000',
          },
          bgcolor: '#FFFFFF', // background color of the text
          bordercolor: '#000000', // border color of the text background
          borderwidth: 1, // border width of the text background
          borderpad: 4 // padding between the text and the border          
        }
      ],
      showlegend: false
    }

    // ----------------------

    this.plot = await DcNode.Plotly.newPlot(
      divId,
      [trace1, trace2] as any,
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
      height: 720 * 1,
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
