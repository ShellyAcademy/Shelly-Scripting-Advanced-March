let config = {
    "config": {
      "location": {
        "tz": "Europe/Berlin"
      }
    }
  }
  
  Shelly.call("Sys.SetConfig", config, function(result) {
    console.log(result);
  });