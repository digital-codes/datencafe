<template>
    <div>
      <div>
        <input type="file" @change="onFileChange">
      </div>
      <div ref="theMap" class="map"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  // fix missing marker icon on build
  import { icon, Marker } from 'leaflet';
  const iconRetinaUrl = 'img/geo/marker-icon-2x.png';
  const iconUrl = 'img/geo/marker-icon.png';
  const shadowUrl = 'img/geo/marker-shadow.png';
  const iconDefault = icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
  Marker.prototype.options.icon = iconDefault;



  const map = ref(null);
  const layer = ref(null);

  const geoData = ref({})

  const theMap = ref(null)
  
  // for popup: https://leafletjs.com/examples/geojson/
  function setPopus(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
  }

  function clickMarker(event) {
    console.log("marker click id:", event.target.feature.properties.id)
  }

// Define a function to create markers with a click event listener
function createMarker(feature, latlng) {
  const marker = L.marker(latlng);
  marker.on('click', clickMarker);
  return marker;
}  

function getColor(d) {
    return d > 20 ? '#800026' :
           d > 15  ? '#BD0026' :
           d > 10  ? '#E31A1C' :
           d > 5  ? '#FC4E2A' : "FD8D3C";
}

// poly styling
function polyStyle(feature) {
  console.log("Style")
  return { fillColor: getColor(feature.properties.id),
        weight: 2,
        opacity: .8,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.4
  }
}

  //const onFileChange = (event) => {
    async function onFileChange(event) {
    console.log("Geofile",event)
    if (geoData.value.type && geoData.value.type == "FeatureCollection") {
      console.log("Clear layer")
      await layer.value.clearLayers()
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const text = reader.result;
      geoData.value = JSON.parse(text);
      //console.log("Geojson:",geoData.value)
      if (!geoData.value.features) {
        alert("Not a valid GeoJson file")
        geoData.value = {}
        return
      }
      let hasPoints = false
      const polies = []
      geoData.value.features.forEach((element,idx) => {
        //console.log("e:",element)
        //console.log("geo type:",element.geometry.type)
        if (element.geometry.type.toLowerCase() == "point") {
          hasPoints = true
          // we can add the popupcontent here ...
          if (element.properties.popupContent) {
            element.properties.popupContent = String(element.properties.popupContent)
          } else {
            if (element.properties.NAME) 
              element.properties.popupContent = element.properties.NAME
          }
          // add an id
          if (!element.properties.id) {
            element.properties.id = idx
          }
        }
        if (element.geometry.type.toLowerCase() == "polygon") {
          //console.log("Poly",element)
          polies.push(element.geometry.coordinates)
          //const pl = L.geoJSON(element);
          //pl.addTo(map.value);
      }
      });
      console.log("haspoints:",hasPoints,", polies:",polies.length)
      if (hasPoints) {
        console.log("Options1:",layer.value.options)
        if (layer.value.options) {
          console.log("Modify options")
          layer.value.options.onEachFeature = setPopus
        } else {
          console.log("Add options")
          layer.value.options = {onEachFeature:setPopus}
        }
        console.log("Options2:",layer.value.options)
        await layer.value.addData(geoData.value)
        await map.value.fitBounds(await layer.value.getBounds());
      } else {
      //if (polies.length) {
        console.log("No points")
        await layer.value.addData(geoData.value)
        await map.value.fitBounds(await layer.value.getBounds());
      }
      await map.value.invalidateSize();
    }
    await reader.readAsText(file);
  }
  
  onMounted(() => {
    map.value = L.map(theMap.value);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; OpenStreetMap contributors',
    }).addTo(map.value);
    // add create marker function 
    layer.value = L.geoJSON(null,{pointToLayer: createMarker, style:polyStyle})
    layer.value.addTo(map.value);

});


</script>

<style scoped>

.map {
  height: 300px;
  width: 100%;
}
</style>

<script>
/*
// Define the GeoJSON polygon in EPSG:25832 coordinates
var polygonCoords = [[x1, y1], [x2, y2], [x3, y3], ...];

// Create a Leaflet map
var map = L.map('map');

// Set the map center and zoom level
map.setView([lat, lng], zoom);

// Define the EPSG:25832 CRS
var crs = new L.Proj.CRS(
  'EPSG:25832',
  '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs',
  {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
    origin: [0, 0],
    bounds: L.bounds([0, 0], [8192, 8192])
  }
);

// Set the map CRS to EPSG:25832
map.options.crs = crs;

// Create a Leaflet polygon layer from the GeoJSON polygon
var polygonLayer = L.geoJSON({ type: 'Polygon', coordinates: [polygonCoords] });

// Add the polygon layer to the map
polygonLayer.addTo(map);

// Convert the polygon coordinates to WGS84 (latitude and longitude)
var wgs84Coords = polygonCoords.map(function(coord) {
  var point = L.point(coord[0], coord[1]);
  return map.unproject(point);
});

// Create a new GeoJSON polygon with WGS84 coordinates
var wgs84Polygon = { type: 'Polygon', coordinates: [wgs84Coords] };

// Create a Leaflet polygon layer from the WGS84 polygon
var wgs84PolygonLayer = L.geoJSON(wgs84Polygon);

// Add the WGS84 polygon layer to the map
wgs84PolygonLayer.addTo(map);


*/
</script>

