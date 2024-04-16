let settings = {
    rgb: [0, 0, 0],
    brightness: 0
};


const BUTTON_MAP = {
    3: 0, // Red
    2: 1, // Green
    1: 2 // Blue
}

const BRIGHTNESS_COMPONENT_ID = 0;

function updateRGBW() {
    Shelly.call("RGB.Set", {
        id: 0,
        rgb: settings.rgb,
        brightness: settings.brightness
    });
}

Shelly.addEventHandler(function (event) {
    if (typeof event === undefined || typeof event.info === undefined ||
        (event.info.event !== "single_push" && event.info.event !== "double_push" && event.info.event !== "long_push")) {
        return;
    }
    let componentId = event.info.id;
    let eventType = event.info.event;

    let step;
    if (eventType === "single_push") {
        step = 10;
    } else if (eventType === "double_push") {
        step = -10;
    } else if (eventType === "long_push") {
        step = 50;
    }

    if (componentId === BRIGHTNESS_COMPONENT_ID) {
        settings.brightness += step;
        if (settings.brightness > 100) settings.brightness = 100;
        if (settings.brightness < 0) settings.brightness = 0;
    } else {
        let rgbIndex = BUTTON_MAP[componentId];

        settings.rgb[rgbIndex] += step;

        if (settings.rgb[rgbIndex] > 255) settings.rgb[rgbIndex] = 255;
        if (settings.rgb[rgbIndex] < 0) settings.rgb[rgbIndex] = 0;
    }

    updateRGBW();
});

updateRGBW();