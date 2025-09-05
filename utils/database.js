const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

// Establishes Connection with MongoDB
// Callback helps to wait until the connection is established.
const mongoConnect = callback => {
    MongoClient.connect(
      "mongodb+srv://amanDB:bgcnCS24@e-commerce.sw7dvht.mongodb.net/shop?retryWrites=true&w=majority&appName=E-Commerce"
    )
      .then((client) => {
        console.log("Connected");
        _db = client.db()  // Storing connection-instance in _db
        callback(client)
      })
      .catch((err) => console.log(err));
}

// Lets access the db connection
const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No Database found!'
}
 
exports.mongoConnect = mongoConnect
exports.getDb = getDb

