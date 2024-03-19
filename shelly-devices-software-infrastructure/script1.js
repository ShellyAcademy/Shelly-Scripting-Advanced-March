let userData = { info: "description" }
let timerHandle = Timer.set(1000, true, function(ud) {
    console.log("timer click", ud);
    Shelly.call("Switch.GetStatus", {id: 0}, function(result, ud) {
      console.log(result.apower)
      // check apower and do something in some cases
    }, ud);
  }, userData
);