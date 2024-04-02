const TEMPERATURE_THRESHOLD = 20;
const HUMIDITY_THRESHOLD = 30;
const PLUG_IP = "192.168.0.150";
console.log("Hello World!");

function storeThresholdInKVS() {
    Shelly.call("KVS.Set", { key: "tempThreshold", value: TEMPERATURE_THRESHOLD });

    Shelly.call("KVS.Set", { key: "humidityThreshold", value: HUMIDITY_THRESHOLD });
}

storeThresholdInKVS();

Shelly.addStatusHandler(function (status) {
    if (status.component == "number:200") {
        let tempValue = Number(status.delta.value);
        Shelly.call("KVS.Get", { key: "tempThreshold" }, function (result) {
            console.log(result);
            let tempThreshold = Number(result.value);
            if (tempValue > tempThreshold) {
                Shelly.call("Switch.Set", { id: 0, on: false });
            } else {
                Shelly.call("Switch.Set", { id: 0, on: true });
            }
        })
    } else if (status.component == "number:201") {
        let humidityValue = Number(status.delta.value);
        Shelly.call("KVS.Get", { key: "humidityThreshold" }, function (result) {
            let humidityThreshold = Number(result.value);
            if (humidityValue > humidityThreshold) {
                let url = "http://" + PLUG_IP + "/rpc/Switch.Set?id=0&on=true";
                Shelly.call("HTTP.GET", { url: url }, function (result) {
                    console.log(result);
                })
            } else {
                let url = "http://" + PLUG_IP + "/rpc/Switch.Set?id=0&on=false";
                Shelly.call("HTTP.GET", { url: url }, function (result) {
                    console.log(result);
                })
            }
        })
    }
});