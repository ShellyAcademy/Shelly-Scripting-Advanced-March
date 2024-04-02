let CONFIG = {
    KVS_KEY: "Script-Schedule-" + Shelly.getCurrentScriptId(),
    SCHEDULE_TIMESPEC: "*/10 * * * * *",
    SCHEDULE_ID: -1,
    CALLBACK: "scheduledTask()"
};

function registerIfNotRegistered() {
    console.log("Inside func")
    Shelly.call("KVS.Get", { key: CONFIG.KVS_KEY }, function (result, error_code, error_message) {
        if (error_code != 0) {
            console.log("Schedule is not created yet. Install schedule.");
            installSchedule();
            return;
        }
        // if KVS KEY is there, read the schedule id
        CONFIG.SCHEDULE_ID = result.value;
        console.log("Schedule with id", CONFIG.SCHEDULE_ID, "already created");
        // check if the  schedule still exists
        // if not install it
        Shelly.call("Schedule.List", {}, function (result) {
            for (let i = 0; i < result.jobs.length; i++) {
                console.log(result.jobs[i].id);
                if (result.jobs[i].id === CONFIG.SCHEDULE_ID) return;
            }
            console.log("Schedule ID", CONFIG.SCHEDULE_ID, "not found. Installing new schedule");
            installSchedule();
        });
    });
}

function saveScheduleIDInKVS(scheduleID) {
    Shelly.call("KVS.Set", { key: CONFIG.KVS_KEY, value: scheduleID });
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
                        code: CONFIG.CALLBACK
                    }
                }
            ]
        },
        function (result) {
            // save a record that we are registered
            CONFIG.SCHEDULE_ID = result.id;
            console.log("New schedule with ID", CONFIG.SCHEDULE_ID, "installed");
            saveScheduleIDInKVS(result.id);
        }

    )
}

function scheduledTask() {
    console.log("I am called by a schedule.");
}

registerIfNotRegistered();