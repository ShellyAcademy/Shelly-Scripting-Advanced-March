console.log("Handling button 2");
Shelly.addEventHandler(function(eventData) {
  if (eventData.info.event==="BLU_BUTTON") {
    let button = eventData.info.data.Button;
    let battery = eventData.info.data.Battery;
    if (button===2) {
      console.log("Button 2 was pressed. Battery is", battery);
    }
  }
})