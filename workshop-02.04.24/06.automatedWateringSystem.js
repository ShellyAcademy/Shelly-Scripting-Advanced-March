let CONFIG = {
    SCHEDULE_TIMESPEC: "*/30 * * * * *",
    WATERING_DURATION: 30 * 1000 // 5 minutes in milliseconds
}

function startWatering() {
    console.log("Watering started.");

    Timer.set(
        CONFIG.WATERING_DURATION,
        false,
        function () {
            stopWatering();
        }
    )
}


function stopWatering() {
    console.log("Watering stopped.");
}

function installSchedule() {
    Shelly.call(
        "Schedule.Create",
        {
            enable: true,
            timespec: CONFIG.SCHEDULE_TIMESPEC,
            calls: [
                {
                    method: "script.eval",
                    params: {
                        id: Shelly.getCurrentScriptId(),
                        code: "startWatering()"
                    }
                }
            ]
        }
    )
}

installSchedule();