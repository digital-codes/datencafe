// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { SigPort } from "./DcNode";
import { DataSpecs } from "./DcNode";
import { NodeSpec } from "@/services/GlobalDefs";

export class KmeansCluster extends DcNode {
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
    super(id, "kmeanscluster", ports, edges);
    DcNode.print(KmeansCluster._type + " created"); // no access to super._id etc here
  }
  // getters/setters
  get type() {
    return KmeansCluster._type;
  }
  get display() {
    return KmeansCluster._display;
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
    await this.draw(src);
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
      // set config from columns
      const config = this.config;
      config.pop = "mixed";
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
        {
          id: "clusters",
          type: "number",
          label: "Clusters",
          select: false,
          value: 3, // [2, 3, 4, 5],
          current: 3,
          min: 2,
          max: 5
        },
      ];
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
    const cConfig = this.config.options.find(
      (option: any) => option.id == "clusters"
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
    let nClusters = 3;
    if (cConfig !== undefined && cConfig.current != "") {
      nClusters = cConfig.current;
    }

    const xIdx = cols.findIndex((name) => name == xCol);
    const yIdx = cols.findIndex((name) => name == yCol);
    const xName = cols[xIdx]
    const yName = cols[yIdx]
    const XY = df.loc({ columns: [cols[xIdx], cols[yIdx]] });

    const data: any = XY.values.map((r: any) => {
      return { x: r[0], y: r[1] };
    });

    // -----------------------------

    // Define a function to calculate the distance between two points
    function distance(p1: any, p2: any) {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Define a function to assign each data point to a cluster
    function assignClusters(data: any, centroids: any) {
      const clusters = new Array(nClusters);
      for (let i = 0; i < nClusters; i++) {
        clusters[i] = [];
      }
      for (let i = 0; i < data.length; i++) {
        let closestCentroidIndex = 0;
        let closestDistance = Infinity;
        for (let j = 0; j < nClusters; j++) {
          const d = distance(data[i], centroids[j]);
          if (d < closestDistance) {
            closestCentroidIndex = j;
            closestDistance = d;
          }
        }
        clusters[closestCentroidIndex].push(data[i]);
      }
      return clusters;
    }

    // Define a function to calculate the mean of a set of points
    function mean(points: any) {
      let sumX = 0;
      let sumY = 0;
      for (let i = 0; i < points.length; i++) {
        sumX += points[i].x;
        sumY += points[i].y;
      }
      const meanX = sumX / points.length;
      const meanY = sumY / points.length;
      return {
        x: meanX,
        y: meanY,
      };
    }

    // Define a function to update the centroids of each cluster
    function updateCentroids(clusters: any) {
      const centroids = new Array(nClusters);
      for (let i = 0; i < nClusters; i++) {
        centroids[i] = mean(clusters[i]);
      }
      return centroids;
    }

    // Define the initial centroids as random points
    let centroids = [];
    for (let i = 0; i < nClusters; i++) {
      centroids.push(data[Math.floor(Math.random() * data.length)]);
    }

    // Iterate until convergence
    let clusters = [];
    for (let i = 0; i < 10; i++) {
      clusters = assignClusters(data, centroids);
      centroids = updateCentroids(clusters);
    }

    // we get an array with centrods, size K
    // and clusters = an array size K with arrays of points

    console.log(clusters);
    // create dataframe for centroids and clusters
    const kmDf = await this.createdDf(centroids, clusters);
    kmDf.print()
    // add to datastore ...

    const traces = [];
    // clusters
    for (const i in clusters) {
      const X = clusters[i].map((item: any) => item.x);
      const Y = clusters[i].map((item: any) => item.y);
      const trace = {
        x: X,
        y: Y,
        mode: "markers",
        name: "Cluster" + String(i),
        marker: {
          //color: assignedPoints.column("centroid").values,
          size: 10,
          opacity: 0.8,
        },
      };
      traces.push(trace);
    }

    // centroids
    const ctrace = {
      x: centroids.map((centroid) => centroid.x),
      y: centroids.map((centroid) => centroid.y),
      mode: "markers",
      name: "Centroids",
      marker: {
        color: "black",
        size: 15,
        symbol: "cross",
      },
    };
    traces.push(ctrace);

    const layout = {
      title: "K-Means Clustering",
      xaxis: {
        title: xName,
      },
      yaxis: {
        title: yName,
      },
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
  // ------------------------------
  private async createdDf(centroids: any, clusters: any) {
    // compute max length
    const kmSizes = [];
    kmSizes.push(centroids.length);
    for (const i of clusters) {
      kmSizes.push(i.length);
    }
    const kmLength = Math.max(...kmSizes);

    let fl: any, dx: any, dy: any;
    let nx: string, ny: string;
    fl = new Array(kmLength - centroids.length).fill(NaN);
    dx = centroids.map((c: any) => c.x);
    dx.push(...fl);
    dy = centroids.map((c: any) => c.y);
    dy.push(...fl);
    const kmData: any = {
      centroids_x: dx,
      centroids_y: dy,
    };

    for (const i in clusters) {
      nx = "Clust" + String(i) + "_x";
      ny = "Clust" + String(i) + "_y";
      fl = new Array(kmLength - clusters[i].length).fill(NaN);
      dx = clusters[i].map((c: any) => c.x);
      dx.push(...fl);
      dy = clusters[i].map((c: any) => c.y);
      dy.push(...fl);
      kmData[nx as keyof typeof kmData] = dx;
      kmData[ny as keyof typeof kmData] = dy;
    }
    const km = new DcNode.dfd.DataFrame(kmData);
    return km;
  }
  // --------------------
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
