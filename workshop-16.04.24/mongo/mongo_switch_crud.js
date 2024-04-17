// Change IP address of Raspberry Pi
const baseUrl = "http://192.168.1.113:8080/switch"
const deviceInfo = Shelly.getDeviceInfo();

// CREATE: Add a new switch configuration
function createSwitch(switchId, output, voltage, apower) {
    let data = {
        device_id: deviceInfo.id,
        switch_id: switchId,
        output: output,
        voltage: voltage,
        apower: apower
    };
    let request = {
        url: baseUrl,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    Shelly.call("HTTP.Request", request, function(response, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch created. Response:", response.body);
        } else {
            console.log("Create error:", error_message);
        }
    });
}

// READ: Fetch a switch configuration
function readSwitch(switchId) {
    // let url = `${baseUrl}/${deviceInfo.id}/${switchId}`;
    let url = baseUrl + "/" + deviceInfo.id + "/" + switchId;
    console.log(url);
    let request = {
        url: url,
        method: "GET"
    };

    Shelly.call("HTTP.Request", request, function(response, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch data:", response.body);
        } else {
            console.log("Read error:", error_message);
        }
    });
}

// UPDATE: Modify an existing switch configuration
function updateSwitch(switchId, output, voltage, apower) {
    let data = {
        device_id: deviceInfo.id,
        switch_id: switchId,
        output: output,
        voltage: voltage,
        apower: apower
    };
    let request = {
        url: baseUrl + "/" + data.device_id + "/" + data.switch_id,
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    Shelly.call("HTTP.Request", request, function(response, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch updated. Response:", response.body);
        } else {
            console.log("Update error:", error_message);
        }
    });
}

// DELETE: Remove a switch configuration
function deleteSwitch(switchId) {
    // let url = `${baseUrl}/${deviceInfo.id}/${switchId}`;
    let url = baseUrl + "/" + deviceInfo.id + "/" + switchId;
    let request = {
        url: url,
        method: "DELETE"
    };

    Shelly.call("HTTP.Request", request, function(response, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch deleted.");
        } else {
            console.log("Delete error:", error_message);
        }
    });
}

// Example usage
// createSwitch(1, true, 120, 500); // Create a new switch setting
// readSwitch(1);                  // Read the switch setting
// updateSwitch(1, false, 110, 450); // Update the switch setting
// deleteSwitch(1);                // Delete the switch setting

readSwitch(0);
deleteSwitch(1);

Shelly.addStatusHandler(function(status) {
  if (status.component.substr(0,6) === "switch") {
    let switchStatus = Shelly.getComponentStatus(status.component);
    console.log("New status update for", status.component);
    console.log(switchStatus.id);
    console.log(switchStatus.output);
    console.log(switchStatus.voltage);
    console.log(switchStatus.apower);
    updateSwitch(switchStatus.id, switchStatus.output, switchStatus.voltage, switchStatus.apower);
  }
});