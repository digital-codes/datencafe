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


export enum NodeSpec {
  CHART = "chart",
  TABLE = "table",
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

