let plugOneDestination = "shellyplusplugs-80646fceadd4";
let plugTwoDestination = "shellyplusplugs-d4d4da344064";
let pmMiniDestionation = "shelly1pmminig3-5432044118bc";
console.log("Hello world!");

function emitDeviceEvent(dst) {
    Shelly.emitEvent("TOGGLE", { dst: dst, id: 0 });
}

Shelly.addEventHandler(function (event) {
    if (event.info.event === "shelly-blu") {
        let addr = event.info.data.address;
        console.log(addr);
        // Button -> 38:39:8f:8b:54:3a
        // Motion -> 38:39:8f:a5:9d:19
        // Door&Window -> e8:e0:7e:cb:ad:5d
        if (addr === "38:39:8f:8b:54:3a") {
            if (event.info.data.button === 4) {
                emitDeviceEvent(plugOneDestination);
                emitDeviceEvent(plugTwoDestination);
                emitDeviceEvent(pmMiniDestionation);
            }
        } else if (addr === "38:39:8f:a5:9d:19") {
            emitDeviceEvent(pmMiniDestionation);
        } else if (addr === "e8:e0:7e:cb:ad:5d") {
            emitDeviceEvent(plugOneDestination);
        }
    }
});