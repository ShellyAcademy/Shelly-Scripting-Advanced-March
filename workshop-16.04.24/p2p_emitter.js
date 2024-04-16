//Sending Events
//---------------------------------------------------------

let CONFIG = {
    EVENT_FILTER_KVS_KEY: "emit_event_filter",
    STATUS_FILTER_KVS_KEY: "emit_status_filter",
    EVENT_PEERS_KVS_KEY: "emit_event_peers",
    URL_SUFFIX: "/events",
    EXTERNAL_EVENT_NAME: "EXTERNAL_EVENT",
    EVENT_TYPE_EVENT: "event",
    EVENT_TYPE_STATUS: "status",
    EVENT_CHANGE_CONFIG: "config_changed",
    MAX_QUERIES: 3,
    SENDER_TIMER_PERIOD: 1000,
    HTTP_TIMEOUT: 5,

    DEBUG: false,

    eventFilter: { filter: "false" },
    statusFilter: { filter: "false" },
    eventPeers: [],
    deviceId: -1
};

let callQueue = [];
let runningCalls = 0;
let timerHandle = -1;

CONFIG.deviceId = Shelly.getDeviceInfo().id;

function readConfigFromKVS(key, configField) {
    Shelly.call("KVS.GET", { key: key }, function (result) {
        try {
            if (CONFIG.DEBUG)
                console.log("Reading KVS key", key, "returned:", result);

            CONFIG[configField] = JSON.parse(result.value);
        } catch (e) {
            console.log("Error processing", key, ":", e)
        }
    });
}

readConfigFromKVS(CONFIG.EVENT_FILTER_KVS_KEY, "eventFilter");
readConfigFromKVS(CONFIG.STATUS_FILTER_KVS_KEY, "statusFilter");
readConfigFromKVS(CONFIG.EVENT_PEERS_KVS_KEY, "eventPeers");

function emitLocalEvent(event) {
    if (CONFIG.DEBUG)
        console.log("Emiting external event:", event);
    Shelly.emitEvent(CONFIG.EXTERNAL_EVENT_NAME, event);
}

function sendEventToExternalDevice(event, eventType) {
    // add src to the event
    event.src = CONFIG.deviceId;
    event.event_type = eventType;

    // if config was changed include the config for the component as part of the message
    if (eventType === CONFIG.EVENT_TYPE_EVENT && event.info.event === CONFIG.EVENT_CHANGE_CONFIG) {
        let component;
        if (event.id === -1) {
            component = event.component;
        } else {
            component = event.component + ":" + event.id;
        }
        event.config = Shelly.getComponentConfig(component);
    }

    // send the event to the local system to be handled locally too
    emitLocalEvent(event);
    for (peer of CONFIG.eventPeers) {
        let requestOptions = {
            url: peer + CONFIG.URL_SUFFIX,
            timeout: CONFIG.HTTP_TIMEOUT,
            body: JSON.stringify(event)
        };

        if (CONFIG.DEBUG)
            console.log("Sending event to", requestOptions.url, "\nEven data:", requestOptions.body);

        sendPost(requestOptions);
    }
}

Shelly.addEventHandler(function (event) {
    if (typeof event != "undefined" && typeof event.info != "undefined" &&
        event.info.event !== CONFIG.EXTERNAL_EVENT_NAME && typeof CONFIG.eventFilter.filter != "undefined" &&
        eval(CONFIG.eventFilter.filter)) {
        if (CONFIG.DEBUG)
            console.log("Sending event", event.info.event, "to peers");
        sendEventToExternalDevice(event, CONFIG.EVENT_TYPE_EVENT);
    }
});

Shelly.addStatusHandler(function (status) {
    if (typeof status != "undefined" && typeof CONFIG.statusFilter.filter != "undefined" &&
        eval(CONFIG.statusFilter.filter)) {
        if (CONFIG.DEBUG)
            console.log("Sending status change for ", status.component, "to peers");
        sendEventToExternalDevice(status, CONFIG.EVENT_TYPE_STATUS);
    }
});

function sendPost(requestOptions) {
    callQueue.push(requestOptions);
    processCalls({ timer_flag: false });
}

function postUrl(requestOptions) {
    runningCalls++;
    Shelly.call("HTTP.POST", requestOptions, function (response, error_code, error_message) {
        if (error_code === 0) {
            if (CONFIG.DEBUG)
                console.log("Response:", response.body);
        } else {
            console.log("Error:", error_message);
        }
        runningCalls--;
    });
}

function processCalls(data) {
    if (data.timer_flag) {
        timerHandle = -1;
    }

    while (runningCalls < CONFIG.MAX_QUERIES && callQueue.length > 0) {
        // dequeue a request from the callQueue
        let request = callQueue.splice(0, 1)[0];
        if (CONFIG.DEBUG)
            console.log("Extracting data from queue and sending:", request);
        postUrl(request);
    }

    if (timerHandle === -1 && callQueue.length > 0) {
        timerHandle = Timer.set(CONFIG.SENDER_TIMER_PERIOD, false, processCalls, { timer_flag: true });
    }
}