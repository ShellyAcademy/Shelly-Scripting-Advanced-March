console.log("Script is running...");
let tempThreshold = 10;

function mqttPublisher(state) {
    MQTT.publish("office/command/switch:0", state);
}

HTTPServer.registerEndpoint("temperature_endpoint", function (request, response) {
    if (request.method === "GET") {
        let queryParams = parseQueryParams(request.query);
        let temperature = Number(queryParams.temperature);
        console.log("Temperature is:", temperature);
        if (temperature > tempThreshold) {
            mqttPublisher("off");
        } else {
            mqttPublisher("on");
        }
        response.code = 200;
        response.headers = [["Content-Type", "text/plain"]];
        response.body = temperature;
        response.send();
    }
})


function parseQueryParams(queryString) {
    console.log(queryString);
    let queryParams = {};
    let pairs = queryString.split("&");
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split("=");
        let key = pair[0];
        let value = pair[1];
        queryParams[key] = value;
    }
    return queryParams;
}