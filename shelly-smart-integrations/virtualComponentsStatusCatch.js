Shelly.addStatusHandler(function(status) {
    if (status.component==="boolean:200" && typeof(status.delta.value)!==undefined) {
      console.log("Turning switch",status.delta.value?"on":"off");
      Shelly.call("Switch.Set", {id:0, on:status.delta.value});
    }
    if (status.component==="number:200" && typeof(status.delta.value)!==undefined) {
      let temp = status.delta.value;
      if (temp < 20) {
        console.log("Turning heater on");
        Shelly.call("Switch.Set", {id:0, on:true});
      } else {
        console.log("Turning heater off");
        Shelly.call("Switch.Set", {id:0, on:false});
      }
    }
  })