// gloabl definitions of types, const, enums
export const Version = "0.5"

export enum PreFixes {
  PLOTPREFIX = "DFPLOT-",
  LSTOKPREFIX = "DCTOK",
  LSKEYPREFIX = "DCKEY",
  LSLOCPREFIX = "DCLOC",

}

export enum Signals {
  UPDPREFIX = "UPD-",
  URLOADPREFIX = "IFRAME",
  RESIZE = "RESIZE",
  NODEANIMATE = "NODEANIMATE",
  TRIGGERSTORY = "TRIGGERSTORY",

}

export enum StorageTypes {
  DATAFRAME = "dataframe", // default
  FEATURESET = "featureset", // maps
  JSON = "json", // some raw json, not table-like
  TENSOR = "tensor",
  IMAGE = "image", // img source, b64
}

export enum NodeSpec {
  CHART = "chart",
  TABLE = "table",
  MAP = "map",
  LEAFLET = "leaflet",
  PROC = "proc",
  GEN = "gen",
  INPUT = "input",
  OUTPUT = "output"
}


export enum FlowSpec {
  ZOOM = 1,
  MINZOOM = .5,
  MAXZOOM = 10,
  SHEIGHT = .65,
  LHEIGHT = .75
}

