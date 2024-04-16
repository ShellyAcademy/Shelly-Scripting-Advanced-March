let CONFIG = {
    SCHEDULE_TIMESPEC: "0 7 * * * *"
}

function updateSunriseSunset() {
    let result = Shelly.getComponentConfig("sys");

    let lat = result.location.lat;
    let lon = result.location.lon;

    // console.log("Lat:", lat);
    // console.log("Lon:", lon);

    let apiUrl = "https://api.sunrisesunset.io/json?lat=" + lat + "&lng=" + lon;

    Shelly.call("HTTP.Get", { url: apiUrl }, function (result) {
        let response = JSON.parse(result.body);
        let sunrise = response.results.sunrise;
        let sunset = response.results.sunset;

        let url = "http://192.168.0.129:8080/time/update";

        let data = {
            sunrise: sunrise,
            sunset: sunset
        };

        let request = {
            url: url,
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        Shelly.call("HTTP.Request", request, function (result, error_code, error_message) {
            if (error_code === 0) {
                console.log("Successfully updated sunrise and sunset times. Response:", result.body);
            } else {
                console.log("Failed to update sunrise and sunset times. Error:", error_message);
            }
        });
    });
}

function installSchedule() {
    Shelly.call("Schedule.Create", {
        enable: true,
        timespec: CONFIG.SCHEDULE_TIMESPEC,
        calls: [
            {
                method: "script.eval",
                params: {
                    id: Shelly.getCurrentScriptId(),
                    code: "updateSunriseSunset()"
                }
            }
        ]
    }, function (result) {
        console.log(result);
    }
    )
}

installSchedule();