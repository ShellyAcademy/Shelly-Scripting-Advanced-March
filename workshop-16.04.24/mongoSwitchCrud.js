const baseUrl = "http://192.168.0.129:8080/switch";
const deviceInfo = Shelly.getDeviceInfo();

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
    }

    Shelly.call("HTTP.Request", request, function (result, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch created. Response: ", result.body);
        } else {
            console.log("Create error: ", error_message);
        }
    })
}

function readSwitch(switchId) {
    let url = baseUrl + "/" + deviceInfo.id + "/" + switchId;

    let request = {
        url: url,
        method: "GET"
    }
    Shelly.call("HTTP.Request", request, function (result, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch data:", result.body);
        } else {
            console.log("Read error: ", error_message);
        }
    })
}

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
    }

    Shelly.call("HTTP.Request", request, function (result, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch updated. Response:", result.body);
        } else {
            console.log("Update error:", error_message);
        }
    });
}

function deleteSwitch(switchId) {
    let url = baseUrl + "/" + deviceInfo.id + "/" + switchId;

    let request = {
        url: url,
        method: "DELETE"
    }

    Shelly.call("HTTP.Request", request, function (result, error_code, error_message) {
        if (error_code === 0) {
            console.log("Switch deleted");
        } else {
            console.log("Delete error: ", error_message);
        }
    })

}

// readSwitch(0);

deleteSwitch(0);

Shelly.addStatusHandler(function (status) {
    if (status.component.substr(0, 6) === "switch") {
        let switchStatus = Shelly.getComponentStatus(status.component);
        console.log("New status update for:", status.component);
        // createSwitch(switchStatus.id, switchStatus.output, switchStatus.voltage, switchStatus.apower);
        // updateSwitch(switchStatus.id, switchStatus.output, switchStatus.voltage, switchStatus.apower);
    }
});