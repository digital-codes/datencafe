// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { SigPort } from "./DcNode";
import { NodeSpec } from "@/services/GlobalDefs";

// user store
import { UserStore } from "@/services/UserStore";
const userStore = UserStore();

import chroma from "chroma-js"

const osmStyleDefault = {
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

const mapLayoutDefault = {
  title: "My Map",
  mapbox: {
    center: { lat: 49.0, lon: 8.4 }, // center,
    zoom: 12, // zoomLevel,
    style: osmStyleDefault, //"open-street-map",
    bearing: 0,
    pitch: 0,
    layers: [
      {
        sourcetype: "raster",
        type: "raster",
        opacity: 0.7,
      },
    ],
  },
  /*
  height: 400,
  width: 800,
  */
  // Add padding and border to map
  paper_bgcolor: "#f8f8f8",
  plot_bgcolor: "#f8f8f8",
  margin: {
    l: 10,
    r: 10,
    b: 10,
    t: 30,
  },
  bordercolor: "black",
  borderwidth: 1,
  //
  hovermode: 'closest',
  hoverlabel: {
    bgcolor: 'white',
    bordercolor: 'black',
    font: {
      color: 'black'
    }
  },
  //renderer: 'canvas'
}

export class PointMap extends DcNode {
  // properties
  static _display = true;
  static _type = NodeSpec.MAP;
  private updCnt = 0;
  private map: any = null;
  private layer: any = null;
  private geoData: any = {};
  private plot: any = null;
  private features: any[] = [];
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"];
    const edges: string[] = ["d"];
    super(id, "pointmap", ports, edges);
    DcNode.print(PointMap._type + " created"); // no access to super._id etc here
  }
  // getters/setters
  get type() {
    return PointMap._type;
  }
  get display() {
    return PointMap._display;
  }
  // methods
  async updated(msg: string, y?: any) {
    this.updCnt++;
    const src = msg.split("-")[1];
    DcNode.print(src + " updated " + super.id + ": " + String(this.updCnt));
    const dt = DcNode.providers.getDataById(src);
    const divId = DcNode.pre.PLOTPREFIX + super.id;
    const target = document.getElementById(divId);
    if (target === undefined || target == null) {
      throw new Error("Invalid ID: " + String(divId));
    }
    // processing here
    /* code to destroy ...
    if (this.map) {
      await this.layer.remove()
      await this.map.remove()
    }
    */

    // init
    // check if should use the cors proxy ...
    const style = osmStyleDefault;
    const layout = mapLayoutDefault;
    if (userStore.exists()) {
      const token = await userStore.getToken();
      const parms = "?token=" + token + "&z={z}&x={x}&y={y}";
      let url;
      if (window.location.hostname.includes("localhost")) {
        url = "http://localhost:9000/php/tileProxy.php" + parms;
      } else {
        url = "/php/tileProxy.php" + parms;
      }
      style.sources["simple-tiles"].tiles = [url];
    }

    // clear if required
    if (this.geoData.type && this.geoData.type == "FeatureCollection") {
      console.log("Clear markers and polies");
      this.features = [];
    }
    // copy data
    this.geoData = dt;
    // check data for points
    let hasPoints = false;
    const numFeatures = this.geoData.features.length;
    const cs = chroma.scale(['#ff0000', '#0000ff']).domain([0,numFeatures]);
    console.log(cs(0).hex(),cs(5).hex())
    /*
    const colorscale = [
      [0, "rgba(255,0,0,.01)"],
      [0.5, "rgba(0,255,0,.01)"],
      [1, "rgba(0,0,255,.01)"],
    ];
    */
    for (let idx = 0; idx < this.geoData.features.length; idx++) {
      const element = await this.geoData.features[idx];
      // console.log("e:", element);
      if (element.geometry.type.toLowerCase() == "point") {
        hasPoints = true;
        const point = {
          type: "scattermapbox",
          lat: [element.geometry.coordinates[1]],
          lon: [element.geometry.coordinates[0]],
          mode: "markers",
          marker: {
            size: 20,
            color: "red",
          },
          text: "Marker",
          name: "Marker",
          hoverinfo: "text",
          showlegend: false,
          id: "",
        };
        // we can add the popupcontent here ...
        if (element.properties.popupContent) {
          point.text = String(element.properties.popupContent);
          point.name = String(element.properties.popupContent);
        } else {
          if (element.properties.NAME) {
            point.text = String(element.properties.NAME);
            point.name = String(element.properties.NAME);
          }
        }
        // add an id
        if (element.properties.id) {
          point.id = String(element.properties.id);
        } else {
          point.id = String(idx);
        }
        this.features.push(point);
      }
      if (element.geometry.type.toLowerCase() == "polygon") {
        // Define the first polygon
        if (element.geometry.coordinates.length > 1) {
          alert("Multiploygon. Read only first set");
        }
        const lats: number[] = [];
        const lons: number[] = [];
        element.geometry.coordinates[0].forEach((c: number[]) => {
          lats.push(c[1]);
          lons.push(c[0]);
        });
        let id = "0";
        if (element.properties.id !== undefined) {
          id = String(element.properties.id);
        } else {
          id = String(idx);
        }
        let name = "Polygon";
        if (element.properties.name !== undefined) {
          name = element.properties.name;
        }
        const fillColor = cs(idx).alpha(.1)
        //console.log(fillColor)
        const polygon = {
          type: "scattermapbox",
          lat: lats,
          lon: lons,
          mode: "lines",
          line: {
            color: fillColor, // 'rgb(255,255,255)',
            width: 2
          },
          fill: "toself",
          fillcolor: fillColor, //  / numFeatures, // fillColor, // "rgba(255, 0, 0, 0.5)",
          //colorscale: colorscale,
          //fillColor: "rgb(255,255,0)",
          opacity: 1, // important to make fillcolor alfa channel work
          name: name,
          text: name,
          hoverinfo: 'text',
          // hover at vertices by default.
          // costom settings not working
          // hovering not working prperly ...
          //hoverinfo: 'text+name',
          //customdata: [['My Polygon', 'This is my polygon'], ['My Polygon', 'It has some text']],
          //hovertemplate: '%{customdata[0]}<br>%{customdata[1]}', // display name and text on hover
          //hovertemplate: '%{name}<br>%{text}',
          showlegend: false,
          id: id,
        };
        //polygon
        this.features.push(polygon); //element.geometry.coordinates);
        //const pl = L.geoJSON(element);
        //pl.addTo(this.map);
      }
    }
    // Create the map
    const mapData: any = this.features; // [marker1] // marker1, marker2, polygon1, polygon2];
    //const mapData: any = [marker1] // marker1, marker2, polygon1, polygon2];
    this.plot = await DcNode.Plotly.newPlot(
      divId,
      mapData as any,
      layout as any
    );
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id);
  }

  // rest
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
  // overwrite consent
  get consent() {
    return true;
  }
  async getImage() {
    if (this.plot == null) {
      console.log("Empty plot");
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

