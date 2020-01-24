
function removeItem(request, response) {
  let name = request.body.itemName;
  pjs.query("DELETE FROM cart WHERE itemName = ?", name);

  let items = pjs.query("SELECT * FROM cart");
  response.send(items);
}

exports.run = removeItem;