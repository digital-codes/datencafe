const ml = require('ml-regression');
const csv = require('csvtojson/v2');
const SLR = ml.SLR; // Simple Linear Regression

const csvFilePath = 'advertising.csv'; // Data
let csvData = [], // parsed Data
    X = [], // Input
    y = []; // Output

let regressionModel;

const readline = require('readline'); // For user prompt to allow predictions

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});

// requires csvtojson v2 !
csv()
.fromFile(csvFilePath)
.then(async (jsonObj)=>{
	//console.log(jsonObj);
    csvData = jsonObj
    // await csvData.push(jsonObj)
    //console.log("initial:",csvData)
    await dressData(); // To get data points from JSON Objects
    //console.log("dressed:",X,y)
    await performRegression();
})


async function performRegression() {
    regressionModel = new SLR(X, y); // Train the model on training data
    console.log(regressionModel.toString(3));
    await predictOutput();
}

function dressData() {
    /**
     * One row of the data object looks like:
     * {
     *   TV: "10",
     *   Radio: "100",
     *   Newspaper: "20",
     *   "Sales": "1000"
     * }
     *
     * Hence, while adding the data points,
     * we need to parse the String value as a Float.
     */
    //console.log("dress:",csvData)
    //csvData.forEach((row) => {
    for (const row of csvData) {
        X.push(f(row.Radio)); // or row['radio']
        y.push(f(row.Sales)); // or row['sales']
    };
}

function f(s) {
    return parseFloat(s);
}

function predictOutput() {
    rl.question('Enter input X for prediction (Press CTRL+C to exit) : ', (answer) => {
        console.log(`At X = ${answer}, y =  ${regressionModel.predict(parseFloat(answer)).toFixed(2)}`);
        predictOutput();
    });
}
