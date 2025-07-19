const path = require('path');

module.exports = path.dirname(process.mainModule.filename)

/* What is process.mainModule.filename?
* It returns the absolute path of the main module (the entry point of the application).
* In this case, it will return the path of the app.js file.
* dirname() is used to get the directory name of the path.
* So, this module exports the directory name of the main module, which is useful for constructing
* absolute paths to other files in the application.
* This is particularly useful in Express applications to serve static files or render views.
* For example, if the main module is located at /Users/aman/Desktop/app.js,
* process.mainModule.filename will return /Users/aman/Desktop/app.js,
* and path.dirname(process.mainModule.filename) will return /Users/aman/Desktop.
* This allows you to construct paths relative to the main module's directory.
*/