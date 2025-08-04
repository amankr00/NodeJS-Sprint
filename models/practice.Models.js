// const fs = require("fs");
// const path = require("path");

// p = path.join(path.dirname, "data", "products.json");

// /*
// We used a callback so that we have to read data from the products.json,
// which will take some time . So we are using callbacks 
// */

// getDataFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (!err && fileContent.length > 0) {
//       data = JSON.parse(fileContent);
//       cb(data);
//     } else {
//       cb([]);
//     }
//   });
// };

