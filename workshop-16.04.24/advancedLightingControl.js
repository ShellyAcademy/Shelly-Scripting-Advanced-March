let brightness = 0;

// 38:39:8f:ee:ba:57
// 38:39:8f:a5:9d:19

Shelly.addEventHandler(function (event) {
    if (event.info.event === "BLU_MOTION") {
        if (event.info.data.Motion === 1) {
            if (brightness < 50) {
                brightness = 50;
                console.log("Setting brightness to 50%");
                Shelly.call("Light.Set", { id: 0, brightness: brightness });
            } else {
                console.log("Brightness:", brightness);
                brightness = 100;
                Shelly.call("Light.Set", { id: 0, brightness: brightness });
            }
        } else if (event.info.data.Motion === 0) {
            brightness -= 50;
            Shelly.call("Light.Set", { id: 0, brightness: brightness });
        }
    }
})