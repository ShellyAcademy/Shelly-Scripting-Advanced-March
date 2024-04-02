let CONFIG = {
    SCHEDULE_SUNRISE: "@sunrise",
    SCHEDULE_SUNSET: "@sunset"
}

function installSchedule(timespec, state) {
    Shelly.call(
        "Schedule.Create",
        {
            enable: true,
            timespec: timespec,
            calls: [
                {
                    method: "Switch.Set",
                    params: {
                        id: 0,
                        on: state
                    }
                }
            ]
        }
    )
}

installSchedule(CONFIG.SCHEDULE_SUNRISE, false);
installSchedule(CONFIG.SCHEDULE_SUNSET, true);