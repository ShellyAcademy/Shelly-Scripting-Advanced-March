// Global configuration for energy thresholds
var energyThresholds = {
  high: 1000, // in Watts
  critical: 1500, // in Watts
};

function sendEmailNotification(apower) {
    const apiKey =
        ""; // YOUR BREVO API KEY
    console.log(apiKey);

    let apiUrl = "https://api.brevo.com/v3/smtp/email";
    let headers = {
        "api-key": apiKey,
    };

    let body = {
        sender: {
            name: "Denis", // Name of the sender
            email: "noreply@shelly.academy", // Email of the sender
        },
        // email can be sent to multiple emails
        to: [
            {
                name: "Denis", // Name of first receiver
                email: "bechiragich97@gmail.com", // Email of first receiver
            },
            {
                name: "Denis", // Name of second receiver
                email: "academyshelly@gmail.com", // Email of second receiver
            },
        ],
        subject: "Energy Consumption Update",
        htmlContent: "<html><body>Dear Alex, In your ongoing quest to optimize energy consumption, here's the latest update: Apower: " + apower + " Watts Keep up the great work in making your home more energy-efficient! Best regards, Denis</body></html>"
    };

    Shelly.call(
        "HTTP.Request",
        {
            method: "POST",
            url: apiUrl,
            headers: headers,
            body: body,
        },
        function (result, errorCode, errorMessage) {
            if (errorCode === 0) {
                console.log("Successfully sent email. Result is:", result.body);
            } else {
                console.log("There was an error sending the email:", errorMessage);
            }
        }
    );
}

// Turn Off Shelly
function turnOffShelly() {
  Shelly.call("Switch.Set", {"id": 0, "on": false});
}

// Define a status handler for monitoring power consumption
Shelly.addStatusHandler(function (status, ud) {
  // Assuming 'status' contains information about power consumption
  console.log(status); // Debugging: Log all status updates
  let component = status["component"];
  // Example of accessing the power measurement for a specific component (e.g., switch:0)
  let apower = status["delta"]["apower"];
  if (component == "switch:0" && apower) {
    console.log("Power measurement update. Power:", apower, "W");
    // Compare the power consumption against predefined thresholds
    if (apower > energyThresholds.critical) {
      console.log("Critical energy consumption detected:", apower, "W");
      sendEmailNotification(apower);
      // Actions for critical threshold crossing, e.g., turning off devices
      turnOffShelly();
      Shelly.call("Switch.Set", { id: 0, on: false });
    } else if (apower > energyThresholds.high) {
      console.log("High energy consumption detected:", apower, "W");
      sendEmailNotification(apower);
      // Actions for high threshold crossing
      turnOffShelly();
    }
  }
}, null);

// Function to adjust energy threshold
function adjustThresholds(high, critical) {
  energyThresholds.high = high;
  energyThresholds.critical = critical;
  console.log(
    "Energy thresholds adjusted. High:",
    high,
    "W, Critical:",
    critical,
    "W"
  );
}


