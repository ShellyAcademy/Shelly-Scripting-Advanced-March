let CONFIG = {
    SCHEDULE_TIMESPEC: "0 1 0 * * *"
}

function scheduleFunction() {
    Shelly.call("Switch.ResetCounter", { id: 0, type: ["aenergy"] });

    Shelly.call("KVS.Set", { key: "max_daily_energy", value: 2000 });
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
                        code: "scheduleFunction()"
                    }
                }
            ]
        }
    )
}

installSchedule();