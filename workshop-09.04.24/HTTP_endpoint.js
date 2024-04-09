HTTPServer.registerEndpoint("my_custom_endpoint", function (request, response) {
    if (request.method === "GET") {
        let queryParams = parseQueryString(request.query);
        response.headers = [["Content-Type", "text/plain"]];
        response.body = "My name is " + queryParams.name;
        response.code = 200;
        response.send()
    } else if (request.method === "POST") {
        try {
            let data = JSON.parse(request.body);
            console.log("Received data", data);
            response.code = 200;
            response.headers = [["Content-Type", "application/json"]];
            response.body = JSON.stringify({ status: "success", message: "Data processed", content: data });
            response.send();
        } catch (e) {
            response.code = 400;
            response.headers = [["Content-Type", "application/json"]];
            response.body = JSON.stringify({ status: "error", message: "There was an error" });
            response.send();
            console.log("There was an error");
        }
    }
});


function parseQueryString(queryString) {
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