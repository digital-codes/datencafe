import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";

//import * as dfd from 'danfojs/dist/danfojs-browser/src';
import * as dfd from "danfojs/dist/danfojs-browser/src";

import Plotly from "plotly.js-dist-min";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>

  <div id="histogram-plot" style="width:100%;height:400px;"></div>
  <div id="scatter-plot" style="width:100%;height:400px;"></div>
  <div id="lp" style="width:100%;height:400px;"></div>
  <div id="bp" style="width:100%;height:400px;"></div>
  <div id="sp" style="width:100%;height:400px;"></div>
  <div id="hp" style="width:100%;height:400px;"></div>
  <div id="tp" style="width:100%;height:400px;"></div>
  <div id="plotly-line" style="width:100%;height:400px;"></div>

  <div id="plotly-map" style="width:100%;height:400px;"></div>
  <div id="plotly-heat" style="width:100%;height:400px;"></div>
  <div id="plotly-tree" style="width:100%;height:400px;"></div>

  <div id="line-png" style="width:100%;height:400px;"></div>
  <div id="table-png" style="width:100%;height:400px;"></div>
  <div id="map-png" style="width:100%;height:400px;"></div>

    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const setupPlot = async () => {
  // Sample data
  const data = {
    A: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    B: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  };

  // Create a DataFrame
  const df = new dfd.DataFrame(data);

  // Histogram plot
  df.plot("histogram-plot").hist();

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

  layout.title = "Barplot"
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
  layout.title = "scatter"
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
  layout.title = "Histo"
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
  layout.title="Table"
  Plotly.newPlot("tp", tableData,layout)
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
      "id": "osm",
      "version": 8,
      "sources": {
        "simple-tiles": {
          "type": "raster",
          "tiles": [
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          ],
          "tileSize": 256,
          "attribution": "© OpenStreetMap contributors",
          "minzoom": 0,
          "maxzoom": 18

        }
      },
      "layers": [
        {
          "id": "simple-tiles",
          "type": "raster",
          "source": "simple-tiles",
          "minzoom": 0,
          "maxzoom": 22
        }
      ]
  }
  


  var mapLayout = {
    title: "My Map",
    mapbox: {
      center: center,
      zoom: zoomLevel,
      style: osmStyle, //"open-street-map",
      requestHeaders: {'Authorization': 'Bearer mytoken'},
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

  console.log(mapLayout.mapbox.style)
  // Create the map trace

  // more markers and polygons
  var marker1 = {
    type: 'scattermapbox',
    lat: [51.5074],
    lon: [-0.1278],
    mode: 'markers',
    marker: {
      size: 20,
      color: 'red'
    },
    text: 'More Marker 1',
    name: 'More Marker 1',
    hoverinfo: 'text',
    showlegend: false      
  };

  // Define the second marker
  var marker2 = {
    type: 'scattermapbox',
    lat: [51.5133],
    lon: [-0.0860],
    mode: 'markers',
    marker: {
      size: 20,
      color: 'blue'
    },
    text: 'More Marker 2',
    name: 'More Marker 2',
    hoverinfo: 'text',
    showlegend: false      
  };
  // Define the first polygon
var polygon1 = {
  type: 'scattermapbox',
  lat: [51.5074, 51.5074, 51.5225, 51.5225],
  lon: [-0.1278, -0.1778, -0.1778, -0.1278],
  mode: 'lines',
  fill: 'toself',
  fillcolor: 'rgba(255, 0, 0, 0.5)',
  name: 'Polygon 1',
  text: "Poly1",
  // hover at vertices by default.
  // costom settings not working
  // hovering not working prperly ...
  //hoverinfo: 'text+name',
  //customdata: [['My Polygon', 'This is my polygon'], ['My Polygon', 'It has some text']],
  //hovertemplate: '%{customdata[0]}<br>%{customdata[1]}', // display name and text on hover
  //hovertemplate: '%{name}<br>%{text}',
  showlegend: false      
};

// Define the second polygon
var polygon2 = {
  type: 'scattermapbox',
  lat: [51.5158, 51.5237, 51.5158],
  lon: [-0.0984, -0.0916, -0.0850],
  mode: 'lines',
  fill: 'toself',
  fillcolor: 'rgba(0, 0, 255, 0.5)',
  name: 'Polygon 2',
  text: "Poly2",
  // hoverinfo: 'text+name',
  showlegend: false      
};



  // Create the data array
  var mapData = [marker1,marker2,polygon1,polygon2];

  // Create the map
  const map1 = await Plotly.newPlot("plotly-map", mapData as any, mapLayout as any);
  const map1png = await Plotly.toImage(map1, { format: "png", width: 800, height: 400 });
  const map1img = document.createElement("img")
  map1img.src = map1png
  //document.body.appendChild(img);
  document.getElementById("map-png").appendChild(map1img);

  // --------
  var heatData = [  {    type: 'heatmap',    z: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    x: ['A', 'B', 'C'],
    y: ['X', 'Y', 'Z'],
    colorscale: 'Viridis'
  }
];

var heatLayout = {
  title: 'My Heatmap',
  height: 400,
  width: 800,
xaxis: {title: 'X Axis'},
  yaxis: {title: 'Y Axis'}
};

Plotly.newPlot('plotly-heat', heatData as any, heatLayout);


  var treeData = [  {    type: 'treemap',    ids: ['A', 'B', 'C', 'D', 'E', 'F'],
  labels: ['A', 'B', 'C', 'D', 'E', 'F'],
  parents: ['', 'A', 'A', 'B', 'B', 'C'],
  values: [1, 2, 3, 4, 5, 6],
  textposition: 'middle center',
  marker: {
    colorscale: 'Blues',
    reversescale: true
  }
}
];

var treeLayout = {
title: 'My Treemap',
height: 400,
width: 800,
autosize: true,
margin: {l: 20, r: 20, t: 40, b: 20}
};

Plotly.newPlot('plotly-tree', treeData as any, treeLayout);


};

setupPlot();
