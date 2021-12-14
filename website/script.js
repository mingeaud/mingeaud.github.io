// Object holding the customers pizza with the price and the different toppings that are selected
var your_pizza = {
  size: 'None',
  toppings: [],
  total_price: 0
}

// Object holding the customers address
var address = {
  street: 'None',
  appt: 'None',
  city: 'None',
  state: 'None',
  zip: 'None'
}

// Variable holding the price so the business only has to update prices in one place
var price = {
  large: 15.00,
  medium: 13.00,
  small: 10.00,
}

// variable for toppings in case the business needs to update them sometime
var toppings_price = 1.50;

// Finds the price for the size that was chosen and adds that to the total price of toppings
function caclulate_price() {

  var total_price = 0;
  var size = "None";

  // Finds which size radio button was selected and assings the price to the your_pizza object
  var pizza_size = document.getElementsByClassName("size");

  for (var i = 0; i < pizza_size.length; i++) {
    if (pizza_size[i].checked) {
      your_pizza.size = pizza_size[i].value;
    }
  }

  if (your_pizza.size == "Small") {
    your_pizza.total_price = price.small;
  }
  else if (your_pizza.size == "Medium") {
    your_pizza.total_price = price.medium;
  }
  else if (your_pizza.size == "Large") {
    your_pizza.total_price = price.large;
  }

  // finds how many toppings were checked, adds that topping to the your_pizza object and totals the prce
  var toppings = document.getElementsByClassName("topping");

  for (var i = 0; i < toppings.length; i++) {
    if (toppings[i].checked && your_pizza.total_price != -1) {
      your_pizza.toppings.push(toppings[i].value);
      your_pizza.total_price = your_pizza.total_price + toppings_price;
    }
  }
}

function process_address() {
  // Takes the input from each text input and adds them to the address object

  var add = document.getElementsByClassName("cust_address");

  address.street = add[0].value;
  address.appt = add[1].value;
  address.city = add[2].value;
  address.state = add[3].value;
  address.zip = add[4].value;
}


// function for taking customer input and sends data to  http://httpbin.org/post
// I chose http://httpbin.org/post so it could send back a reesponse which is how the confirmation is generated
document.getElementById('orderSubmit').addEventListener('click', function (event) {

  var price = caclulate_price();
  
  process_address();

  // Checks to make sure the customer doesn't live too far away
  if (address.city.toUpperCase() != "CORVALLIS"){
    var response_panel = document.getElementById('confirmation');
    var response_location = document.createElement('p');
    response_location.textContent = "Sorry, we only deliver to Corvallis.";
    event.preventDefault();
    response_panel.appendChild(response_location);
  }
  // If they forgot to check a size radio button this will show an error message
  else if(your_pizza.size == 'None'){
    var response_panel = document.getElementById('confirmation');
    var response_location = document.createElement('p');
    response_location.textContent = "Oops, looks like you forgot to input a size.";
    event.preventDefault();
    response_panel.appendChild(response_location);
  }
  // the order is OK, so the data is prepared to send to the server
  else {
    var response_panel = document.getElementById('confirmation');
    var response_location = document.createElement('li');
    var req = new XMLHttpRequest();
    var payload = { 
      size: your_pizza.size,
      toppings: your_pizza.toppings,
      price: your_pizza.total_price,
      street: address.street,
      appt: address.appt,
      city: address.city,
      state: address.state,
      zip: address.zip
     };

//this gets the response from http://httpbin.org/post and prints the size and price to let the customer know
  // the order was recieved
    req.open('POST', 'http://httpbin.org/post', true);
    req.setRequestHeader('Content-Type', 'application/json');

    // Asynchronous event listener to recieve and print the results 
    req.addEventListener('load', function () {
      if (req.status >= 200 && req.status < 400) {
        var response = JSON.parse(req.responseText);
        response_location.textContent = "Order received. Your pizza is on its way!";
        response_panel.appendChild(response_location);
        response_location = document.createElement('li');
        response_location.textContent = "The total price for your " + response.json.size + " pizza is $" + response.json.price.toFixed(2);
        response_panel.appendChild(response_location);
      } else {
        console.log("Error in network request: " + req.statusText);
      }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();
  }
});


