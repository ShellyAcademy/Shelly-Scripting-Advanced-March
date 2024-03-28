let kvsSetData = {
    key: "item1",
    value: "item1 value"
  }
  console.log("Setting kvs value");
  Shelly.call("KVS.Set", kvsSetData, function(result) {
      console.log(result)
  });