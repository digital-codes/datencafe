# Daten.Cafe

Simple *No-Code* Browser-based Data Processing and Visualisation Tool

Daten.Cafe draws heavily from other low/no-code open-source tools, in particular [Knime](https://www.knime.com/) and [Orange3](https://orangedatamining.com/). We adopted most of the element icon from Orange3. However, Daten.Cafe doesn't aim to be a full-blown data-processing plattform. 

The goal of Daten.Cafe is to provide a (more or less) intuitive way to learn fundamental features of data, data processing and data visualization, thus enhancing data-literacy skills of everybody.

Protoype running at [Daten.Cafe](https://daten.cafe)

Instruction page should get you started. There is one example data-story available. Note: actions on nodes are started with a LONG click. 
Works on mobile too but less fun. You need to toggle between flow and charts with, yellow button. 

Daten.Cafe aims to provide basic knowledge in data literacy in a simple way. Free access to the application and sharable results are essential concepts. The application is not mobile-first, but at least mobile-compatible, allowing learning and practicing of concepts on (modern) smartphones. 

Visit the prototye to get more information on idea and current implementation status.


## Framework and Libraries

Framework is [Ionic](https://ionicframework.com/docs) version 6 with [Vue](https://vuejs.org/) version 3. Upgrade to Ionic v/ requires Typescript migration on several files. Initial tests promising but not complete yet,

Flow editor is [cytoscape](https://js.cytoscape.org/). Potential lightweight alternative  [vue-flow](https://vueflow.dev/). Custom/simple solution should be possible, we don't need much magic here.

Data processing library is [Danfo.js](https://danfo.jsdata.org/) providing "Pandas"-like dataframes. Some Tensor functions available as well, not tested yet.

Orange3 [widget symbols](https://orangedatamining.com/widget-catalog/) are used when possible.


### Data Processing 

#### Node Types

To date (April 2023, tag 0.3x), the following elements are considered to be implmented. Only a (small but usefull) subset is available yet.

  * Data Access
    * Load from Server
    * Load local
    * Start download via link (cord workaround) 
    * Save local

  * Single Item Operations
    * Statistics (Describe)
    * Select Columns
      * Rename option
    * Filter Rows
      * By Feature(s)
      * By Group
    * Reindex
    * To Timeseries
    * Resample
    * Simple Math Operations
      * Scale
      * Offset
      * Fill-NA (Impute)

  * Dual Item Operations
    * Join on Index
    * Join on Feature
    * Math Operations
      * Add/Sub
      * Multiply
      * Divide (Ratio)
    * Correlation

  * Geo Ops
    * Extract properties from features
    * Create properties from features => color for Chropleth maps

  * Utilities
    * Load flow
    * Save flow
    * Export flow (png, pdf)

  * Visualizations
    * Distribution /Histogramm 
    * Table
    * Line chart
    * Bar chart
    * GeoMap
      * Points
      * Choropleth



#### Edge Types

Probaly only DataFrames and scalars. 

### Viz

Danfo has built-in plotting for dataframes using {Plotly](https://plotly.com/javascript/)

Maps will probably use [Leaflet](https://leafletjs.com/)

Migration to [Apache Echarts](https://echarts.apache.org/en/index.html) to be considered. Might be more lightweight and flexible 


### Icons

Basics: free [fontawesome](https://fontawesome.com/icons) icon set

Individual SVGs and SVG-SPrites from [here](https://fontawesome.com/download)

If PNG icons needs, convert SVG like so (note: inkscape export is -e ?):

> for i in *.svg; do inkscape -w 256 -h 256 $i -e `basename $i .svg`.png ; done
> for i in *.svg; do inkscape -w 256 -h 256 $i --export-type=png `basename $i .svg`.png ; done

Add border to icons like so

> for i in *.png; do convert \$i -bordercolor transparent -compose over  -border 16 ../icons-bordered/$i; done

Note: remove the slash in front of \$ ...


## Development


### Get started

 1. Download repo
 2. Install
 > npm i
 3. Run dev server
 > npm run serve
 4. Open Browser at http://localhost:8080/ 



