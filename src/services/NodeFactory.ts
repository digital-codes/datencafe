// create nodes

import { RandomGen } from "@/classes/RandomGen";
import { LinePlot } from "@/classes/LinePlot";
import { DataInfo } from "@/classes/DataInfo";
import { BarPlot } from "@/classes/BarPlot";
import { TablePlot } from "@/classes/TablePlot";
import { ScatterPlot } from "@/classes/ScatterPlot";
import { HistoPlot } from "@/classes/HistoPlot";
import { LoadExcel } from "@/classes/LoadExcel";
import { LoadCsv } from "@/classes/LoadCsv";
import { LoadJson } from "@/classes/LoadJson";
import { LoadGeo } from "@/classes/LoadGeo";
import { SelCell } from "@/classes/SelCell";
import { SelCols } from "@/classes/SelCols";
import { SelRows } from "@/classes/SelRows";
import { JoinData } from "@/classes/JoinData";
import { ScalarMath } from "@/classes/ScalarMath";
import { AddRows } from "@/classes/AddRows";
import { AddCols } from "@/classes/AddCols";
import { PointMap } from "@/classes/PointMap";

// instance generator
export const nodeFactory = async (id: string, type: any) => {
  switch (type.name) {
    case "randomgen":
      return await new RandomGen(id, type);
    case "datainfo":
      return await new DataInfo(id, type);
    case "lineplot":
      return await new LinePlot(id, type);
    case "barplot":
      return await new BarPlot(id, type);
    case "tableplot":
      return await new TablePlot(id, type);
    case "scatterplot":
      return await new ScatterPlot(id, type);
    case "histoplot":
      return await new HistoPlot(id, type);
    case "pointmap":
      return await new PointMap(id, type);
    case "addrows":
      return await new AddRows(id, type);
    case "addcols":
      return await new AddCols(id, type);
    case "selcell":
      return await new SelCell(id, type);
    case "selcols":
      return await new SelCols(id, type);
    case "selrows":
      return await new SelRows(id, type);
    case "scalarmath":
      return await new ScalarMath(id, type);
    case "loadcsv":
      return await new LoadCsv(id, type);
    case "loadjson":
      return await new LoadJson(id, type);
    case "loadgeo":
      return await new LoadGeo(id, type);
    case "loadexcel":
      return await new LoadExcel(id, type);

    /*
case "scatter":
return await new LinePlot(id)
case "treemap":
return await new LinePlot(id)
case "histo":
return await new LinePlot(id)
case "geomap":
return await new LinePlot(id)
case "choromap":
return await new LinePlot(id)
case "join":
return await new LinePlot(id)
case "dfmath":
return await new LinePlot(id)
case "save":
return await new LinePlot(id)
case "pool":
return await new LinePlot(id)
*/
    default:
      throw new Error("Invalid class type: " + String(type.name));
  }
};
