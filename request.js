async function run() {
  const url = process.argv.slice(2)[0];
  var request = require('request');
  request(url, function (error, response, body) {
    console.log("Request finished with error:", error);
  })
}

run();
