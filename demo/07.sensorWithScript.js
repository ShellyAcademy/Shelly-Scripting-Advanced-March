const SHELLY_PLUS_2PM_IP = "172.20.10.4";
// let url = 'http://' + SHELLY_PLUS_2PM_IP + '/rpc/SensorAddon.AddPeripheral?type="ds18b20"&attrs={"cid":100, "addr": "40:70:103:129:227:228:60:191"}';
let url = 'http://' + SHELLY_PLUS_2PM_IP + '/rpc/SensorAddon.AddPeripheral?type="ds18b20"&attrs={"cid":100,%20"addr":%20"40:70:103:129:227:228:60:191"}';

Shelly.call("HTTP.GET", {url: url}, function(result) {
  console.log(result);
});
