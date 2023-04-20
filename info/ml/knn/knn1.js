const KNN = require("ml-knn")

var train_dataset = [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
    [2, 2, 2],
    [1, 2, 2],
    [2, 1, 2],
  ];
  var train_labels = [0, 0, 0, 1, 1, 1];
  var knn = new KNN(train_dataset, train_labels, { k: 2 }); // consider 2 nearest neighbors

  console.log("knn:",knn)

  var test_dataset = [
    [0.9, 0.9, 0.9],
    [1.1, 1.1, 1.1],
    [1.1, 1.1, 1.2],
    [1.2, 1.2, 1.2],
  ];
  
  var ans = knn.predict(test_dataset);
  
  console.log("Ans",ans);
  // classification result:
  // ans = [ 0, 0, 1, 1 ]
  // Based on the training data, the first two points of the test dataset are classified as "0" (type 0, perhaps),
  // the third and fourth data points are classified as "1".
