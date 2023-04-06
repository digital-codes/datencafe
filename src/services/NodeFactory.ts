import { RandomGen } from '../classes/RandomGen';
import { LinePlot } from '../classes/LinePlot';
import { DataInfo } from '../classes/DataInfo';
import { BarPlot } from '../classes/BarPlot';
import { TablePlot } from '../classes/TablePlot';
import { CsvLoader } from '../classes/CsvLoader';
import { SelCols } from '../classes/SelCols';
import { SelRows } from '../classes/SelRows';
import { JoinData } from '../classes/JoinData';
import { ScalarMath } from '../classes/ScalarMath';
import { AddRows } from '../classes/AddRows';
import { AddCols } from '../classes/AddCols';

// instance generator
export const nodeFactory = async (id: string, type: string) => {
  switch (type) {
    case "randomgen":
      return await new RandomGen(id)
    case "datainfo":
      return await new DataInfo(id)
    case "lineplot":
      return await new LinePlot(id)
    case "barplot":
      return await new BarPlot(id)
    case "tableplot":
      return await new TablePlot(id)
    case "addrows":
      return await new AddRows(id)
    case "addcols":
      return await new AddCols(id)
    case "selcols":
      return await new SelCols(id)
    case "selrows":
      return await new SelRows(id)
    case "scalarmath":
      return await new ScalarMath(id)
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
      throw (new Error("Invalid class type"))
  }
}
