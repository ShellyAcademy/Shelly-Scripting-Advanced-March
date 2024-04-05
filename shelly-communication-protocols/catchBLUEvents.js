Shelly.addEventHandler(function(event) {
    //  console.log(JSON.stringify(event));
      if (event.info.event==="shelly-blu") {
        let addr = event.info.data.address;
        // filter by address of BLU Button
        if (addr==="38:39:8f:8b:54:3a") {
          console.log("Button", event.info.data.button, ", battery:",event.info.data.battery);
          if (event.info.data.button===1) {
            Shelly.call("Switch.Toggle", {id:0});
          }
        } else if (addr==="e8:e0:7e:cb:ad:5d") {
          console.log("Window", event.info.data.window===0?"closed":"open");
        } else if (addr==="38:39:8f:a5:9d:19") {
          console.log("Motion", event.info.data.motion===1?"detected":"not detected");
        }
      }
    });