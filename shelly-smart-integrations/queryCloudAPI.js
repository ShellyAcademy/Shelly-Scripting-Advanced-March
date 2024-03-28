let deviceId = "98cdac2c8746";
let authKey = "MjJlNmY5dWlk95D8F5AACA3308A863DB6BEEAB3B1D0FBACFE8107E0ADE093715C3044200B76F201C8A7EC393E5F5";
let statusUrl = "https://shelly-97-eu.shelly.cloud/device/status?id=" + deviceId + "&auth_key=" + authKey;

let params = {
  url: statusUrl
}
Shelly.call("HTTP.GET", params, function(result) {
  let body = JSON.parse(result.body);
  console.log("on:",body.data.device_status.lights[0].ison,
              ", brightness:", body.data.device_status.lights[0].brightness)
})