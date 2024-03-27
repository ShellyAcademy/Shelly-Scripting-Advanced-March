console.log("Before sync call");
let inputStatus = Shelly.getComponentStatus("Input:101");
if (inputStatus.percent<50) {
  Shelly.call("Switch.Set", {id:0, on:true});
}
console.log(inputStatus);
console.log("After sync call");

//async calling GetStatus
Shelly.call("Input.GetStatus", { id: 101 }, function(result) {
  console.log(result);
  if (result.percent<50) {
    Shelly.call("Switch.Set", {id:0, on:true});
  }
});
console.log("After calling Input.GetStatus");

let inputConfig= Shelly.getComponentConfig("Input:0")
console.log("Input:0 config:", inputConfig)