function temperatureMessageReceived(topic, message) {
    if (topic === "office/topic1") {
        console.log(message);
        let result = JSON.parse(message);
        let state = result.state;
        if (state === "off") {
            Shelly.call("Switch.Set", { id: 0, on: false });
        }
    }
}

MQTT.subscribe("office/topic1", temperatureMessageReceived);