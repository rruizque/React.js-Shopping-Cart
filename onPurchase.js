
function onPurchase(request, response) {
  var items = request.body.items;
  items.forEach(item => {
    pjs.query("INSERT INTO cart SET ?", item);
  });

  var list = pjs.query("SELECT * FROM cart");
  response.send(list); 
}

exports.run = onPurchase;