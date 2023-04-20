
const fs = require('fs');

// Define the number of clusters (k)
const k = 3;

// Generate some random data points
const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    x: Math.random() * 100,
    y: Math.random() * 100
  });
}

fs.writeFileSync('input.json', JSON.stringify(data));

// alternatively
// Read the data from a JSON file
// const inputData = JSON.parse(fs.readFileSync('data.json'));

// Define a function to calculate the distance between two points
function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Define a function to assign each data point to a cluster
function assignClusters(data, centroids) {
  const clusters = new Array(k);
  for (let i = 0; i < k; i++) {
    clusters[i] = [];
  }
  for (let i = 0; i < data.length; i++) {
    let closestCentroidIndex = 0;
    let closestDistance = Infinity;
    for (let j = 0; j < k; j++) {
      const d = distance(data[i], centroids[j]);
      if (d < closestDistance) {
        closestCentroidIndex = j;
        closestDistance = d;
      }
    }
    clusters[closestCentroidIndex].push(data[i]);
  }
  return clusters;
}

// Define a function to calculate the mean of a set of points
function mean(points) {
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < points.length; i++) {
    sumX += points[i].x;
    sumY += points[i].y;
  }
  const meanX = sumX / points.length;
  const meanY = sumY / points.length;
  return {
    x: meanX,
    y: meanY
  };
}

// Define a function to update the centroids of each cluster
function updateCentroids(clusters) {
  const centroids = new Array(k);
  for (let i = 0; i < k; i++) {
    centroids[i] = mean(clusters[i]);
  }
  return centroids;
}

// Define the initial centroids as random points
let centroids = [];
for (let i = 0; i < k; i++) {
  centroids.push(data[Math.floor(Math.random() * data.length)]);
}
// Write the initial centroids to a file
fs.writeFileSync('centroids-initial.json', JSON.stringify(centroids));

// Iterate until convergence
let clusters = [];
for (let i = 0; i < 10; i++) {
  clusters = assignClusters(data, centroids);
  centroids = updateCentroids(clusters);
  fs.appendFileSync('clusters-intermediate.json', JSON.stringify(clusters));
}

// Log the clusters
console.log(clusters);


fs.writeFileSync('clusters.json', JSON.stringify(clusters));



