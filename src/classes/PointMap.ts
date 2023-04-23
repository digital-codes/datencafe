// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { SigPort } from "./DcNode";
import { NodeSpec } from "@/services/GlobalDefs";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// user store
import { UserStore } from "@/services/UserStore";
const userStore = UserStore();


// fix missing marker icon on build
import { icon, Marker } from "leaflet";
const iconRetinaUrl = "img/geo/marker-icon-2x.png";
const iconUrl = "img/geo/marker-icon.png";
const shadowUrl = "img/geo/marker-shadow.png";
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
Marker.prototype.options.icon = iconDefault;

export class PointMap extends DcNode {
  // properties
  static _display = true;
  static _type = NodeSpec.CHART;
  private updCnt = 0;
  private map: any = null;
  private layer: any = null;
  private geoData: any = {};
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
    // clear if required
    if (this.geoData.type && this.geoData.type == "FeatureCollection") {
      console.log("Clear layer");
      await this.layer.clearLayers();
    }
    // copy data
    this.geoData = dt;
    // check data for points
    let hasPoints = false;
    const polies = [];
    for (let idx = 0; idx < this.geoData.features.length; idx++) {
      const element = await this.geoData.features[idx];
      //console.log("e:",element)
      //console.log("geo type:",element.geometry.type)
      if (element.geometry.type.toLowerCase() == "point") {
        hasPoints = true;
        // we can add the popupcontent here ...
        if (element.properties.popupContent) {
          element.properties.popupContent = String(
            element.properties.popupContent
          );
        } else {
          if (element.properties.NAME)
            element.properties.popupContent = element.properties.NAME;
        }
        // add an id
        if (!element.properties.id) {
          element.properties.id = idx;
        }
      }
      if (element.geometry.type.toLowerCase() == "polygon") {
        //console.log("Poly",element)
        polies.push(element.geometry.coordinates);
        //const pl = L.geoJSON(element);
        //pl.addTo(this.map);
      }
    }
    console.log("haspoints:", hasPoints, ", polies:", polies.length);
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