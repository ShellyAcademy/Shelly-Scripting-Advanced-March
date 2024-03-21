function turnOnShellyDevice() {
  Shelly.call("Switch.Set", { id: 0, on: true });
}

function turnOffShellyDevice() {
  Shelly.call("Switch.Set", { id: 0, on: false });
}

// Function to fetch temperature from Shelly Plus Plug S
function fetchTemperature() {
  Shelly.call(
    "HTTP.GET",
    {
      url: "http://192.168.1.54/rpc/Temperature.GetStatus?id=0",
    },
    function (result, error_code, error_msg, ud) {
      if (error_code === 0 && result.code === 200) {
        // Assuming the response is JSON and contains a temperature field
        let response = JSON.parse(result.body);
        let temperature = response.tC;
        console.log("Temperature: " + temperature + "°C");
        return temperature;
      } else {
        console.log("Failed to fetch temperature: " + error_msg);
      }
    },
    null
  );
}

// Function to fetch humidity from Shelly Plus Plug S
function fetchHumidity() {
  Shelly.call(
    "HTTP.GET",
    {
      url: "http://192.168.1.54/rpc/Humidity.GetStatus?id=0",
    },
    function (result, error_code, error_msg, ud) {
      if (error_code === 0 && result.code === 200) {
        // Assuming the response is JSON and contains a temperature field
        let response = JSON.parse(result.body);
        let humidity = response.rh;
        console.log("Humidity: " + humidity + "%");
        return humidity;
      } else {
        console.log("Failed to fetch humidity: " + error_msg);
      }
    },
    null
  );
}

Shelly.addEventHandler(function (event) {
  if (event.info.event === "BLU_BUTTON") {
    let value = event.info.data.Button;
    if (value === 1) {
      let temperature = fetchTemperature();
      if (temperature <= 20) {
        turnOnShellyDevice();
      } else {
        turnOffShellyDevice();
      }
    } else if (value === 2) {
      let humidity = fetchHumidity();
      if (humidity <= 30) {
        turnOnShellyDevice();
      } else {
        turnOffShellyDevice();
      }
    }
  }
});
