// csv node class, extends DcNode

import { DcNode } from "./DcNode";
import { SigPort } from "./DcNode";
import { DataSpecs } from "./DcNode";
import { NodeSpec } from "@/services/GlobalDefs";
import { DelayTimer } from "@/services/DelayTimer"
import { StorageTypes } from "@/services/GlobalDefs";

export class GrpItems extends DcNode {
  // properties
  private updCnt = 0;
  static _display = false;
  static _type = NodeSpec.PROC
  private plot: any = null;
  // constructor
  constructor(id: string, typeInfo: any) {
    // although we need to call this first,
    // the super elements will be initialized later
    // access to super properties in the derived constructor
    // may result in "undefined" ...
    const ports: string[] = ["A"];
    const edges: string[] = ["d"];
    super(id, "grpitems", ports, edges);
    DcNode.print(GrpItems._type + " created"); // no access to super._id etc here
    // add to providers
    DcNode.providers.add(this.id)
  }
  // getters/setters
  get type() {
    return GrpItems._type;
  }
  get display() {
    return GrpItems._display;
  }
  // methods
  // --------------------------------------------------
  async configure(optionString: string) {
    // we know the config structure here, so can just use the index
    const options = JSON.parse(optionString);
    for (let i = 0; i < this.config.options.length; i++) {
      this.config.options[i].current = options[i];
      DcNode.print("Set option:" + options[i]);
    }
    if (this.signals.length < 1) {
      return;
    }
    // just use first signal to trigger an update
    const src = this.signals[0].signal.split("-")[1];
    DcNode.print("Updating from:" + src);
    await this.updated(this.signals[0].signal)
  }
  // --------------------------------------------------
  async updated(msg: string, y?: any) {
    this.updCnt++;
    DcNode.print("Update for " + msg + ", " + this.id + "," + JSON.stringify(this.signals))
    // check ports
    if (this.signals.length < 1) {
      DcNode.print("Update. Too few sources for " + this.id)
      this.config.options = []
      return
    }

    const src = msg.split("-")[1];
    const dt = await DcNode.providers.getDataById(src);
    const df = await new DcNode.dfd.DataFrame(dt);
    const cols = df.columns;
    const oldSpecs = this.specs;
    const specs: DataSpecs[] = [
      {
        port: "A",
        columns: cols,
        types: df.ctypes.values as string[],
      },
    ];
    if (oldSpecs.length == 0 || this.specsChanged(specs)) {
      this.specs = specs;
      // -------
      // set config from columns
      const config = this.config;
      config.pop = "mixed";
      config.options = [
        {
          id: "group",
          type: "string",
          label: "Select Group",
          select: true,
          value: cols,
          current: cols[0]
        }
      ]
      this.config = config;
      // we're done
      DcNode.print("New config. cancel update")
      return
    }

    // get grouping column
    const groupBy = this.config.options[0].current
    const gp = df.groupby([groupBy])
    const groups = []
    for (const g of Object.keys(gp.groups)) groups.push([g])
    const newDf = new DcNode.dfd.DataFrame(groups,{columns:[groupBy]})
    // put data into store then send message
    const meta = await DcNode.providers.getMeta(this.id)
    meta.storagetype = StorageTypes.DATAFRAME
    await DcNode.providers.update(this.id, DcNode.dfd.toJSON(newDf), meta)
    await DelayTimer(20)
    await this.messaging.emit(DcNode.signals.NODEANIMATE, this.id)
    await this.messaging.emit(DcNode.signals.UPDPREFIX as string + this.id)

  }
  // ------------
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
  async getImage() {
    if (this.plot == null) {
      DcNode.print("Empty plot");
      return "";
    }
    const png = await DcNode.Plotly.toImage(this.plot, {
      format: "png",
      width: 1280,
      height: 720 * 1,
    });
    return png;
  }
}


/*
refresh maybe like so
setTimeout(() => {
  // Update layout
  const newLayout = {
    title: 'Updated Plot'
  };

  // Update plot layout
  Plotly.update('plot', {}, newLayout);
}, 5000);

or // Update plot with new data and layout
  Plotly.react('plot', newData, newLayout);
}, 5000);


*/
