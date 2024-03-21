let ABOVE_VALUE = 70;
let BEYOND_VALUE = 30;
const SHELLY_PLUS_PLUG_IP = "172.20.10.6";

function turnOnPlug() {
  console.log("Turning on the Plug...");
  let url = "http://" + SHELLY_PLUS_PLUG_IP + "/rpc/Switch.Set?id=0&on=true";
  Shelly.call("HTTP.GET", {url: url}, function(result) {
    console.log(result);
  })
  // Shelly.call("Switch.Set", {id: 0, on: true});
}

function turnOffPlug() {
  console.log("Turning off the Plug...");
  let url = "http://" + SHELLY_PLUS_PLUG_IP + "/rpc/Switch.Set?id=0&on=false";
  Shelly.call("HTTP.GET", {url: url}, function(result) {
    console.log(result);
  })
  // Shelly.call("Switch.Set", {id: 0, on: false});
}

Shelly.addEventHandler(function(e) {
  console.log(e);
  if (e.info.event == 'analog_change') {
    let percentage = e.info.percent;
    if (percentage > ABOVE_VALUE) {
      turnOffPlug();
    } else if (percentage < BEYOND_VALUE) {
      turnOnPlug();
    }
  }
})