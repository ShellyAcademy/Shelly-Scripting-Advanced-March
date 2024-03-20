// Store Provision - First way
function store(localStore, orders) {
  let store = {};
  for (let i = 0; i < localStore.length - 1; i += 2) {
    let product = localStore[i];
    let quantity = Number(localStore[i + 1]);
    console.log(product, "->", quantity);
    store[product] = quantity;
  }
  // update quantities from orders
  for (let i = 0; i < orders.length - 1; i += 2) {
    let product = orders[i];
    let quantity = Number(orders[i + 1]);
    // if store[product] is undefined, means that this product is not in the store yet
    if (store[product] === undefined) {
      store[product] = quantity;
    } else {
      // if the product is in the store, update the quantity
      store[product] += quantity;
    }
  }
  // print the final store information
  for (product in store) {
    console.log(product, "->", store[product]);
  }
}

// Store Provision - Second way
function updateStore(store, productQuantitiesArr) {
  for (let i = 0; i < productQuantitiesArr.length - 1; i += 2) {
    let product = productQuantitiesArr[i];
    let quantity = Number(productQuantitiesArr[i + 1]);
    // if store[product] is undefined, means that this product is not in the store yet
    if (store[product] === undefined) {
      store[product] = quantity;
    } else {
      // if the product is in the store, update the quantity
      store[product] += quantity;
    }
  }
};

function store(localStore, orders) {
  let store = {};

  updateStore(store, localStore);
  updateStore(store, orders);

  // print the final store information
  for (product in store) {
    console.log(product, "->", store[product]);
  }
}

// Store Provision - Third way
function store(localStore, orders) {
  let store = {
    // data will contain key-value store with the product-quantity information
    data: {},
    updateStore: function (productQuantitiesArr) {
      for (let i = 0; i < productQuantitiesArr.length - 1; i += 2) {
        let product = productQuantitiesArr[i];
        let quantity = Number(productQuantitiesArr[i + 1]);
        // if store[product] is undefined, means that this product is not in the store yet
        if (this.data[product] === undefined) {
          this.data[product] = quantity;
        } else {
          // if the product is in the store, update the quantity
          this.data[product] += quantity;
        }
      }
    },
    printProducts: function () {
      // print the final store information
      for (product in this.data) {
        console.log(product, "->", this.data[product]);
      }
    },
  };
  store.updateStore(localStore);
  store.updateStore(orders);
  store.printProducts();
};

store([
    "Shelly Plug",
    "5",
    "Shelly Dimmer",
    "9",
    "Shelly Uni",
    "14",
    "Shelly Button",
    "4",
    "Shelly TRV",
    "2",
  ],
    [
      "Shelly Motion",
      "44",
      "Shelly Flood",
      "12",
      "Shelly Button",
      "7",
      "Shelly Duo",
      "70",
      "Shelly Uni",
      "30",
    ]);