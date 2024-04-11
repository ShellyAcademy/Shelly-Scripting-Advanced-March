Shelly.addEventHandler(function(event) {
  if (event.info.event === "EXTERNAL_EVENT") {
    let data = event.info.data;
//    console.log("Processing event from", event.info.data.src,"\n",JSON.stringify(event.info.data));
    if (data.src == "shellyplus2pm-d48afc42bd70" && data.event_type === "status") {
      // on release of the button
      if (data.component === "input:101" && !data.delta.state) {
        console.log("Button release. Toggling the LED light");
        Shelly.call("RGB.Toggle", {id:0});
      }
      // on analog sensor change
      if (data.component === "input:100" && typeof data.delta.percent !== undefined) {
        console.log("Analog sensor changes, setting the brightness to", data.delta.percent);
        Shelly.call("RGB.Set", {id:0, brightness: data.delta.percent});
      }
    }
  }
})
