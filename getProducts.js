
function getProducts(request, response) {
  console.log(request.params.productLine)

  var products = pjs.query("SELECT productCode, productName, buyPrice FROM products WHERE productLine = ?", request.query.productLine);

  response.send(products);
}

exports.run = getProducts;