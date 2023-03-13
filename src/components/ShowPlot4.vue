<template>
    <div ref="plotRef" class="plot"></div>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
  //  import { DataFrame } from 'danfojs-node';
  import * as dfd from 'danfojs/dist/danfojs-browser/src';
  import * as io from "danfojs/dist/danfojs-base/io/browser"
  
  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
  
  const plotData = ref({})
  /*
  const margin = {top: 20, right: 20, bottom: 30, left: 50};
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  */
  const plotRef = ref(null);

    watchEffect(() => {
    if (props.data && plotRef.value) {
      console.log("plot data1:", props.data)
      buildPlot()
    }
  });

  onMounted(() => {
    if (props.data) {
      console.log("plot data2:", props.data)
      buildPlot()
    }
  })

  function buildPlot() {
      //plotData.value = props.data.to_json({orient: "records"});
      const drp = []
      props.data.columns.forEach((col,idx) => {
        console.log("col:",col,props.data.dtypes[idx])
        const tp = props.data.dtypes[idx]
        if ((tp != "int32") && (tp != "float32")) {
          drp.push(col)
        }
      });
      console.log("Dropping:",drp)
      props.data.drop({ columns: drp, inplace: true });
      console.log("Final plot data:",props.data)

      const layout = {
        title: {
          text: "Time series plot of AAPL open and close points",
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
          title: "AAPL open points",
        },
        xaxis: {
          title: "Date",
        },
      };

      const config = {
        //columns: ["year", "value"], //columns to plot
        columns: props.data.columns,
        displayModeBar: true,
        displaylogo: false,
      };

      // line, bar and scatter work
      //props.data.plot(plotRef.value).line({ layout, config })
      //props.data.plot(plotRef.value).bar({ layout, config })
      //props.data.plot(plotRef.value).scatter({ layout, config })
      props.data.plot(plotRef.value).line({ layout, config })

    }



  /**
In this component, the data prop is a reactive Danfo.js dataframe, 
which is passed in as a prop to the component. The onMounted lifecycle 
hook is used to initialize the D3 line plot when the component is mounted,
 and the onUnmounted lifecycle hook is used to clean up the plot when the 
 component is unmounted. The D3 line plot is rendered as an SVG element 
 in the plotRef div element using the D3 line() and scaleLinear() functions.

Note that this is just a basic example and there are many ways to 
customize and improve the plot based on your specific use case.
   */

  </script>
  
  <style scoped>

  .plot {
     width: 100%;
     height: 400px;
  }

  </style>