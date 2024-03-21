const threshold = 5;
let SHELLY_HT_IP = "172.20.10.3";
let SHELLY_PLUG_IP = "172.20.10.2";

function getTemperatureAddOn(callback) {
  Shelly.call("Temperature.GetStatus", { id: 100 }, function (result) {
    let temperatureAddOn = result.tC;
    console.log(temperatureAddOn);
    callback(temperatureAddOn); // Invoke the callback with the temperature
  });
}

function getTemperatureHT(callback) {
  let url = "http://172.20.10.3/rpc/Temperature.GetStatus?id=0";
  Shelly.call("HTTP.GET", { url: url }, function (result) {
    let response = JSON.parse(result.body);
    let temperatureHT = response.tC;
    console.log(temperatureHT);
    callback(temperatureHT); // Invoke the callback with the temperature
  });
}

function turnOnHeater() {
  console.log("Turning on the heater...");
  let url = "http://" + SHELLY_PLUG_IP + "/rpc/Switch.Set?id=0&on=true";
  Shelly.call("HTTP.GET", { url: url });
}

function turnOffHeater() {
  console.log("Turning off the heater...");
  let url = "http://" + SHELLY_PLUG_IP + "/rpc/Switch.Set?id=0&on=false";
  Shelly.call("HTTP.GET", { url: url });
}

function checkTemperatureDifference() {
  getTemperatureAddOn(function (temperatureAddOn) {
    getTemperatureHT(function (temperatureHT) {
      console.log("Temperature Add On:", temperatureAddOn);
      console.log("Temperature H&T:", temperatureHT);

      if (temperatureHT > temperatureAddOn) {
        let difference = temperatureHT - temperatureAddOn;
        console.log("Difference", difference);
        if (difference >= threshold) {
          turnOnHeater();
        }
      } else {
        turnOffHeater();
      }
    });
  });
}

checkTemperatureDifference();