// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { SigPort } from "./DcNode";
import { NodeSpec } from "@/services/GlobalDefs";

// user store
import { UserStore } from "@/services/UserStore";
const userStore = UserStore();

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
};



export class PointMap extends DcNode {
  // properties
  static _display = true;
  static _type = NodeSpec.LEAFLET;
  private updCnt = 0;
  private map: any = null;
  private layer: any = null;
  private geoData: any = {};
  private plot: any = null
  private features: any[] = []
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
    const style = osmStyleDefault
    const layout = mapLayoutDefault
    if (userStore.exists()) {
      const token = await userStore.getToken()
      const parms = "?token=" + token + "&z={z}&x={x}&y={y}"
      let url
      if (window.location.hostname.includes("localhost")) {
        url = "http://localhost:9000/php/tileProxy.php" + parms
      } else {
        url = "/php/tileProxy.php" + parms;
      }
      style.sources["simple-tiles"].tiles = [url]
      // maybe alos set center and zoom here ...
    }

    /*
    if (!this.map) {
      this.map = await L.map(divId);
      // check token. use proxy if existing
      // we could maybe use the normal way if we have consent?
      // or use a proxy setting ....
      if (userStore.exists()) {
        const token = await userStore.getToken()
        const parms = "?token=" + token + "&z={z}&x={x}&y={y}"
        let url
        if (window.location.hostname.includes("localhost"))
          url = "http://localhost:9000/php/tileProxy.php" + parms
        else 
          url = "/php/tileProxy.php" + parms;
        await L.tileLayer(url).addTo(this.map);
      } else {
        await L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "Map data &copy; OpenStreetMap contributors",
        }).addTo(this.map);
      }

      this.layer = await L.geoJSON(undefined);

      await this.layer.addTo(this.map);
    }
    */
    // clear if required
    if (this.geoData.type && this.geoData.type == "FeatureCollection") {
      console.log("Clear markers and polies");
      this.features = []
    }
    // copy data
    this.geoData = dt;
    // check data for points
    let hasPoints = false;
    const numFeatures = this.geoData.features.length
    for (let idx = 0; idx < this.geoData.features.length; idx++) {
      const element = await this.geoData.features[idx];
      console.log("e:",element)
      //console.log("geo type:",element.geometry.type)
      if (element.geometry.type.toLowerCase() == "point") {
        console.log("point")
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
          id:""
        }
        // we can add the popupcontent here ...
        if (element.properties.popupContent) {
          point.text = String(element.properties.popupContent)
          point.name = String(element.properties.popupContent)
        } else {
          if (element.properties.NAME) {
            point.text = String(element.properties.NAME)
            point.name = String(element.properties.NAME)
          }
        }
        // add an id
        if (element.properties.id) {
          point.id = String(element.properties.id)
        } else {
          point.id = String(idx);
        }
        this.features.push(point)
      }
      if (element.geometry.type.toLowerCase() == "polygon") {
        console.log("Poly",element)
        // Define the first polygon
        if (element.geometry.coordinates.length > 1) {
          alert("Multiploygon")
        }
        const lats: number[] = []
        const lons: number[] = []
        element.geometry.coordinates[0].forEach((c:number[]) => { 
          lats.push(c[1])
          lons.push(c[0])
        })
        let id = "0"
        if (element.properties.id !== undefined) {
          id = String(element.properties.id)
        } else {
          id = String(idx)
        }
        let name = "Polygon"
        if (element.properties.name !== undefined) {
          name = element.properties.name
        }
        const fillColor = "rgba(255, 0, 0, 0.5)"
        const polygon = {
          type: "scattermapbox",
          lat: lats,
          lon: lons,
          mode: "lines",
          fill: "toself",
          fillcolor: fillColor, // "rgba(255, 0, 0, 0.5)",
          name: name,
          text: name,
          // hover at vertices by default.
          // costom settings not working
          // hovering not working prperly ...
          //hoverinfo: 'text+name',
          //customdata: [['My Polygon', 'This is my polygon'], ['My Polygon', 'It has some text']],
          //hovertemplate: '%{customdata[0]}<br>%{customdata[1]}', // display name and text on hover
          //hovertemplate: '%{name}<br>%{text}',
          showlegend: false,
          id: id
        };
        //polygon
        this.features.push(polygon) //element.geometry.coordinates);
        //const pl = L.geoJSON(element);
        //pl.addTo(this.map);
      }
    }
    console.log("Features:",this.features)
    /*
    console.log("haspoints:", hasPoints, ", polies:", this.polies.length);
    if (hasPoints) {
      console.log("Options1:", this.layer.options);
      if (this.layer.options) {
        console.log("Modify options");
        this.layer.options.onEachFeature = PointMap.setPopups;
      } else {
        console.log("Add options");
        this.layer.options = { onEachFeature: PointMap.setPopups };
      }
      console.log("Options2:", this.layer.options);
    } else {
      //if (polies.length) {
      console.log("No points");
    }
    await this.layer.addData(this.geoData);
    const bounds = await this.layer.getBounds();
    await this.map.fitBounds(bounds);
    await this.map.invalidateSize();
    //
    */
    // Create the map

  // more markers and polygons
  const marker1 = {
    type: "scattermapbox",
    lat: [49.01],
    lon: [8.41],
    mode: "markers",
    marker: {
      size: 20,
      color: "red",
    },
    text: "More Marker 1",
    name: "More Marker 1",
    hoverinfo: "text",
    showlegend: false,
    id:"1"
  };


    const mapData: any = this.features // [marker1] // marker1, marker2, polygon1, polygon2];
    //const mapData: any = [marker1] // marker1, marker2, polygon1, polygon2];
  if (this.plot == null) {
      this.plot = await DcNode.Plotly.newPlot(divId, mapData as any, layout as any)
    } else {
      this.plot = await DcNode.Plotly.newPlot(divId, mapData as any, layout as any)
      //await this.plot.update(divId, mapData as any, layout as any)
    }

    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id);
  }

  // map functions
  // for popup: https://leafletjs.com/examples/geojson/
  static setPopups(feature: any, layer: any) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }
  // for some reasone, creating click marker function does not work here ...

  static getColor(d: number) {
    return d > 20
      ? "#800026"
      : d > 15
        ? "#BD0026"
        : d > 10
          ? "#E31A1C"
          : d > 5
            ? "#FC4E2A"
            : "FD8D3C";
  }

  // poly styling
  static polyStyle(feature: any) {
    console.log("Style");
    return {
      fillColor: PointMap.getColor(feature.properties.id),
      weight: 2,
      opacity: 0.8,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.4,
    };
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
      console.log("Empty plot")
      return ""
    }
    const png = await DcNode.Plotly.toImage(this.plot, {
      format: "png",
      width: 1280,
      height: 720,
    });
    return png
  }

}


/*
In this example, we first create a Leaflet map object and add some layers to it. We then use the L.leafletImage method to export a PNG image of the map. This method takes two parameters: the Leaflet map object, and a callback function that will be called when the image has been generated. Inside the callback function, we create an img element and set its src attribute to the PNG image that was generated by the L.leafletImage method.

The generated PNG image will be a snapshot of the current state of the Leaflet map. Note that the generated PNG image will have the same dimensions as the current size of the Leaflet map, so you may need to adjust the size of the img element to ensure that the PNG image is displayed correctly.

// Get the Leaflet map object
const map = L.map('map');

// Add some layers to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);
L.marker([51.5, -0.09]).addTo(map);

// Use the leafletImage plugin to export a PNG image of the map
L.leafletImage(map, function(err, canvas) {
  const img = document.createElement('img');
  const dimensions = map.getSize();
  img.width = dimensions.x;
  img.height = dimensions.y;
  img.src = canvas.toDataURL();
  document.body.appendChild(img);
});

*/