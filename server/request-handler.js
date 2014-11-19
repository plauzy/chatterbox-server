var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type':"application/json"
};

var exports = module.exports = {};

exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  var headers = defaultCorsHeaders;

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var objectId = 0;
var messages = [];

exports.collectData = function(request, callback) {
  var data = "";

  request.on('data', function(chunk) {
    data+=chunk;
  } );
  request.on('end', function() {
    callback(JSON.parse(data));
  });
};

exports.requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var method = request.method;
  console.log(method)

  if (method === "POST") {
    exports.collectData(request, function(message) {
      message.objectId = ++objectId;
      messages.push(message);
      console.log(messages);
      console.log('here i am');

      exports.sendResponse(response, {objectId: message.objectId}, 201);
    });
  }
  else if (method === "GET") {
    exports.sendResponse(response, {results: messages});
  }
  else if (method === "OPTIONS") {
    exports.sendResponse(response);
  }


};

