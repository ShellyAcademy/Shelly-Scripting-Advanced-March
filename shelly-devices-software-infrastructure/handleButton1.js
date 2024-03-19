console.log("Handling button 1");
Shelly.addEventHandler(function(eventData) {
  if (eventData.info.event==="BLU_BUTTON") {
    let button = eventData.info.data.Button;
    let battery = eventData.info.data.Battery;
    if (button===1) {
      console.log("Button 1 was pressed. Battery is", battery);
    }
  }
})