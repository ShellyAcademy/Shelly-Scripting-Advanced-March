let body = {
    event: "switch.on",
    cid: 0,
    enable: true,
    name: "Turn on light",
    urls: [
      "http://192.168.0.120/light/0?turn=on",
      "http://192.168.0.6/rpc/Switch.Set?id=0&on=true"
    ]
  };
  
  Shelly.call("WebHook.Create", body, function(result) {
    console.log(result);
  });
  
  let body2 = {
    event: "switch.off",
    cid: 0,
    enable: true,
    name: "Turn off light",
    urls: [
      "http://192.168.0.120/light/0?turn=off",
      "http://192.168.0.6/rpc/Switch.Set?id=0&on=false"
    ]
  };
  
  Shelly.call("WebHook.Create", body2, function(result) {
    console.log(result);
  });