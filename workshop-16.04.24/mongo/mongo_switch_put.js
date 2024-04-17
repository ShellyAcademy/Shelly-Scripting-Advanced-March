// Change IP address of Raspberry Pi
const baseUrl = "http://192.168.0.251:8080/switch"
const deviceInfo = Shelly.getDeviceInfo();

function updateSwitch(switchId, output, voltage, apower) {
  let data = {
    device_id: deviceInfo.id,
    switch_id: switchId,
    output: output,
    voltage: voltage,
    apower: apower
  }
  let request = {
    url: baseUrl + "/" + data.device_id + "/" + data.switch_id,
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }
  
  Shelly.call("HTTP.Request", request, function(response, error_code, error_message) {
    if (error_code === 0) {
      console.log("Response:", response.body);
    } else {
      console.log("Error:", error_message);
    }
  })
}

Shelly.addStatusHandler(function(status) {
  if (status.component.substr(0,6) === "switch") {
    let switchStatus = Shelly.getComponentStatus(status.component);
    console.log("New status update for", status.component);
    updateSwitch(switchStatus.id, switchStatus.output, switchStatus.voltage, switchStatus.apower);
  }
});