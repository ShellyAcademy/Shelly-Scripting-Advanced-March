console.log("BLE Scanner");

BLE.Scanner.subscribe(function(event, result) {
    if (event === BLE.Scanner.SCAN_RESULT) {
      if (result.addr==="38:39:8f:8b:54:3a") {
        console.log(result);
      }
    }
  });

BLE.Scanner.Start({duration_ms:BLE.Scanner.INFINITE_SCAN, active:true});