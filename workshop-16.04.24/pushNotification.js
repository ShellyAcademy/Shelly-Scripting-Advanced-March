let accountKey = "{your_acc_key}";
let title = "Alert";
let message;
let date = "";
let attrs = {};
let url = "https://alertzy.app/send";

function storeInKvs() {
    let hourObj = {
        min: 9,
        max: 22
    }
    Shelly.call("KVS.Set", { key: "hour", value: hourObj });
}

// storeInKvs();

function prepareMessage(message) {
    return message.split(" ").join("%20");
}

function sendPushNotification(attrs) {
    let request = {
        url: url,
        content_type: "application/x-www-form-urlencoded",
        body:
            "accountKey=" +
            attrs.accountKey +
            "&title=" +
            attrs.title +
            "&message=" +
            attrs.message
    }

    Shelly.call("HTTP.POST", request, function (result) {
        console.log(JSON.parse(result.body));
    });
}

// 38:39:8f:a5:9d:19
Shelly.addEventHandler(function (event) {
    attrs["accountKey"] = accountKey;
    attrs["title"] = title;

    let now = new Date();
    let hour = now.getHours();

    Shelly.call("KVS.Get", { key: "hour" }, function (result) {
        let minHour = result.value.min;
        let maxHour = result.value.max;

        if (minHour > maxHour) {
            let buffer = minHour;
            minHour = maxHour;
            maxHour = buffer;
        }

        if (hour >= minHour && hour <= maxHour) {
            let addr = event.info.data.address;

            if (addr === "38:39:8f:a5:9d:19") {
                if (event.info.data.motion === 1) {
                    message = "Motion";
                } else if (event.info.data.motion === 0) {
                    message = "Motion not";
                }

                let timeStamp = new Date(event.info.ts * 1000);
                attrs["message"] = prepareMessage(
                    message + " detected at: " + formatDateToCustomString(timeStamp)
                );
                sendPushNotification(attrs);
            } else if (addr === "e8:e0:7e:cb:ad:5d") {
                if (event.info.data.window === 1) {
                    message = "DoorWindow triggered (state: opened) at: ";
                } else if (event.info.data.window === 0) {
                    message = "DoorWindow not triggered (state: closed) at: ";
                }

                let timeStamp = new Date(event.info.ts * 1000);

                attrs["message"] = prepareMessage(
                    message + formatDateToCustomString(timeStamp)
                );

                sendPushNotification(attrs);
            }
        }
    })
});


function formatDateToCustomString(date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    // Formatting the date
    let dayName = days[date.getDay()];
    let monthName = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let formattedDate =
        dayName +
        " " +
        monthName +
        " " +
        day +
        " " +
        year +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
    return formattedDate;
}