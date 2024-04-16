Shelly.addEventHandler(function (event) {
    if (event.info.event === "EXTERNAL_EVENT") {
        let data = event.info.data;
        if (data.src === "shellyplusrgbwpm-a0a3b35c70ac" && data.event_type === "status" &&
            data.component === "rgb:0" && typeof data.delta.brightness != "undefined") {
            console.log("Received RGB change event, chaning the brightness to:", data.delta.brightness);
            Shelly.call("Light.Set", { id: 0, brightness: data.delta.brightness });
        }
    }
})