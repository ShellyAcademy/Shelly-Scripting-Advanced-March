let timerHandler = -1;
Shelly.addEventHandler(function(event) {
  if (event.info.component === "switch:0" &&
      event.info.event === "toggle" &&
      event.info.state === true) {
        console.log("Switch was turned on. Will turn it off in 1 hour.");
        if (timerHandler !== -1) {
          Timer.clear(timerHandler);
        }
        timerHandler = Timer.set(60 * 60 * 1000, false, function() {
          console.log("1 hour passed, turning off the switch");
          Shelly.call("Switch.set", {id:0, on:false});
          timerHandler = -1;
        });
      }
});