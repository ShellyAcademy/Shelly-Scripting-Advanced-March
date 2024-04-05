MQTT.subscribe("custom_topic/topic1", function(topic, message) {
    message = JSON.parse(message);
    if (message.event === "TOGGLE") {
      Shelly.call("Switch.Toggle", {id:0});
    }
  })