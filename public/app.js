
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      total: 0,
      currentProductLine: "Classic Cars"
    }
  }

  // Add to cart
  addToCart = (productName, buyPrice) => {
      const newItem = {
       itemName: productName,
       itemPrice: buyPrice,
       quantity: 0, 
       subtotal: 0
    }
    
    this.setState({ items: [...this.state.items, newItem] });
  }

  // update quantity
  changeQuantity = (name, step) => {
    //let currentTotal = this.state.total;
    this.setState({ items: this.state.items.map(item => {
     if(item.itemName === name)
     {
        if((item.quantity === 0 && step > 0) || item.quantity > 0)
        {
          item.quantity += step;
          item.subtotal = Math.round((item.itemPrice * item.quantity) * 100) / 100;
          this.state.total += Math.round((item.itemPrice * step) * 100) / 100;
        }       
     }
     return item;
   }) });
  }

  // Remove an item
  removeItem = (name) => {
    this.setState({ items: [...this.state.items.filter(item => item.itemName !== name)] });
    let newTotal = 0;
    this.state.items.map(item => {
      if(item.itemName !== name){
        newTotal += (item.subtotal);
      }
    })
    this.state.total = newTotal;
  }

  onPurchase = (items) =>{
    
    alert("Thank you for your business with us.  Your order has been processed");
    this.setState({ items: [], total: 0 })
    //console.log(items);
    /*
    fetch("onPurchase", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    })
    .then(response => response.json())
    .then(data => {
      this.setState({ items: data })
    })
    .catch(error => {
      this.setState({ message: error });
    })
    */
  }

  render() {
    return (
      <div id = "container">
        <ProductLines 
          currentProductLine = {this.state.currentProductLine}
          changeProductLine = {this.changeProductLine.bind(this)} 
        />
        <Products
          productLine = {this.state.currentProductLine}
          addToCart = {this.addToCart}
        />
        <Cart 
          items = {this.state.items}
          total = {this.state.total}
          removeItem = {this.removeItem}
          changeQuantity = {this.changeQuantity}
          onPurchase = {this.onPurchase}
        />
      </div>
    )
  }

  changeProductLine(productLine) {
    this.setState({ currentProductLine: productLine });
  }
}

// List of Product Lines
class ProductLines extends React.Component {
  constructor() {
    super();
    this.state = {
      lines: [],
      message: null
    }
  }

  componentDidMount() {
    this.setState({ message: "Loading Product Lines..." });
    fetch("getProductLines")
    .then(response => response.json())
    .then(data => {
      this.setState({ lines: data, message: null });
    })
    .catch(error => {
      this.setState({ message: error });
    })
  }

  render() {
    return (
      <div id = "productLines">
        
        <h2>Product Lines</h2>    
        {
          this.state.message 
          ?
          <p className = "errorMessage">{this.state.message}</p>
          :
          <table>
            <tbody>
              <tr>
                { 
                  this.state.lines.map(item => (
                  <td key={item.productLine}
                      //className={(item.productLine === this.props.currentProductLine ? 'selected' : '')}
                      onClick={() => this.props.changeProductLine(item.productLine)}
                  >
                    {item.productLine}
                  </td>
                  ))
                }
              </tr>
            </tbody>
          </table>
        }
      </div>
    )
  }
}

class Products extends React.Component {
  constructor() {
    super();
    this.state = {
      products: [],
      message: null
    }
  }

  loadProducts(props) {
    this.setState({ message: "Loading Products..." });
    fetch("getProducts?productLine=" + props.productLine)
    .then(response => response.json())
    .then(data => {
      this.setState({ products: data, message: null });
    })
    .catch(error => {
      this.setState({ message: error });
    })
  }

  componentWillReceiveProps(props) {
    if(props.productLine !== this.props.productLine)
    {
      this.loadProducts(props);
    }       
  }  

  componentDidMount() {
    this.loadProducts(this.props);
  }

  onAdd(productName, buyPrice)
  {
    this.props.addToCart(productName, buyPrice);
  }

  render(){
    return(
      <div id = "productDisplay">
        <h2>{this.props.productLine} {"  "} Products</h2>
        <p id = "instructions"> Click on the product you want to add to the Shopping Cart</p>
        {
          this.state.message 
          ?
          <p className = "errorMessage">{this.state.message}</p>
          :
          <table>
            <tbody>
              <tr>
                <th>
                  Product
                </th>
                <th id = "price">
                  Price
                </th>
              </tr>
            {
              this.state.products.map(item => (
                <tr 
                  key = {item.productCode}
                  onClick = {() => this.onAdd(item.productName, item.buyPrice)}
                >
                <td>
                  {item.productName}
                </td>

                <td id = "price">
                  {item.buyPrice}
                </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        }
      </div>
    )
  }
}

class Cart extends React.Component {

  render() {
    return (
      <div id = "cart">
        <h2>Shopping Cart</h2>
        <table>
          <tbody>
            <tr>
              <th>
                Item
              </th>
              <th>
                Price
              </th>
              <th>
                Quantity
              </th>
              <th>
                Subtotal
              </th>
              <th>
                Remove Item
              </th>
            </tr>
            {
              this.props.items.map(item => (
                <tr key = {item.itemName}>
                  <td>
                    {item.itemName}
                  </td>
                  <td>
                    <span id = "cartPrice">
                      $  {item.itemPrice}
                    </span>
                  </td>
                  <td>
                    {item.quantity}
                    <button className = "plusBtn" onClick = {this.props.changeQuantity.bind(this, item.itemName, 1)} >+</button>
                    <button onClick = {this.props.changeQuantity.bind(this, item.itemName, -1)}>-</button>
                  </td>
                  <td id = "subtotal">
                    {item.subtotal} 
                  </td>
                  <td>
                    <span id = "remove">
                      <button onClick = {this.props.removeItem.bind(this, item.itemName)} className = "removeBtn">Remove</button>
                    </span>
                  </td>
                </tr>
              ))
            }
            <tr>
              <th>
              </th>
              <th>
                TOTAL AMOUNT
              </th>
              <th>
              </th>
              <th>
              <span style = {totalStyle}>
                $  {Math.round(this.props.total * 100) / 100}
              </span>
              </th>
              <th>
                <button onClick = {this.props.onPurchase.bind(this, this.props.items)} className = 'purchaseBtn'>Purchase</button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    )
  } 
}

const totalStyle = {
  fontSize: "1.2em",

}


ReactDOM.render(
  <App />, 
  document.getElementById("root")
); 