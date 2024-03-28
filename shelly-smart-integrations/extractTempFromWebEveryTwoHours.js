function getTemperature() {
    let sysConfig = Shelly.getComponentConfig("sys");
    let lat = sysConfig.location.lat;
    let lon = sysConfig.location.lon;
    
    let url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m";
  
    Shelly.call("HTTP.GET", {url:url}, function(result) {
      let body = JSON.parse(result.body);
      let temperature = body.current.temperature_2m;
      console.log("Current temperature is", temperature, "C");
    })
  }
  
  let schedule = {
    enable: true,
    timespec: "*/10 * * * * *",
    calls: [
      {
        method: "Script.eval",
        params: {
          id: Shelly.getCurrentScriptId(),
          code: "getTemperature()"
        }
      }
    ]
  }
  console.log(schedule);
  
  Shelly.call("Schedule.Create", schedule, function(result) {
    console.log(result);
  });