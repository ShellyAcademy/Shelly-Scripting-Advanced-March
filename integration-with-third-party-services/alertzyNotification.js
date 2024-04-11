let apiKey = "7r4nrzw7ree7kor";
let baseUrl = "https://alertzy.app/send";
let title = "Motion%20Detected";
let message = "Motion%20was%20detected%20in%20living%20room!";

let url = baseUrl + "?accountKey=" + apiKey + "&title=" + title + 
          "&message=" + message + "&priority=2&link=http://192.168.0.30/rpc/Switch.Toggle?id=0";

Shelly.call("HTTP.GET", { url: url }, function(response, error_code, error_message) {
  if (error_code===0) {
    console.log("Success:", response.body);
  } else {
    console.log("Error:", error_message);
  }
});