//3 shelly.call in a row (nested calls). there is a limit of about 5 max
//better use Shelly.getComponentStatus here to make less async calls
Shelly.call("Input.GetStatus", {id: 101}, function(result) {
    if (result.precent<50) {
      Shelly.call("Switch.GetStatus", {id:0}, function(result2) {
        if (result2.apower > 1500) {
          Shelly.call("Switch.Set", {id: 0, on:false}, function (result3) {
            console.log(result3);
          })
        }
      })
    }
  })