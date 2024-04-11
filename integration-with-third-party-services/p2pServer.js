//Receive Event
//---------------------------------------------------------
//Server
const DEBUG = false;
const EXTERNAL_EVENT_NAME = "EXTERNAL_EVENT";
const URL = "events"

HTTPServer.registerEndpoint(URL, function (request, response) {
  if (request.method === "POST") {
    try {
      let data = JSON.parse(request.body);
      response.code = 200;
      response.headers = [["Content-Type", "application/json"]];
      response.body = JSON.stringify({ status: "success", message: "Data processed", content: data });
      response.send(true);
      proccessExternalEvent(data);
    } catch (e) {
      response.code = 400;
      response.headers = [["Content-Type", "application/json"]];
      response.body = JSON.stringify({ status: "error", message: "Invalid request" });
      response.send(true);
    }
  } else {
    response.code = 405;
    response.send(true);
  }
});

//Emiting receivet object as event
function proccessExternalEvent(eventData) {
  if (DEBUG)
    console.log("Emiting external event:", eventData);
  Shelly.emitEvent(EXTERNAL_EVENT_NAME, eventData);
}