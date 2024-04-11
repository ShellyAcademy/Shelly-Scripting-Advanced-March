Shelly.addEventHandler(function(event) {
  if (event.info.event==="EXTERNAL_EVENT") {
    let data = event.info.data;
    if (data.src === "shellyplus2pm-d48afc42bd70" && data.event_type==="event" &&
        (data.component === "input:101" || data.info.event==="BLU_BUTTON") ) {
      console.log("Button pressed, toggling the switch");
      Shelly.call("Light.Toggle", {id:0});
    }
    if (data.src === "shellyplus2pm-d48afc42bd70" && data.event_type==="status" &&
        data.component === "input:100") {
      console.log("Analog input changed value to", data.delta.percent);
      Shelly.call("Light.Set", {id:0, brightness: data.delta.percent});
    }

  }
})