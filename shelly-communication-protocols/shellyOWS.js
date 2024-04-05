const {WebSocketServer, WebSocket} = require('ws');

const DEBUG = true;

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Shelly Outbound WebSocket
 */
class ShellyOWS {
    handlers = {};
    _idx = 0;
    httpServer = null;
    _clients = {};
    _statuses = {};
    _config = {};
    _requests = {};
    ws = null;

    /**
     * Init ShellyOWS with an existing httpServer
     *
     * @param {http.Server} httpServer
     */
    constructor(httpServer) {
        this.httpServer = httpServer;

        this.init();
    }

    /**
     * Internal method that is called in constructor to initialize
     *
     * @private
     */
    init() {
        this.ws = new WebSocketServer({server: this.httpServer});
        this.ws.on('connection', async (webSocket, request, client) => {
            if (DEBUG) {
                console.error('New connection: ', request.socket.remoteAddress);
            }

            webSocket.on('message', async (message) => {
                message = JSON.parse(message.toString());

                this._clients[message.src] = webSocket;
                webSocket.clientId = message.src;

                let [model, deviceId] = message.src.split("-");

                if (message.method) {
                    let method = message.method;
                    let params = message.params;
                    // console.log('New message', message, model, deviceId, method, params);

                    if (method === "NotifyFullStatus") {
                        this._statuses[message.src] = params;
                        let allConfig = await this.call(message.src, "Shelly.getconfig");
                        // console.error("allConfig", allConfig);
                        this._config[message.src] = allConfig;
                    }
                    else if (method === "NotifyStatus") {
                        this._statuses[message.src] = mergeDeep(this._statuses[message.src] || {}, params);
                    }
                    else if (method === "NotifyEvent") {
                        for (let event of params.events) {
                            if (event.event === "config_changed") {
                                let config = await this.call(message.src, event.component + ".getconfig");
                                // console.error("updated config:", config);
                                this._config[message.src][event.component] = config;
                            }
                        }
                    }


                    // proceed to call handlers
                    if (this.handlers[method]) {
                        this._callHandler(method, message.src, params, webSocket);
                    }
                }
                else if (message.result) {
                    if (message.id && this._requests[message.id]) {
                        this._requests[message.id](message.result);
                    }
                    // TODO: log error/warning?
                }
            });

            await this.call(webSocket, "shelly.getdeviceinfo");

            // console.error("new connection", request.socket.remoteAddress);
        });
        this.ws.on('close', (webSocket) => {
            this._callHandler("OWS::Disconnected", webSocket.clientId, undefined, webSocket);

            delete this._clients[webSocket.clientId];
        })
    }

    /**
     * Internal.
     *
     * @param {string} method
     * @param {string} id
     * @param {Object} params
     * @param {WebSocket} webSocket
     * @private
     */
    _callHandler(method, id, params, webSocket) {
        if (this.handlers[method]) {
            let [model, deviceId] = id.split("-");

            for (let k of Object.keys(this.handlers[method])) {
                let cb = this.handlers[method][k];

                try {
                    cb.call(this, id, params, webSocket, model, deviceId);
                } catch (ex) {
                    console.error("Handler", method, 'thrown error:', ex);
                }
            }
        }
    }

    /**
     * Add new handler
     *
     * @param {string} method
     * @param {Function} cb
     * @returns {number} ID of the handler, that can be used later with `removeHandler`
     */
    addHandler(method, cb) {
        let id = this._idx++;
        if (!this.handlers[method]) {
            this.handlers[method] = {};
        }
        this.handlers[method][id] = cb;
        return id;
    }

    /**
     * Remove handler
     *
     * @param {string} method
     * @param {number} id
     */
    removeHandler(method, id) {
        delete this.handlers[method][id];
    }

    /**
     * Call a RPC on a target device id OR webSocket directly
     *
     * @param {string|WebSocket} deviceIdOrWebSocket
     * @param {string} method
     * @param {Object} params
     * @returns {Promise<never>|Promise<unknown>}
     */
    call(deviceIdOrWebSocket, method, params) {
        let webSocket = deviceIdOrWebSocket instanceof WebSocket ?
            deviceIdOrWebSocket : this._clients[deviceIdOrWebSocket];

        if (!webSocket) {
            // console.error(this._clients);
            return Promise.reject(404);
        }

        return new Promise((res, rej) => {
            let id = this._idx++;
            this._requests[id] = (response) => {
                res(response);
            };
            // todo: timeout

            let req = {"jsonrpc":"2.0", "id": id, "src":"wsserver", "method": method};
            if (params) {
                req['params'] = params;
            }
            // console.debug("Calling:", deviceId, req);
            webSocket.send(JSON.stringify(req));
        });
    }

    /**
     * Return current (in-memory cached) device status
     *
     * @param {string} clientId
     * @returns {*|{}}
     */
    getState(clientId) {
       return this._statuses[clientId] || {};
    }

    /**
     * Return current (in-memory cached) device config
     *
     * @param {string} clientId
     * @returns {*|{}}
     */
    getConfig(clientId) {
        return this._config[clientId] || {};
    }

    /**
     * Update config (also updates local cache)
     *
     * @param {string} clientId
     * @param {string} component
     * @param {Object} config
     * @returns {Promise<*>}
     */
    async setConfig(clientId, component, config) {
        // Since response is returned before the notification, we need to sync our local config first, so that immediate
        // access to config would return the updated data.
        //
        // If you don't want that to happen, feel free to .call Component.SetConfig directly.

        component = component.toLowerCase();

        await this.call(clientId, component + ".setconfig", {'config': config});

        this._config[clientId][component] = mergeDeep(this._config[clientId][component] || {}, config);
        return this._config[clientId][component];
    }

    /**
     * Return ids of all clients currently connected.
     *
     * @returns {string[]}
     */
    getClients() {
        return Object.keys(this._clients);
    }
}

module.exports = ShellyOWS;
