import "./style.css";

//import * as dfd from 'danfojs/dist/danfojs-browser/src';
import * as dfd from "danfojs/dist/danfojs-browser/src";

import Plotly from "plotly.js-dist-min"; // v2.8
//import Plotly from "plotly.js-dist"; // v2.22

import * as tf from "@tensorflow/tfjs";


console.log(Plotly.version);
console.log(tf.version);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div style="overflow:clip;">
  <div style="display:block;">
  <canvas class="chart" id="cv" "></canvas>
  </div>
  <div style="display:block;">
  <canvas class="chart" id="cvw" "></canvas>
  </div>

  </div>
`;

const imgClasses = 3;
const imgSize = 64;
const numImgs = 256;

const labelNames = ["Tringle","Ellipse","Rectangle"]

//await imgGen();

await tfTest();

async function tfTest() {
  const model = await setupModel();
  console.log("Model ready");

  model.summary();

  let errors = 0
  let numTests = 100
  for (let i = 0; i<numTests;i++){
    const evalImg = await mkSingleImg();
    console.log("Eavl img rdy");
  
    // Convert the input image to a TensorFlow tensor
    const inputTensor = (await evalImg).image.reshape([1, imgSize, imgSize, 1]);
    // Run the model on the input tensor
    const outputTensor = await model.predict(inputTensor);
  
    // Convert the output tensor to a JavaScript array
    const outputArray = await outputTensor.dataSync();
  
    // Get the predicted class index
    const predictedIndex = outputArray.indexOf(Math.max(...outputArray));
    if (predictedIndex != evalImg.label) {
      console.log("Error")
      errors++
    }
    console.log("Expected:",evalImg.label)
    console.log(`The predicted class index is ${predictedIndex} - ${labelNames[predictedIndex]}.`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  console.log("Totoal errors:",errors," -> ", errors/numTests * 100 ,"%")
  alert("Error rate: " + String(errors/numTests * 100)  + "%")
}

async function setupModel() {
  // -------------------------------
  /*
  // option
  // Define the precision to reduce to
  const precision = "int8";
  // Quantize the weights of the model to 8-bit precision
  const quantizedModel = await tf.quantize(model, {
    weightsPrecision: precision,
  });

  // Print the summary of the quantized model
  quantizedModel.summary();
  const quant = false;
  let model = model;
  if (quant) model = quantizedModel;
  */
  // -------------------------------

  // Load the training data (X_train and y_train)

  const numClasses = imgClasses;

  const data = await imgGen();
  //console.log("lbl",data.labels)
  //console.log("img",data.images)
  console.log("Data loaded");

  // Assume that you have two arrays: images (an array of TensorFlow images) and labels (an array of integers representing the labels)

  // Define the training and test split ratios
  const trainRatio = 0.8; // 80% of the data will be used for training

  /*
  // Shuffle the data randomly using the Fisher-Yates algorithm
  for (let i = data.images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data.images[i], data.images[j]] = [data.images[j], data.images[i]];
    [data.labels[i], data.labels[j]] = [data.labels[j], data.labels[i]];
  }
  */

  // Split the data into training and test datasets
  const numTrain = Math.floor(data.images.length * trainRatio);
  const trainImages = data.images.slice(0, numTrain);
  const trainLabels = data.labels.slice(0, numTrain);
  const testImages = data.images.slice(numTrain);
  const testLabels = data.labels.slice(numTrain);

  // Convert the training and test data to TensorFlow tensors
  const trainXs = tf.stack(trainImages);
  const trainYs = tf.oneHot(tf.tensor1d(trainLabels, "int32"), numClasses);
  const testXs = tf.stack(testImages);
  const testYs = tf.oneHot(tf.tensor1d(testLabels, "int32"), numClasses);

  //console.log("Trainx:",trainXs)
  //console.log("Trainy:",trainYs)
  console.log("Train/test prepared");

  // Train and evaluate a simple neural network using the training and test data
  const model = tf.sequential({
    layers: [
      tf.layers.flatten({ inputShape: [imgSize, imgSize, 1] }),
      tf.layers.dense({ units: imgSize, activation: "relu" }),
      tf.layers.dense({ units: imgClasses, activation: "softmax" }),
    ],
  });

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });


  const batchSize = numImgs/4;
  const epochs = 200

  // Define a callback function to monitor the progress of the training
  const monitorCallback = async (epoch, logs) => {
    console.log(
      `Epoch ${epoch}: loss = ${logs.loss.toFixed(
        4
      )}, accuracy = ${logs.acc.toFixed(4)}`
    );
    // Access the weights of the first layer
    //const weights = await model.layers[1].getWeights();
    //await showWeights(weights)
  };

  console.log("STart training");
  // Assume that you have loaded the training and test data into TensorFlow tensors called trainXs, trainYs, testXs, and testYs, and defined a model called "model"
  //
  await model.fit(trainXs, trainYs, {
    batchSize: batchSize,
    epochs: epochs,
    callbacks: { onEpochEnd: monitorCallback },
    validationData: [testXs, testYs],
  });
  console.log("Start eval");
  const result = await model.evaluate(testXs, testYs);
  console.log(`Test loss: ${result[0]}`);
  console.log(`Test accuracy: ${result[1]}`);

  //
  /*
  for (let i=0;i<epochs;i++){

    await model.fit(trainXs, trainYs, {
      batchSize: batchSize,
      epochs: 1,
      callbacks: { onEpochEnd: monitorCallback },
      validationData: [testXs, testYs],
    });
    console.log("Start eval");
    const result = await model.evaluate(testXs, testYs);
    console.log(`Test loss: ${result[0]}`);
    console.log(`Test accuracy: ${result[1]}`);

    const weights = await model.layers[1].getWeights();
    await showWeights(weights)
    await new Promise((resolve) => setTimeout(resolve, 500));
      
  }
  */

  return model;
}
// --------------------------------------------------
// --------------------------------------------------
async function showWeights(weights) {
// Assume that you have a trained model called "model" and a dense layer called "denseLayer"

// Get the weights tensor of the dense layer
const weightsArray = await weights[0].array();
const numRows = weights[0].shape[0];
const numCols = weights[0].shape[1];

// Find the minimum and maximum values in the weights array
const minValue = Math.min(...weightsArray.flat());
const maxValue = Math.max(...weightsArray.flat());

const numElements = numRows * numCols
const squareSize = Math.ceil(Math.sqrt(numElements));
const reshapedArray = new Array(squareSize).fill().map(() => new Array(squareSize).fill(0));
for (let i = 0; i < numElements; i++) {
  const row = Math.floor(i / squareSize);
  const col = i % squareSize;
  reshapedArray[row][col] = weightsArray[Math.floor(i / numCols)][i % numCols];
}
//console.log("reshaped:",reshapedArray)

// Create a new canvas element to display the weights
const canvas = document.getElementById('cvw');
/*
canvas.width = numCols;
canvas.height = numRows;
*/

canvas.width = squareSize;
canvas.height = squareSize;

// will rescale to this size
/*
canvas.width = imgSize
canvas.height = imgSize;
*/
// Draw the weights array on the canvas as a grayscale image
const context = await canvas.getContext('2d');
const imageData = await context.createImageData(squareSize,squareSize);
const data = imageData.data;
/*
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    const index = (i * numCols + j) * 4;
    const value = weightsArray[i][j];
    data[index] = value * 255;
    data[index + 1] = value * 255;
    data[index + 2] = value * 255;
    data[index + 3] = 255;
  }
}
*/
for (let i = 0; i < squareSize; i++) {
  for (let j = 0; j < squareSize; j++) {
    const index = (i * squareSize + j) * 4;
    const value = reshapedArray[i][j];

    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const red = Math.round(normalizedValue * 255);
    const blue = Math.round((1 - normalizedValue) * 255);
    //console.log(red,blue)

    data[index] = red;
    data[index + 1] = 0;
    data[index + 2] = blue;
    /*
    data[index] = value * 255;
    data[index + 1] = value * 255;
    data[index + 2] = value * 255;
    */
    data[index + 3] = 255;
  }
}
//context.putImageData(imageData, 0, 0);
await context.putImageData(imageData, 0, 0);



}
// --------------------------------------------------
// --------------------------------------------------
async function imgGen() {
  // Generate images
  const images = [];
  const labels = [];
  for (let i = 0; i < numImgs; i++) {
    const data = await mkSingleImg();
    await images.push(data.image);
    await labels.push(data.label);
  }
  return { labels: labels, images: images };
}
// --------------------------------------------------
// --------------------------------------------------
async function mkSingleImg() {
  console.log("size:", imgSize);
  const canvas = document.getElementById("cv"); //createElement('canvas');
  canvas.width = imgSize;
  canvas.height = imgSize;
  const ctx = await canvas.getContext("2d");
  await ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shapeStrokeColor = `rgb(0, 0, 0)`; // black stroke color

  // Define shape drawing functions
  const drawTriangle = (ctx, size, strokeWidth) => {
    ctx.beginPath();
    ctx.moveTo(-size / 2, -size / 2);
    ctx.lineTo(size / 2, -size / 2);
    ctx.lineTo(0, size / 2);
    ctx.closePath(); // Close the path to fill the triangle
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = shapeStrokeColor;
    ctx.stroke();
  };

  const drawEllipse = (ctx, size, strokeWidth) => {
    ctx.beginPath();
    ctx.ellipse(0, 0, size / 2, size / 4, 0, 0, Math.PI * 2);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = shapeStrokeColor;
    ctx.stroke();
  };

  const drawRectangle = (ctx, size, strokeWidth) => {
    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = shapeStrokeColor;
    ctx.rect(-size / 2, -size / 2, size, size);
    ctx.stroke();
  };

  // Select a random shape type
  const shapeType = Math.floor(Math.random() * 3); // 0 = triangle, 1 = ellipse, 2 = rectangle

  // Define shape properties
  const shapeSize = Math.floor((Math.random() * imgSize) / 4) + imgSize / 6; // random size between 10 and 30
  const shapeStrokeWidth = Math.floor(Math.random() * 4) + 3; // random stroke width between 1 and 4
  const shapeRotation = Math.random() * 2*Math.PI; // random rotation between 0 and pi

  // Set shape position to center of canvas
  /* */
  //const shapeX = canvas.width / 2;
  //const shapeY = canvas.height / 2;
  /* */
  //
    const shapeX = (imgSize / 2) + Math.floor((Math.random() -.5) * shapeSize/4)
    const shapeY =  (imgSize / 2) + Math.floor((Math.random() -.5) * shapeSize/4)
    //

  // Draw shape based on type and add label
  let label;

  // Rotate shape based on random rotation
  await ctx.save();
  await ctx.translate(canvas.width / 2, canvas.height / 2);
  await ctx.rotate(shapeRotation);
  await ctx.translate(-canvas.width / 2, -canvas.height / 2);
  await ctx.translate(shapeX, shapeY);
  //await ctx.translate(-shapeX, -shapeY);

  switch (shapeType) {
    case 0: // Triangle
      drawTriangle(ctx, shapeSize, shapeStrokeWidth);
      label = 0;
      break;
    case 1: // Ellipse
      drawEllipse(ctx, shapeSize, shapeStrokeWidth);
      label = 1;
      break;
    case 2: // Rectangle
      drawRectangle(ctx, shapeSize, shapeStrokeWidth);
      label = 2;
      break;
  }
  await ctx.restore();

  // Convert canvas to grayscale and store image data in array
  // Convert canvas to grayscale and store image data in array
  const imageData = await ctx.getImageData(0, 0, canvas.width, canvas.height);

  // NOTE: we have black+white data. color channels are all 0, alpha channel is 0 or 255
  const imageDataArray = await new Float32Array(imageData.data.length / 4);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const gray = imageData.data[i+3]
    const gv = gray / 255
    imageDataArray[i / 4] = gv
  }
  //console.log(imageDataArray)
  // Convert grayscale image data to TensorFlow data and store in image array
  //const tf_img = tf.tensor4d(imageDataArray, [
  const tf_img = await tf.tensor(imageDataArray).reshape([imgSize, imgSize, 1]);
  //await new Promise((resolve) => setTimeout(resolve, 100));
  return { label: label, image: tf_img };
}

// --------------------------------------------------
// --------------------------------------------------