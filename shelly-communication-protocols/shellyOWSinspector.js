const url = require('url');

/**
 * Utility, that wraps around an `http.Server` and `ShellyOWS` that adds inspection capabilities.
 * Supported GET requests:
 * - /clients - list available clients
 * - /send?clientId=shellypro4pm-083af27b4470&method=Shelly.GetStatus&[params={"test":1}]
 */
class ShellyOWSInspector {
    constructor(httpServer, shellyOws) {
        this.httpServer = httpServer;
        this.shellyOws = shellyOws;
        this.init();
    }
    init() {
        this.httpServer.on('request', async (req, res) => {
            let parsedUrl = url.parse(req.url, true);
            switch (parsedUrl.pathname) {
                case "/clients":
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    let clients = Object.keys(this.shellyOws._clients);
                    res.write(JSON.stringify(clients));
                    res.end();
                    break;

                case "/send":
                    let params = parsedUrl.query;

                    try {
                        let result = await this.shellyOws.call(
                            params.clientId,
                            params.method,
                            params.params ?
                                JSON.parse(params.params) : undefined
                        );

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(result));
                        res.end();
                    }
                    catch (ex) {
                        console.error(ex);

                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({'error': ex}));
                        res.end();
                    }

                    break;

                default:
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.write("404");
                    res.end();
                    break;
            }
        });


    }

}

module.exports = ShellyOWSInspector;
