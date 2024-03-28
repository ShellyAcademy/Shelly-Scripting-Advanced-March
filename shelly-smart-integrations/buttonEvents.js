console.log("Starting");
Shelly.addEventHandler(function(event) {
  if (event.component==="input:0" && event.info.event==="triple_push") {
    console.log("Triple push event")  
  }
  
})