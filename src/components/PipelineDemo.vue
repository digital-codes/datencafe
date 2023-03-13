  <script setup>

  import { onMounted, onUnmounted, ref, watchEffect } from 'vue';

  import * as dfd from "danfojs/dist/danfojs-base/"
  import * as io from "danfojs/dist/danfojs-base/io/browser"
  import { moment } from 'moment-timezone'


  const data = ref(null);
  const dataFrame = ref(null)
  const columns = ref([]);
  const plotRef = ref(null);

  const selectedYear = ref(null)
  const yrs = ref([])
  
  const selectedDist = ref(null)
  const districts = ref([])
  
  
  const altersUrls = [
    { label: "0-3", url: "https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/565c1c6e-a50c-46d2-8638-22896d21096f/download/altersstruktur-der-bevolkerung-unter-3-jahrige-nach-geschlecht.csv" },
    { label: "3-6", url: "https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/c74cb50a-e3c4-43bf-950f-6a01a783791b/download/altersstruktur-der-bevolkerung-3-bis-unter-6-jahrige-nach-geschlecht.csv" },
    { label: "6-15", url: "https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/593b2d5f-36bf-4f50-ac49-763ee5cadb1f/download/altersstruktur-der-bevolkerung-6-bis-unter-15-jahrige-nach-geschlecht.csv" },
    { label: "15-18", url: "https://transparenz.karlsruhe.de/dataset/cc50eb96-6c3d-4d6f-9dcd-c56c4969ff59/resource/72110d58-727f-4e04-a68d-2a907ba7d4fb/download/altersstruktur-der-bevolkerung-15-bis-unter-18-jahrige-nach-geschlecht.csv" }
  ]

  const playUrl = "https://transparenz.karlsruhe.de/dataset/5e1001f4-2cef-4a37-b6c8-16896fa74678/resource/9f1977cb-2712-437e-bebf-dd0bbb0d54dd/download/spielflachenversorgung-bespielbare-flache.csv"


  const layout = {
        title: {
          text: "Spielflächen Karlsruhe",
          x: 0,
        },
        legend: {
          bgcolor: "#fcba03",
          bordercolor: "#444",
          borderwidth: 1,
          font: { family: "Arial", size: 10, color: "#fff" },
        },
        resonsive: true,
        //width: 1000,
        yaxis: {
          title: "Values",
        },
        xaxis: {
          title: "Jahr",
        },
      };

      const config = {
        //columns: ["year", "value"], //columns to plot
        //columns: data.value.columns,
        displayModeBar: true,
        displaylogo: false,
      };


  const handleYearChange = (event) => {
    selectedYear.value = event.target.value;
    console.log(`Selected year: ${selectedYear.value}`);
    //let df = dataFrame.value.groupby(["Stadtteil","Jahr"]).getGroup([selectedDist.value,selectedYear.value])
    const df = dataFrame.value.groupby(["Jahr"]).getGroup([selectedYear.value]).setIndex({ column: "Stadtteil" })
    console.log("Year df:",df)
    df.print(5)
    //plot.value.update({ data: [df] });
    //df.loc({ columns: config.columns }).plot({target:plotRef.value}).line({ layout, config })
    const cfg = structuredClone(config)
    const lay = structuredClone(layout)
    lay.title = "By Year"
    lay.xaxis.type = 'category'
    //lay.xaxis.autorange = false
    lay.xaxis.range = districts.value
    lay.xaxis.tickmode =  'array'
    lay.xaxis.tickvals = districts.value
    lay.xaxis.ticktext = districts.value
    lay.xaxis.categoryorder = 'array'
    lay.xaxis.categoryarray = districts.value
    //lay.xaxis.categoryarray = [0,1,2,3,4]
    lay.xaxis.title = "Stadtteil"
    console.log(cfg,lay)
    df.loc({ columns: ["Personen","Ratio"] }).plot(plotRef.value).bar({ layout:lay, config:cfg })
  }

  const handleDistChange = (event) => {
    /*
    const selectedOption = event.target.value;
    console.log(`Selected dist: ${selectedOption}`);    
    */
    selectedDist.value = event.target.value;
    console.log(`Selected dist: ${selectedDist.value}`);
    //let df = dataFrame.value.groupby(["Stadtteil","Jahr"]).getGroup([selectedDist.value,selectedYear.value])
    const df = dataFrame.value.groupby(["Stadtteil"]).getGroup([selectedDist.value]).setIndex({ column: "Jahr" })
    console.log("Dist df:",df)
    df.print(5)
    //plot.value.update({ data: [df] });
    //df.loc({ columns: config.columns }).plot({target:plotRef.value}).line({ layout, config })
    const cfg = structuredClone(config)
    const lay = structuredClone(layout)
    lay.title = "By District"
    lay.xaxis.title = "Jahr"
    /*
    lay.xaxis.type = 'category'
    lay.xaxis.autorange = true
    lay.xaxis.range = yrs.value
    lay.xaxis.tickmode =  'array'
    lay.xaxis.tickvals = yrs.value
    lay.xaxis.ticktext = yrs.value
    lay.xaxis.categoryorder = 'array'
    lay.xaxis.categoryarray = yrs.value
    */
    console.log(cfg,lay)
    df.loc({ columns: ["Personen","Ratio"] }).plot(plotRef.value).line({ layout:lay, config:cfg })
  }


// alternative formatting:
// const formattedDate = date.format('YYYY-MM-DD HH:mm:ss z');
const dtParse = (d) => {
  const dateFormat = 'YYYY-MM/DD'
  const tz = "UTC" // "Europe/Berlin"
  return moment.tz(d, dateFormat, tz).toISOString()
}

// don't make appled functions async!
const  mkRatio = (x) => {
  //console.log(x,x.length)
  let r
  try {
    r = x[x.length - 1] / x[x.length - 2]
  } catch (e) {
    console.log("div error")
    r = 0
  }
  return r
}

  const testFetch = async function(url) {
  console.log("test fetch")
  const options = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: "same-origin", // include, *same-origin, omit
    /*
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    */
    redirect: "follow", // manual, *follow, error
  }
  try {
    const r = await fetch(url,options)
    console.log("Status:",r.status)
    return r.status == 200? true:false
  } catch (e) {
    console.log("Failed:",e)
    return false
  }
}


  const loadCsv = async (url) => {
    console.log("Try to load:",url)
    if (url.startsWith("http")) {
      if (await testFetch(url)) {
        console.log("CORS OK, continue")
      } else {
        console.log("CORS failed. use local file")
        const u = url.split("/")
        url = "/data/" + u[u.length-1]
        //return dfd.dataFrame()
      }
    } else {
      const u = url.split("/")
      url = "/data/" + u[u.length-1]
    }
    const csvOptions = {
    delimiter: ",",
    escapeChar:"\\",
    quoteChar:"\"",
    header:true, // header row
    preview:0, // > 0 is how many lines previews
    skipEmptyLines:true
  }
    const df = await io.readCSVBrowser(url,csvOptions)
    return df
  };

  async function loadUrls() {
  let altDf;

  for (let i = 0; i < altersUrls.length; i++) {
    if (i == 0) {
      altDf = await loadCsv(altersUrls[i].url)
      altDf.rename({ "Personen": altersUrls[i].label }, { inplace: true })
      altDf.drop({ columns: ["männlich", "weiblich"], inplace: true })
      altDf.head(5).print()
    } else {
      const t = await loadCsv(altersUrls[i].url)
      t.rename({ "Personen": altersUrls[i].label }, { inplace: true })
      t.drop({ columns: ["männlich", "weiblich"], inplace: true })
      altDf = dfd.merge(
        {
          left: altDf, right: t,
          on: ["Stadtteil", 'Jahr'], how: "inner"
        })
      altDf.head(5).print()
    }
    if (i == (altersUrls.length - 1)) {
      // all parts available
      const sums = altDf.loc({ columns: ["0-3", "3-6", "6-15", "15-18"] }).sum()
      altDf.addColumn("Personen", sums, { inplace: true })
      altDf.drop({ columns: ["0-3", "3-6", "6-15", "15-18"], inplace: true })
      //altDf.print()
      //altDf.describe().print()
      // altDf.plot()
      // load playgrounds as well
      const playDf = await loadCsv(playUrl)
      //playDf.rename({"Bespielbare Fläche":"Spielfläche"},{inplace:true})
      // put key in [] if variable ...
      playDf.rename({ [playDf.columns[2]]: "Spielfläche" }, { inplace: true })
      //playDf.print()
      altDf = dfd.merge(
        {
          left: altDf, right: playDf,
          on: ["Stadtteil", 'Jahr'], how: "inner"
        })
      altDf.head(5).print()
      const x = altDf.loc({ columns: ["Personen", "Spielfläche"] })
      const r = await x.apply(mkRatio, { axis: 1 })
      altDf.addColumn("Ratio", r, { inplace: true })
      //altDf.print()
      /*
      // group
      let gdf = altDf.groupby(["Stadtteil"])
      console.log("GDF:",gdf)
      console.log("Groups:",Object.keys(gdf.groups))
      */
      // groupby examples
      // group names
      const gs = Object.keys(altDf.groupby(["Stadtteil"]).groups)
      //console.log("Stadtteile:",gs)
      const gy = Object.keys(altDf.groupby(["Jahr"]).groups)
      //console.log("Jahre:",gy)
      // group item
      const gs1 = altDf.groupby(["Stadtteil"]).getGroup(["Oststadt"])
      gs1.print(5)
      // groupby operations
      altDf.groupby(["Stadtteil"]).col(["Personen","Ratio"]).mean().print()
      altDf.groupby(["Stadtteil"]).col(["Personen","Ratio"]).min().print()
      altDf.groupby(["Stadtteil"]).col(["Personen","Ratio"]).max().print()
      // 
      data.value = altDf.values;
      columns.value = altDf.columns;
      dataFrame.value = altDf
      //
      config.columns = ["Personen","Ratio"];
      const y = Object.keys(altDf.groupby(["Jahr"]).groups)
      yrs.value = y
      selectedYear.value = y[0]
      const d = Object.keys(altDf.groupby(["Stadtteil"]).groups)
      districts.value = d
      selectedDist.value = d[0]
      await altDf.loc({ columns: config.columns }).plot(plotRef.value).line({ layout, config })
    }
  }
}

  onMounted(async () => {
    await loadUrls()
  })


  </script>

<style scoped>
.container {
  max-height: 400px;
  overflow:scroll;
  margin: 1rem;
  border: 1px solid blue;  
}
.plot {
     width: 100%;
     height: 400px;
  }

</style>

<template>
  <p>
    Wir laden 4 Files mit Alterstruktur und die Spielflächen vom Transparenzportal KA
    Die Files werden kombiniert und eine Spalte "Spielfläche/Person" hinzugefügt 
  </p>
    <div class="container">
    <table v-if="data">
      <thead>
        <tr>
          <th v-for="(col,idx) in columns" :key="idx">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row,ridx) in data"  :key="ridx">
          <td v-for="(col,cidx) in columns" :key="cidx">{{ row[cidx] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
  <label for="year-select">Jahr wählen:</label>
  <select id="year-select" v-model="selectedYear" @change="handleYearChange">
    <option v-for="(y,idx) in yrs" :key="idx" :value="y">{{ y }}</option>
  </select>
  <p>Jahr: {{ selectedYear }}</p>
  </div>
  <div>
  <label for="dist-select">Stadtteil wählen:</label>
  <select id="dist-select" v-model="selectedDist"  @change="handleDistChange">
    <option v-for="(d,idx) in districts" :key="idx" :value="y">{{ d }}</option>
  </select>
  <p>Stadtteil: {{ selectedDist }}</p>
  </div>
  <div ref="plotRef" class="plot"></div>
</template>

