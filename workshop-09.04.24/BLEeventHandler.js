let topic = "/myhome/lamp";

function publishMQTT(boolean) {
    message = boolean ? "ON" : "OFF";
    console.log(message);
    let result = MQTT.publish(topic, message);
    if (result) {
        console.log("Message published.");
    } else {
        console.log("Failed to publish message");
    }
}


Shelly.addEventHandler(function (event) {
    if (event.info.event === "BLU_BUTTON") {
        Shelly.call("Switch.GetStatus", { id: 0 }, function (result) {
            let output = result.output;
            publishMQTT(!output);
        })
    }
    if (event.info.event === "BLU_MOTION") {
        let motion = Boolean(event.info.data.Motion);
        publishMQTT(motion);
    }
});