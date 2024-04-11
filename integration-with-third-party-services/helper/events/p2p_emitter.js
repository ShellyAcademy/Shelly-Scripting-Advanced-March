//Sending Event
//---------------------------------------------------------

let CONFIG = {
  EVENT_FILTER_KVS_KEY: "emit_event_filter",
  STATUS_FILTER_KVS_KEY: "emit_status_filter",
  EVENT_PEERS_KVS_KEY: "emit_event_peers",
  URL_SUFFIX: "/events",
  EXTERNAL_EVENT_NAME: "EXTERNAL_EVENT",
  EVENT_TYPE_EVENT: "event",
  EVENT_TYPE_STATUS: "status",

  DEBUG: false,

  eventFilter: {filter:"false"},
  statusFilter: {filter:"false"},
  eventPeers: [],
  deviceId: -1
};

CONFIG.deviceId = Shelly.getDeviceInfo().id;

function readConfigFromKVS(key, configField) {
  Shelly.call("KVS.GET", {key: key}, function(result) {
    try {
      if (CONFIG.DEBUG)
        console.log("Reading KVS key", key, "returned:", result);

      CONFIG[configField] = JSON.parse(result.value);
    } catch(e) {
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

  // send the event to the local system to be handled locally too
  emitLocalEvent(event);
  
  for (peer of CONFIG.eventPeers) {
    let requestOptions = {
      url: peer + CONFIG.URL_SUFFIX,
      body: JSON.stringify(event)
    };

    if (CONFIG.DEBUG)
      console.log("Sending event to",requestOptions.url,"\nEven data:", requestOptions.body)
    console.log("Sending event to",requestOptions.url);
    Shelly.call("HTTP.POST", requestOptions, function (response, error_code, error_message) {
      if (error_code === 0) {
        if (CONFIG.DEBUG)
          console.log("Response:", response.body);
      } else {
          console.log("Error:", error_message);
      }
    });
  }
}

Shelly.addEventHandler(function (event) {
  if (typeof CONFIG.eventFilter.filter !== undefined && eval(CONFIG.eventFilter.filter)) {
    if (CONFIG.DEBUG)
      console.log("Sending event", event.info.event, "to peers");
    sendEventToExternalDevice(event, CONFIG.EVENT_TYPE_EVENT);
  }
});

Shelly.addStatusHandler(function(status) {
  if (typeof CONFIG.statusFilter.filter !== undefined && eval(CONFIG.statusFilter.filter)) {
    if (CONFIG.DEBUG)
      console.log("Sending status change for ", status.component, "to peers");
    sendEventToExternalDevice(status, CONFIG.EVENT_TYPE_STATUS);
  }
});
