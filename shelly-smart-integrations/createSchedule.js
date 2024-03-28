let schedule = {
    enabled: true,
    timespec: "0 43 20 * * *",
    calls: [
      {
        method: "Switch.Set",
        params: {
          id: 0,
          on: true
        }
      }
    ]
  }
  
  Shelly.call("Schedule.Create", schedule, function(result) {
    console.log(result);
  });