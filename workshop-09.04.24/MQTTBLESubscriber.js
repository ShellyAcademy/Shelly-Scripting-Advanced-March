let CONFIG = {
    lampAction: "/myhome/lamp"
};

function lampMessageReceived(topic, message) {
    if (topic === CONFIG.lampAction) {
        if (message === "ON") {
            Shelly.call("Switch.Set", { id: 0, on: true });
        } else if (message === "OFF") {
            Shelly.call("Switch.Set", { id: 0, on: false });
        }
    }
}

MQTT.subscribe(CONFIG.lampAction, lampMessageReceived);