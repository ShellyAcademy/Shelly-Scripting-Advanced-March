console.log("Subscribing to topic");

MQTT.subscribe("office/events/rpc", function(topic, message) {
  //console.log(message);
  message = JSON.parse(message);
  if (message.src === "shelly1pmminig3-5432044118bc" && message.method==="NotifyEvent") {
    for (let i=0; i<message.params.events.length; i++) {
      let event = message.params.events[i];
      if (event.event==="single_push") {
        console.log("Single push event");
        Shelly.call("Switch.Toggle", {id:1});
      }
    }
  }
});