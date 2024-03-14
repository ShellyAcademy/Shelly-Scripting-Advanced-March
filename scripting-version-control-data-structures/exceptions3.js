function sunriseSunset(result) {
    console.log("parsing the sunrise sunset result");
    try {
      let response = JSON.parse(result);
    } catch (error) {
      console.log(error);
    }
    console.log("finish parsing the values");
  }
  
  Shelly.call("HTTP.GET", { url: "https://sunrise-sunset.org/json?lat=&lng="},
              sunriseSunset);