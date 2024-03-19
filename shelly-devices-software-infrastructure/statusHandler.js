Shelly.addStatusHandler(function(eventData) {
    if (eventData.component==="switch:1") {
      // here we handle all the changes in the status of switch:1
      if (eventData.delta.output === true) {
        console.log("Switch 1 turned on");
      };
  
      if (eventData.delta.output === false) {
        console.log("Switch 1 turned off");
      };
  
      if (eventData.delta.apower > 2000) {
        // handle change in power consumption
      };
    }
  }
  )