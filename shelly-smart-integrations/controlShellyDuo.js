let url = "http://192.168.0.120/light/0?turn=on&temp=2800&brightness=20"

Shelly.call("HTTP.GET", {url: url});