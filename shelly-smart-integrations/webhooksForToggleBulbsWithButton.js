let body = {
    event: "input.button_push",
    cid: 0,
    enable: true,
    name: "Toggle lights",
    urls: [
      "http://192.168.0.120/light/0?turn=toggle",
      "http://192.168.0.6/rpc/Switch.Toggle?id=0"
    ]
  };
  
  Shelly.call("WebHook.Create", body, function(result) {
    console.log(result);
  });