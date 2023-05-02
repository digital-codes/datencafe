import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

//import * as dfd from 'danfojs/dist/danfojs-browser/src';
import * as dfd from "danfojs/dist/danfojs-browser/src";

import Plotly from "plotly.js-dist-min"; // v2.8
//import Plotly from "plotly.js-dist"; // v2.22

//import * as tf from "danfojs-tf";

console.log(Plotly.version);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>

  <div class="chart" id="histogram-plot" style="width:100%;height:400px;"></div>
  <div class="chart"  id="scatter-plot" style="width:100%;height:400px;"></div>
  <div class="chart"  id="lp" style="width:100%;height:400px;"></div>
  <div class="chart"  id="bp" style="width:100%;height:400px;"></div>
  <div class="chart"  id="sp" style="width:100%;height:400px;"></div>
  <div class="chart"  id="hp" style="width:100%;height:400px;"></div>
  <div class="chart"  id="tp" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-line" style="width:100%;height:400px;"></div>

  <div class="chart"  id="plotly-map" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-heat" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-tree" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-reg" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-gls" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-tfregress" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-kmeans" style="width:100%;height:400px;"></div>

  <div class="chart"  id="plotly-splom" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-splom2" style="width:100%;height:400px;"></div>
  <div class="chart"  id="plotly-cross" style="width:100%;height:400px;"></div>

  <div class="img"  id="line-png" style="width:100%;height:400px;"></div>
  <div class="img"  id="table-png" style="width:100%;height:400px;"></div>
  <div class="img"  id="map-png" style="width:100%;height:400px;"></div>

  </div>
`;

const setupPlot = async () => {

  await mnist()

  // Sample data
  const data = {
    A: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    B: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  };

  // Create a DataFrame
  const df = new dfd.DataFrame(data);

  // Histogram plot
  df.plot("histogram-plot").hist({ x: "A", y: "B", width: 800, height: 400 });

  // Scatter plot
  df.plot("scatter-plot").scatter();

  // plotly ----------------------------
  // Define data
  var trace = {
    x: [1, 2, 3, 4, 5],
    y: [1, 4, 2, 3, 5],
    mode: "lines",
  };

  var pdata = [trace];

  // Define layout
  var layout = {
    title: "Line Chart",
    height: 400,
    width: 800,
  };

  // Create the chart. works
  //Plotly.newPlot('plotly-plot', pdata, layout);

  // Create the chart
  Plotly.newPlot("plotly-line", pdata, layout)
    .then(function (gd) {
      // Use Plotly's image export function to export the chart as a PNG
      return Plotly.toImage(gd, { format: "png", width: 800, height: 600 });
    })
    .then(function (png) {
      // Convert the PNG image to a data URL and display it in an image tag
      var img = document.createElement("img");
      img.src = png;
      //document.body.appendChild(img);
      document.getElementById("line-png").appendChild(img);
    })
    .catch(function (err) {
      console.error(err);
    });

  // Define dataset
  var x = [1, 2, 3, 4, 5];
  var y1 = [1, 4, 2, 3, 5];
  var y2 = [2, 5, 1, 4, 3];

  // Define layout for all plots
  var layout = {
    title: "Line Plot",
    showlegend: true,
    height: 400,
    width: 800,
  };

  // Line plot
  var trace1 = {
    x: x,
    y: y1,
    mode: "lines",
    name: "Line 1",
  };

  var trace2 = {
    x: x,
    y: y2,
    mode: "lines",
    name: "Line 2",
  };

  var lineData = [trace1, trace2];
  Plotly.newPlot("lp", lineData, layout);

  // Bar plot
  var trace3 = {
    x: x,
    y: y1,
    type: "bar",
    name: "Bar 1",
  };

  var trace4 = {
    x: x,
    y: y2,
    type: "bar",
    name: "Bar 2",
  };

  layout.title = "Barplot";
  var barData = [trace3, trace4];
  Plotly.newPlot("bp", barData, layout);

  // Scatter plot
  var trace5 = {
    x: x,
    y: y1,
    mode: "markers",
    name: "Scatter 1",
  };

  var trace6 = {
    x: x,
    y: y2,
    mode: "markers",
    name: "Scatter 2",
  };
  layout.title = "scatter";
  var scatterData = [trace5, trace6];
  Plotly.newPlot("sp", scatterData, layout);

  // Histogram
  var histData = [
    {
      x: y1,
      type: "histogram",
      name: "Histogram 1",
    },
    {
      x: y2,
      type: "histogram",
      name: "Histogram 2",
    },
  ];
  layout.title = "Histo";
  Plotly.newPlot("hp", histData, layout);

  // Table
  var tableData = [
    {
      type: "table",
      header: {
        values: ["X", "Y1", "Y2"],
        align: "center",
        fill: {
          color: "#0066CC",
        },
        font: {
          color: "white",
          size: 12,
        },
      },
      cells: {
        values: [x, y1, y2],
        align: "center",
      },
    },
  ];
  layout.title = "Table";
  Plotly.newPlot("tp", tableData, layout)
    .then(function (gd) {
      // Use Plotly's image export function to export the chart as a PNG
      return Plotly.toImage(gd, { format: "png", width: 800, height: 600 });
    })
    .then(function (png) {
      // Convert the PNG image to a data URL and display it in an image tag
      var img = document.createElement("img");
      img.src = png;
      //document.body.appendChild(img);
      document.getElementById("table-png").appendChild(img);
    })
    .catch(function (err) {
      console.error(err);
    });

  // Define map center and zoom level
  var center = { lat: 51.5074, lon: -0.1278 };
  var zoomLevel = 12;

  /*
// Define layout
var mapLayout = {
  title: 'My Map',
  mapbox: {
    center: center,
    zoom: zoomLevel,
    style: geoSpecs //'https://tiles.osm2world.org/styles/osm-bright/style.json'
  }
};
*/

  const osmStyle = {
    id: "osm",
    version: 8,
    sources: {
      "simple-tiles": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
        minzoom: 0,
        maxzoom: 18,
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "simple-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };

  var mapLayout = {
    title: "My Map",
    mapbox: {
      center: center,
      zoom: zoomLevel,
      style: osmStyle, //"open-street-map",
      requestHeaders: { Authorization: "Bearer mytoken" },
      bearing: 0,
      pitch: 0,
      layers: [
        {
          sourcetype: "raster",
          //source: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          /*
          source: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          source: ["https://daten.cafe/php/corsTileProxy.php/{z}/{x}/{y}"],
          */
          type: "raster",
          opacity: 0.7,
        },
      ],
    },
    /*
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
    },
    */
    height: 400,
    width: 800,
    // Add padding and border to map
    paper_bgcolor: "#f8f8f8",
    plot_bgcolor: "#f8f8f8",
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
    },
    bordercolor: "black",
    borderwidth: 1,
  };

  console.log(mapLayout.mapbox.style);
  // Create the map trace

  // more markers and polygons
  var marker1 = {
    type: "scattermapbox",
    lat: [51.5074],
    lon: [-0.1278],
    mode: "markers",
    marker: {
      size: 20,
      color: "red",
    },
    text: "More Marker 1",
    name: "More Marker 1",
    hoverinfo: "text",
    showlegend: false,
  };

  // Define the second marker
  var marker2 = {
    type: "scattermapbox",
    lat: [51.5133],
    lon: [-0.086],
    mode: "markers",
    marker: {
      size: 20,
      color: "blue",
    },
    text: "More Marker 2",
    name: "More Marker 2",
    hoverinfo: "text",
    showlegend: false,
  };
  // Define the first polygon
  var polygon1 = {
    type: "scattermapbox",
    lat: [51.5074, 51.5074, 51.5225, 51.5225],
    lon: [-0.1278, -0.1778, -0.1778, -0.1278],
    mode: "lines",
    fill: "toself",
    fillcolor: "rgba(255, 0, 0, 0.5)",
    name: "Polygon 1",
    text: "Poly1",
    // hover at vertices by default.
    // costom settings not working
    // hovering not working prperly ...
    //hoverinfo: 'text+name',
    //customdata: [['My Polygon', 'This is my polygon'], ['My Polygon', 'It has some text']],
    //hovertemplate: '%{customdata[0]}<br>%{customdata[1]}', // display name and text on hover
    //hovertemplate: '%{name}<br>%{text}',
    showlegend: false,
  };

  // Define the second polygon
  var polygon2 = {
    type: "scattermapbox",
    lat: [51.5158, 51.5237, 51.5158],
    lon: [-0.0984, -0.0916, -0.085],
    mode: "lines",
    fill: "toself",
    fillcolor: "rgba(0, 0, 255, 0.5)",
    name: "Polygon 2",
    text: "Poly2",
    // hoverinfo: 'text+name',
    showlegend: false,
  };

  // Create the data array
  var mapData = [marker1, marker2, polygon1, polygon2];

  // Create the map
  const map1 = await Plotly.newPlot(
    "plotly-map",
    mapData as any,
    mapLayout as any
  );

    // maybe we can update the map with 
    // Plotly.update('myDiv', newData, newLayout);

  const map1png = await Plotly.toImage(map1, {
    format: "png",
    width: 800,
    height: 400,
  });
  const map1img = document.createElement("img");
  map1img.src = map1png;
  //document.body.appendChild(img);
  document.getElementById("map-png").appendChild(map1img);

  // --------
  var heatData = [
    {
      type: "heatmap",
      z: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
      x: ["A", "B", "C"],
      y: ["X", "Y", "Z"],
      colorscale: "Viridis",
    },
  ];

  var heatLayout = {
    title: "My Heatmap",
    height: 400,
    width: 800,
    xaxis: { title: "X Axis" },
    yaxis: { title: "Y Axis" },
  };

  Plotly.newPlot("plotly-heat", heatData as any, heatLayout);

  var treeData = [
    {
      type: "treemap",
      ids: ["A", "B", "C", "D", "E", "F"],
      labels: ["A", "B", "C", "D", "E", "F"],
      parents: ["", "A", "A", "B", "B", "C"],
      values: [1, 2, 3, 4, 5, 6],
      textposition: "middle center",
      marker: {
        colorscale: "Blues",
        reversescale: true,
      },
    },
  ];

  var treeLayout = {
    title: "My Treemap",
    height: 400,
    width: 800,
    autosize: true,
    margin: { l: 20, r: 20, t: 40, b: 20 },
  };

  Plotly.newPlot("plotly-tree", treeData as any, treeLayout);

  //

  await regressionPlot();
  await dfRegression()
  await univarRegress()
  await kmeans()
  await splom1();
  await splom2();
  await cross();

};

async function regressionPlot() {
  // regression
  // Define sample data
  var x = [1, 2, 3, 4, 5];
  var y = [2, 3, 5, 6, 7];

  // Calculate regression line
  var regression = linearRegression(x, y);

  // Define trace for data points
  var trace1 = {
    x: x,
    y: y,
    mode: "markers",
    type: "scatter",
    name: "Data Points",
  };

  // Define trace for regression line
  var trace2 = {
    x: x,
    y: regression.predict(x),
    mode: "lines",
    type: "scatter",
    name: "Regression Line",
  };

  // Define layout
  var layout = {
    title: "Scatter Plot with Linear Regression Line",
    xaxis: { title: "X Axis" },
    yaxis: { title: "Y Axis" },
  };

  // Create plot
  Plotly.newPlot("plotly-reg", [trace1, trace2], layout);

  // Function to calculate linear regression
  function linearRegression(x, y) {
    var n = x.length;
    var sx = 0,
      sy = 0,
      sxy = 0,
      sxx = 0,
      syy = 0;
    for (var i = 0; i < n; i++) {
      sx += x[i];
      sy += y[i];
      sxy += x[i] * y[i];
      sxx += x[i] * x[i];
      syy += y[i] * y[i];
    }
    var slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    var intercept = (sy - slope * sx) / n;
    return {
      slope: slope,
      intercept: intercept,
      predict: function (x) {
        return this.intercept + x * this.slope;
      },
      r2: Math.pow(
        (n * sxy - sx * sy) /
          Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy)),
        2
      ),
    };
  }
}

async function splom1() {
  // ------------ splom ----------------

  // Create a Danfo.js DataFrame
  var splom_data = {
    col1: [1, 2, 3, 4, 5],
    col2: [5, 4, 3, 2, 1],
    col3: [2, 3, 4, 5, 1],
    col4: [4, 5, 1, 2, 3],
  };

  const splom_df = new dfd.DataFrame(splom_data);

  // Create an array of traces for the scatterplot matrix
  var splom_traces = [];
  var splom_cols = splom_df.columns;

  let idx = 1;
  for (var i = 0; i < splom_cols.length; i++) {
    var x = splom_df[splom_cols[i]].values;

    for (var j = 0; j < splom_cols.length; j++) {
      var y = splom_df[splom_cols[j]].values;

      var splom_trace = {
        x: x,
        y: y,
        xaxis: "x" + String(idx),
        yaxis: "y" + String(idx++),
      };

      if (i == j) {
        // Set diagonal plots to histogram
        splom_trace.type = "histogram";
      } else {
        // Set off-diagonal plots to scatter
        splom_trace.marker = { size: 5, opacity: 0.5 };
        splom_trace.mode = "markers";
        splom_trace.type = "scatter";
      }
      splom_traces.push(splom_trace);
    }
  }

  // Create the scatterplot matrix
  var splom_layout = {
    title: "Scatterplot Matrix",
    width: 800,
    height: 400,
    grid: {
      rows: splom_cols.length,
      columns: splom_cols.length,
      pattern: "independent",
    },
  };

  Plotly.newPlot("plotly-splom", splom_traces as any, splom_layout as any);
}

async function splom2() {
  var trace1 = {
    x: [1, 2, 3],
    y: [4, 5, 6],
    type: "histogram",
  };

  var trace2 = {
    x: [20, 30, 40],
    y: [50, 60, 70],
    xaxis: "x2",
    yaxis: "y2",
    type: "scatter",
  };

  var trace3 = {
    x: [300, 400, 500],
    y: [600, 700, 800],
    xaxis: "x3",
    yaxis: "y3",
    type: "scatter",
    mode: "markers",
  };

  var trace4 = {
    x: [4000, 5000, 6000],
    y: [7000, 8000, 9000],
    xaxis: "x4",
    yaxis: "y4",
    type: "scatter",
  };

  var data = [trace1, trace2, trace3, trace4];

  var layout = {
    title: "Splom 3",
    width: 800,
    height: 400,
    grid: { rows: 2, columns: 2, pattern: "independent" },
  };

  Plotly.newPlot("plotly-splom2", data, layout);
}

function cross() {
  // Define the two signals
  var x = [1, 2, 3, 4, 5];
  var y = [2, 3, 5, 6, 7];

  // Compute the cross-correlation between x and y
  var corr = crossCorrelation(x, y);

  // Create a scatter plot with a line connecting the data points
  var trace1 = {
    x: corr.lags,
    y: corr.values,
    mode: "lines+markers",
    type: "scatter",
    name: "Cross-correlation",
  };

  // Define layout
  var layout = {
    title: "Cross-correlation Plot",
    xaxis: { title: "Lag" },
    yaxis: { title: "Correlation" },
  };

  // Create plot
  Plotly.newPlot("plotly-cross", [trace1], layout);

  // Function to compute cross-correlation
  function crossCorrelation(x, y) {
    var n = x.length;
    var lags = Array.from({ length: n }, (_, i) => i - Math.floor(n / 2));
    var values = [];
    for (var lag of lags) {
      var sum = 0;
      for (var i = 0; i < n; i++) {
        var j = i - lag;
        if (j >= 0 && j < n) {
          sum += x[i] * y[j];
        }
      }
      values.push(sum);
    }
    return { lags: lags, values: values };
  }
}

async function dfRegression () {

// Define data
const data = {
  "x":[1, 2, 3, 4, 5],
  "y":[2, 3, 5, 6, 8],
}

// Create a DataFrame from the data
const df = new dfd.DataFrame(data) //, { columns: ["x", "y", "err"] });
df.print()
console.log("Shape:",df.shape)
const tf = dfd.tensorflow

// see also https://medium.com/@roushanakrahmat/tensorflow-js-tutorial-to-build-a-simple-linear-regression-model-cb30c501d2f8
const model = await tf.sequential();
await model.add(tf.layers.dense({units: 1, inputShape: [1]}))  // 1. important
await model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Train the model
const x = await tf.tensor2d(df["x"].values, [df.shape[0], 1]);
const y = await tf.tensor2d(df["y"].values, [df.shape[0], 1]);
console.log("Starting fit ...")
await model.fit(x,y, { epochs: 100 });
console.log("Fit done")

// Compute the predicted y values
const y_pred = await model.predict(x);
console.log("Predict done")

// Compute the residuals
const residuals = await tf.sub(y, y_pred).arraySync().flat();
console.log("tf residuals",residuals)

// Create the plot data
const plotData = [
  {
    x: df["x"].values,
    y: df["y"].values,
    mode: "markers",
    name: "Data",
    error_y: {
      type: "data",
      array: residuals,
      visible: true,
    },
  },
  {
    x: df["x"].values,
    y: y_pred.arraySync().flat(),
    mode: "lines",
    name: "Linear Regression",
  },
];

// Create the layout
const layout = {
  title: "Line Plot with Linear Regression and Error Bars",
  xaxis: {
    title: "X",
  },
  yaxis: {
    title: "Y",
  },
  yaxis2: {
    title: "Residuals",
    overlaying: "y",
    side: "right",
  },
};

// Create the plot
Plotly.newPlot("plotly-tfregress", plotData, layout);

}

async function kmeans() {

  // Load the data into a DataFrame
  const data = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]];

    const nClusters = 3

    // Define a function to calculate the distance between two points
    function distance(p1:any, p2:any) {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Define a function to assign each data point to a cluster
    function assignClusters(data:any, centroids:any) {
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
    function mean(points:any) {
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
    function updateCentroids(clusters:any) {
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

    const traces = [];
    // clusters
    for (const i in clusters) {
      const X = clusters[i].map((item:any) => item.x);
      const Y = clusters[i].map((item:any) => item.y);
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
        title: "X",
      },
      yaxis: {
        title: "Y",
      },
    };

// Create the plot
Plotly.newPlot("plotly-kmeans", traces, layout);

}

async function univarRegress() {


// Load the data
const data = {
  "x":[1, 2, 3, 4, 5],
  "y":[2, 3, 5, 6, 8],
}
const df = new dfd.DataFrame(data);

const xMean = df['x'].mean();
const yMean = df['y'].mean();
const numerator = df['x'].sub(xMean).mul(df['y'].sub(yMean)).sum();
const denominator = df['x'].sub(xMean).pow(2).sum();
const slope = numerator / denominator;
const intercept = yMean - slope * xMean;
console.log("slope,intercept",slope, intercept);

// Format the equation of the regression line
const equation = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
console.log(equation)

const prediction = df['x'].mul(slope).add(intercept)
const residuals = df["y"].sub(prediction)
console.log(prediction.values,residuals.values)

const trace1 = {
  x: df['x'].values,
  y: df['y'].values,
  mode: 'markers',
  name: 'Data',
  error_y: {
    type: "data",
    array: residuals.values,
    visible: true,
  },
}

const trace2 = {
  x: df['x'].values,
  y: prediction.values,
  mode: 'lines',
  name: 'Linear Regression',
  text: equation,
  hoverinfo: "text",
}

const layout = {
  title: 'Univariate Linear Regression',
  xaxis: {
    title: 'Independent Variable'
  },
  yaxis: {
    title: 'Dependent Variable'
  },
  annotations: [
    {
      x: df["x"].min() + 0.5, // x-coordinate of the text
      y: df["y"].mean(), // y-coordinate of the text
      xref: 'x',
      yref: 'y',
      layer: "above",
      text: equation,
      showarrow: false,
      font: {
        family: 'Arial, sans-serif',
        size: 14,
        color: '#000000'
      }
    }
  ]
}

Plotly.newPlot("plotly-gls", [trace1, trace2], layout as any);

}

import * as tfdata from "tensorflow/tfjs-data"

async function mnist () {
// Load the MNIST dataset
//const mnist = require('tfjs-data').mnist;
const { data, labels } = mnist.getTrainData();

// Define the model architecture
const model = tf.sequential();
model.add(tf.layers.flatten({ inputShape: [28, 28] }));
model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
model.add(tf.layers.dropout({ rate: 0.2 }));
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

// Compile the model
model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

// Train the model
const batchSize = 32;
const epochs = 10;
model.fit(data, labels, {
  batchSize,
  epochs,
  callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 2 }),
  validationSplit: 0.1,
});

// Evaluate the model
const { data: testData, labels: testLabels } = mnist.getTestData();
const evalOutput = model.evaluate(testData, testLabels);

console.log(`Test set loss: ${evalOutput[0].dataSync()[0].toFixed(4)}`);
console.log(`Test set accuracy: ${evalOutput[1].dataSync()[0].toFixed(4)}`);

}

setupPlot();
