let max_daily_energy;

Shelly.addEventHandler(function (event) {
    if (event.info.component == "switch:0") {
        if (event.info.event == "toggle") {
            Shelly.call("KVS.Get", { key: "max_daily_energy" }, function (result) {
                max_daily_energy = result.value;

                Shelly.call("Switch.GetStatus", { id: 0 }, function (result) {
                    console.log("RESULT FROM GET STATUS", result);
                    let aenergyTotal = result.aenergy.total;
                    if (aenergyTotal > max_daily_energy) {
                        console.log("Turning off the device...");
                        Shelly.call("Switch.Set", { id: 0, on: false });
                    }
                });
            });
        }
    }
});