const scenes = {
    Relax: { rgb: [0, 128, 255], brightness: 50 },
    Energy: { rgb: [255, 165, 0], brightness: 100 },
    Party: { rgb: [255, 0, 255], brightness: 75 }
};

Shelly.addEventHandler(function (event) {
    if (event.info.event === "BLU_BUTTON") {
        let scene;
        if (event.info.data.Button === 1) {
            scene = "Relax";
        } else if (event.info.data.Button === 2) {
            scene = "Energy";
        } else if (event.info.data.Button === 3) {
            scene = "Party";
        }

        if (scene) {
            let settings = scenes[scene];

            Shelly.call("RGB.Set", {
                id: 0,
                rgb: settings.rgb,
                brightness: settings.brightness
            });
        }
        console.log("Scene set to " + scene + ": Color RGB(" + settings.rgb[0] + ", " + settings.rgb[1] + ", " + settings.rgb[2] + ")");
    }
});