import { RandomGen } from '../classes/RandomGen';
import { LinePlot } from '../classes/LinePlot';
import { DataInfo } from '../classes/DataInfo';

  // instance generator
export const nodeFactory = async (id:string, type:string) => {
    switch (type) {
      case "randomgen":
        return await new RandomGen(id)
      case "datainfo":
        return await new DataInfo(id)
      case "lineplot":
        return await new LinePlot(id)
      default:
        throw (new Error("Invalid class type"))
    }
}
