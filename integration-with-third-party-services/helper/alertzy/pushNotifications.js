Shelly.call(
  "HTTP.GET",
  {
    url: "https://alertzy.app/send?accountKey=t24tvwvmp2wor93&title=Alert&message=MotionDetected" 
  },
  function (result, error_code, error_message) {
    // Check if the request was successful
    if (error_code === 0) {
      console.log("Success:", result.body);
    } else {
      // Handle errors
      console.log("Error sending GET request:", error_message);
    }
  }
);