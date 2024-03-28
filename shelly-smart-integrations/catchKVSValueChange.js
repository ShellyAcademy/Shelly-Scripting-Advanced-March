console.log("starting");
let etag = "";
Shelly.addStatusHandler(function(status) {
    if (status.component==="sys" && typeof(status.delta.kvs_rev)!==undefined) {
      Shelly.call("KVS.Get", {key:"Temperature"}, function(result) {
        let newEtag = result.etag;
        if (etag != newEtag) {
           etag = newEtag;
           console.log("New temperature is", result.value);
        }
      });
    }
})