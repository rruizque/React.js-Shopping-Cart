
function getProductLines(request, response) {
  var productLines = pjs.query("SELECT productLine FROM productlines");

  response.send(productLines);

}

exports.run = getProductLines;
