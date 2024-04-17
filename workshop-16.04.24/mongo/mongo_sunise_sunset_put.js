let CONFIG = {
    SCHEDULE_TIMESPEC: "0 1 0 * * *",
  };
  
  function updateSunriseSunset() {
    // let result = Shelly.getComponentConfig("sys");
    let result = Shelly.getComponentConfig("sys");
  
    let lat = result.location.lat;
    let lon = result.location.lon;
  
    let apiUrl = "https://api.sunrisesunset.io/json?lat=" + lat + "&lng=" + lon;
  
    Shelly.call("HTTP.Get", { url: apiUrl }, function (result) {
      let response = JSON.parse(result.body);
      // console.log(response);
      let sunrise = response.results.sunrise;
      let sunset = response.results.sunset;
  
      const url = "http://192.168.1.113:8080/time/update"; // Endpoint URL
      const data = {
        sunrise: sunrise,
        sunset: sunset,
      }; // Data to be sent
  
      // Prepare the HTTP request
      const request = {
        url: url,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
  
      // Make the HTTP request
      Shelly.call(
        "HTTP.Request",
        request,
        function (response, error_code, error_message) {
          if (error_code === 0) {
            // If the request was successful, log the response body
            console.log(
              "Successfully updated sunrise and sunset times. Response:",
              response.body
            );
          } else {
            // If the request failed, log the error message
            console.log(
              "Failed to update sunrise and sunset times. Error:",
              error_message
            );
          }
        }
      );
    });
  }
  
  // Optionally, run the function to update sunrise and sunset times
  // updateSunriseSunset();
  
  function installSchedule() {
    Shelly.call(
      "Schedule.Create",
      {
        enable: true,
        timespec: CONFIG.SCHEDULE_TIMESPEC,
        calls: [
          {
            method: "script.eval",
            params: {
              id: Shelly.getCurrentScriptId(),
              code: "updateSunriseSunset()",
            },
          },
        ],
      },
      function (result) {
        //save a record that we are registered
        console.log(result);
      }
    );
  }
  
  installSchedule();
  