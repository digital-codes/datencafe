// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { DataFrame, toJSON } from "danfojs/dist/danfojs-browser/src";
import { NodeSpec } from "@/services/GlobalDefs";
import { StorageTypes } from "@/services/GlobalDefs";

import { readJSONBrowser } from "danfojs/dist/danfojs-base/io/browser";
import { JsonInputOptionsBrowser } from "danfojs/dist/danfojs-base/shared/types";
import testFetch from "@/services/TestFetch";

import proj4 from 'proj4'
// EPSG is frequently used in Germany
const EPSG25832 = '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs';
// EPSG4326 is WGS84, default for Leaflet
const EPSG4326 = '+proj=longlat +datum=WGS84 +no_defs';
// Example coordinates in EPSG:25832
// const coordinates = [500000, 5700000];
// Perform the transformation
// const transformedCoordinates = proj4(EPSG25832, EPSG4326, coordinates);


export class LoadGeo extends DcNode {
  // properties
  static _display = false;
  static _type = NodeSpec.INPUT;
  private df = new DataFrame();
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
          id: "url",
          type: "url",
          label: "URL",
          value: "",
        },
        {
          id: "license",
          type: "text",
          label: "License",
          value: ""
        },
        {
          id: "attribution",
          type: "text",
          label: "Attrib.",
          value: ""
        }
      ],
    };
    super(id, "loadgeo", ports, edges, cfg as any);
    DcNode.print(LoadGeo._type + " created"); // no access to super._id etc here
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
      await this.load(options[0]);
    }
    // check license and attribution
    // get old meta
    // without url, id has not been added yet ...
    const exists = await DcNode.providers.exists(this.id)
    if (!exists) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true); // file loaders are root nodes
    }
    const meta = await DcNode.providers.getMeta(this.id)
    for (const m of ["url","license","attribution"]) {
      const idx = this.config.options.findIndex((o: any) => o.id == m)
      const val = this.config.options[idx].value
      if (val != "") {
        meta[m] = val // set meta
      }
    }
    await DcNode.providers.setMeta(this.id,meta)

  }
  async load(url: string) {
    DcNode.print("Load on " + String(super.name));
    if (url === undefined) throw new Error("Invalid URL");
    if (!url.includes("http")) {
      // local urls supported ... detect full host address with port number ...
      url = window.location.href.split(window.location.pathname)[0] + url;
    }
    const fetchResult = await DcNode.fetchFile(url, "json")
    if (!fetchResult.success) {
      alert("URL cannot be loaded directly. Log in or load locally");
      await super.messaging.emit(DcNode.signals.URLOADPREFIX, url)
      return;
    }
    await this.saveContent(fetchResult.data)
  }
  // overwrite upload function
  async upload(files: any) {
    if (files.length < 1) {
      throw new Error("Invalid upload");
    }
    const name = files[0].name;
    if (!(name.endsWith(".json") || name.endsWith(".geojson"))) {
      alert("Not a JSON/GeoJSON file?");
      return;
    }
    const reader = new FileReader();
    const content  = await new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;

      reader.readAsText(files[0]);
    });

    const json = JSON.parse(content as string)
    await this.saveContent(json)
  }
  // save the stuff, if geojson
  async saveContent (data:any) {
    if (!(Object.keys(data).includes("type")) && (data.type.toLowerCase() == "FeatureCollection".toLowerCase())) {
      alert("No Geo Feature Collection");
      return;
    }
    if (!(await DcNode.providers.exists(this.id))) {
      // create item in pubstore if not exists
      await DcNode.providers.add(this.id, true); // file loaders are root nodes
    }
    // Check number of features and truncate to first 50
    const features = data.features;
    if (features.length > 50) {
      data.features = features.slice(0, 50);
      alert("Only first 50 features are loaded.");
    }
    // check crs: if not WGS84, transform to WGS84
    const crs = data.crs
    if (crs && crs.properties) {
      const crsName = crs.properties.name
      console.log("CRS:",crsName,crs)
      if (crsName && crsName.toLowerCase().includes("epsg") && crsName.includes("25832")) {
        console.log("Transforming from", crsName);
        
        for (const f of features) {
          //console.log("Feature",f)
          const geom = f.geometry;

          if (geom.type.toLowerCase() == "point") {
            const coords = geom.coordinates;
            const transformed = await proj4(EPSG25832, EPSG4326, coords);
            geom.coordinates = transformed;
          }
          if (geom.type.toLowerCase() == "linestring") {
            const coords = geom.coordinates;
            for (let i = 0; i < coords.length; i++) {
              const transformed = await proj4(EPSG25832, EPSG4326, coords[i]);
              coords[i] = transformed;
            }
          }
          if (geom.type.toLowerCase() == "polygon") {
            const coords = geom.coordinates;
            for (let j = 0; j < coords.length; j++) {
              for (let i = 0; i < coords[j].length; i++) {
                const transformed = await proj4(EPSG25832, EPSG4326, coords[j][i]);
                coords[j][i] = transformed;
              }
            }
          }
        }
      }
    }    
    //await DcNode.providers.update(super.id, JSON.stringify(data));
    const meta = await DcNode.providers.getMeta(this.id)
    const dt = await new Date().toISOString()
    meta.date = dt
    // set storage type of this class
    meta.storagetype = StorageTypes.FEATURESET
    await DcNode.providers.update(this.id, data,meta);
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
    await super.messaging.emit((DcNode.signals.UPDPREFIX as string) + super.id);

  }

  // getters
  get type() {
    return LoadGeo._type;
  }
  get display() {
    return LoadGeo._display;
  }
}
