Shelly.addEventHandler(function (event) {
    if (event.info.event === "EXTERNAL_EVENT") {
        let data = event.info.data;
        if (data.src === "shellyplusrgbwpm-a0a3b35c70ac" && data.event_type === "status" && data.component === "rgb:0") {
            console.log("Data", data);
            let config = { config: { leds: { colors: { "switch:0": { on: {}, }, }, }, }, }

            if (typeof data.delta.rgb != "undefined") {
                let rgb = data.delta.rgb;

                // convert values to 0-100 range
                rgb[0] = Math.round(rgb[0] / 2.55);
                rgb[1] = Math.round(rgb[1] / 2.55);
                rgb[2] = Math.round(rgb[2] / 2.55);
                config.config.leds.colors["switch:0"].on.rgb = rgb;
            }

            if (typeof data.delta.brightness !== undefined) {
                config.config.leds.colors["switch:0"].on.brightness = data.delta.brightness;
            }

            console.log("Received RGB change event, changing the plug UI config to:", JSON.stringify(config));
            Shelly.call("PLUGS_UI.SetConfig", config);
        }
    }
});