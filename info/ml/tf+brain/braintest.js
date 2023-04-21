
import * as brain from "brain.js"

// https://github.com/tensorflow/tfjs
import * as tf from '@tensorflow/tfjs';
// tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);

// this disables the warning on gpu not fully suceessful
//tf.env().set('WEBGL_VERSION', 0);
// this one as well. maybe better
tf.setBackend('cpu');

export async function braintest(idx, el) {
    console.log("test:", idx)
    let r
    switch (idx) {
        case 1:
            r = await f0()
            break;
        case 2:
            r = await f2()
            break;
        case 3:
            r = await f3()
            break;
        case 4:
            r = await f4()
            break;
        default:
            r = String(idx)
    }
    el.innerHTML = r
}

const f1 = async () => {
    // Create a Neural Network
    const network = await new brain.NeuralNetwork();

    // Train the Network with 4 input objects
    await network.train([
        { input: [0, 0], output: { zero: 1 } },
        { input: [0, 1], output: { one: 1 } },
        { input: [1, 0], output: { one: 1 } },
        { input: [1, 1], output: { zero: 1 } },
    ]);

    // What is the expected output of [1,0]?
    let result = await network.run([1, 0]);
    return await JSON.stringify(result)
}

const f2 = async () => {
    const net = await new brain.recurrent.LSTMTimeStep({
        inputSize: 2,
        hiddenLayers: [10],
        outputSize: 2,
    });

    await net.train([
        [1, 3],
        [2, 2],
        [3, 1],
    ]);

    const output = await net.run([
        [1, 3],
        [2, 2],
    ]); // [3, 1]
    return await JSON.stringify(output)

}

const f3 = async () => {

    const net = await new brain.recurrent.LSTM();
    console.log("NN")

    await net.train([
        { input: 'I feel great about the world!', output: 'happy' },
        { input: 'The world is a terrible place!', output: 'sad' },
    ],
        {
            // Defaults values --> expected validation
            iterations: 20000, // the maximum times to iterate the training data --> number greater than 0
            errorThresh: 0.012, //0.005, // the acceptable error percentage from training data --> number between 0 and 1
            log: true, // true to use console.log, when a function is supplied it is used --> Either true or a function
            logPeriod: 1000, // iterations between logging out --> number greater than 0
            learningRate: 0.3, // scales with delta to effect training rate --> number between 0 and 1
            momentum: 0.1, // scales with next layer's change value --> number between 0 and 1
            //callback: null, // a periodic call back that can be triggered while training --> null or function
            //callbackPeriod: 10, // the number of iterations through the training data between callback calls --> number greater than 0
            timeout: 5000, // the max number of milliseconds to train for --> number greater than 0. Default --> Infinity
        }
    );
    console.log("Train")

    const output = await net.run('great wheather today'); // 'happy'
    console.log("Out")
    console.log(output)

    return await JSON.stringify(output)
}


const f0 = async () => {

    // Define the model architecture
    const model = await tf.sequential();
    await model.add(tf.layers.conv2d({
        filters: 16,
        kernelSize: 3,
        activation: 'relu',
        inputShape: [16, 16, 1]
    }));
    await model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    await model.add(tf.layers.flatten());
    await model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    await model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));

    // Compile the model
    await model.compile({
        optimizer: 'sgd',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    const modelJson = await model.toJSON();

    // Sample training data
    // 4 examples
    const xIn = tf.tensor([
        // First 16x16 image
        [
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            // Rest of the first image
        ],
        // Second 16x16 image
        [
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            // Rest of the second image
        ],
        // Third 16x16 image
        [
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            // Rest of the third image
        ],
        // Fourth 16x16 image
        [
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
            [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
        ]
    ])

    const yIn = tf.tensor([
        [1, 0], // Circle
        [0, 1], // Square
        [0, 1], // Square
        [1, 0], // Circle
        // Rest of the training data
    ]);

    // Total number of training examples
    const numExamples = yIn.shape[0]; // returns 200 for example data
    console.log ("Samples:",numExamples)

    const numTestExamples = 2;
    const xTest = xIn.slice([0, 0], [numTestExamples, xIn.shape[1]]);
    const xTrain = xIn.slice([numTestExamples, 0], [-1, -1]);
    const yTest = yIn.slice([0, 0], [numTestExamples, yIn.shape[1]]);
    const yTrain = yIn.slice([numTestExamples, 0], [-1, -1]);
    

    // Train the model
    const history = await model.fit(xTrain, yTrain, {
        epochs: 10,
        validationData: [xTest, yTest],
        verbose: 1,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch+1} - loss: ${logs.loss.toFixed(4)} - acc: ${logs.acc.toFixed(4)} - val_loss: ${logs.val_loss.toFixed(4)} - val_acc: ${logs.val_acc.toFixed(4)}`);
          }
        }       
    });

    // Save the trained model to JSON format
    const modelSavePath = "tftest"
    const saveResults = await model.save(`localstorage://${modelSavePath}`);
    console.log(saveResults)

    const loadedModel = await tf.loadLayersModel(`localstorage://${modelSavePath}`);
    //const modelJSON = await localStorage.getItem("tensorflowjs_models/tftest/info/" + modelSavePath + '/model.json');
    //console.log("mjson",JSON.stringify(modelJSON))
    //const weights = await localStorage.getItem("tensorflowjs_models/tftest/info/" + modelSavePath + '/weights.bin');
    //const weight_spec = await localStorage.getItem("tensorflowjs_models/tftest/weight_specs");
    const weight_data = await localStorage.getItem("tensorflowjs_models/tftest/weight_data");
    //console.log("ws",JSON.stringify(weight_spec))
    //console.log("wd",JSON.stringify(weight_data))
    const weightString = atob(weight_data);
    const weights = new Float32Array(new Uint8Array(weightString.split('').map(char => char.charCodeAt(0))).buffer);
    console.log("wdarray",JSON.stringify(weights))

    //const loadedModel = await tf.loadLayersModel(tf.io.fromMemory(JSON.parse(modelJson), JSON.parse(weight_spec)));    

    console.log(JSON.stringify({model:loadedModel,weights:weight_data}))

    // Evaluate the model on a test dataset
    const evalResult = await model.evaluate(xTest, yTest);

    return await JSON.stringify({ model: modelJson, model2: loadedModel, result: evalResult })
    //return await JSON.stringify({ model: modelJson, model2: modelJson2, result: evalResult })


}
