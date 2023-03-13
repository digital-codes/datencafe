# Datencafe
Simple Data Processing and Visualisation Tool

## App
### Infos


### Instructions



### Map



### DataFlow


#### Node Types

  * Data Access
    * Load from Server
    * Load local
    * Start download via Iframe
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

  * Geo Ops
    * Extract properties from features
    * Create properties from features

  * Utilities
    * Load flow
    * Save flow
    * Export flow (png, pdf)

  * Visualizations
    * Preview table
    * Table
    * Line chart
    * Bar chart
    * GeoMap
      * Points
      * Choropleth



#### Edge Types

  * Results
  * Copy (only on single input nodes)



### Viz



## Development
### Get started

 1. Download repo
 2. Install
 > npm i
 3. Run dev server
 > npm run serve
 4. Open Browser at http://localhost:8080/ 


 

### Framework and Libraries
 * Web
   * [Ionic](https://ionicframework.com/docs) 
   * [Vue3](https://vuejs.org/)
   * [cytoscape]()
 * Tooling
   * [danfojs]()
   * [axios]
 * ... and others ...


### Icons

Potenitially useful fontawesome icons

 * database, server, file, file-export, files, file-import, file-check, file-exclamation,
 * file-arrow-up, file-arrow-down, file-slash, file-xmark, gear, gears, sliders, wrench, hammer, 
 * bars, sliders-up, list-check, toolbox, map, file-circle-question, file-circle-minus, file-circle-check,
 * file-circle-xmark, chart-pie, puzzle-piece, paper-plane, bong, hand, 
 * chart-simple, chart-pie, chart-line, chart-columns, chart-bar, diagram-project, comment, message,
 * table, table-cells, file-csv, stapler, square-root-variable, image, star, github, arrow-up,
 * check, circle-check, pin, pencil, plus, minus, arrows-rotate, trash-can, link, wand-magic-sparkles,
 * object-group, code-commit, download, upload, arrow-up/down, chevron-up/down,
 * magnifying-glass, magnifying-glass-plus, magnifying-glass-minus, expand, panorama,
 * eye, glasses, folder-open, play, copy, square, question, info,
 * 

Individual SVGs and SVG-SPrites from [here](https://fontawesome.com/download)

If PNG icons needs, convert SVG like so:

> for i in *.svg; do inkscape -w 256 $i -o `basename $i .svg`.png ; done

or 

> for i in *.svg; do inkscape -w 256 -h 256 $i -o `basename $i .svg`.png ; done

Latter scales to w and h

Add border to icons like so

> for i in *.png; do convert \$i -bordercolor transparent -compose over  -border 16 ../icons-bordered/$i; done

