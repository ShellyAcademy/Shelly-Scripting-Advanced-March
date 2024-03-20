// The Queue is defined using a constructor function. 
// This is a more classical way to create objects, especially if you come from a class-based language. 
// You create new instances of Queue using the new keyword, and each instance will have its own set of the defined properties and methods.
function Queue() {
  this.items = [];

  this.isEmpty = function () {
    return this.items.length === 0;
  };
 
  this.enqueue = function (element) {
    this.items.push(element);
  };
  
 
  this.dequeue = function () {
    if (this.isEmpty()) {
      return 'Queue is empty';
    }
    return this.items.splice(0, 1)[0];
  };
 
  this.size = function () {
    return this.items.length;
  };
 
  this.front = function () {
    if (this.isEmpty()) {
      return 'Queue is empty';
    }
    return this.items[0];
  };
}
 
// Assuming Timer.set and Timer.clear are API functions provided by Shelly
var activeTimers = [];
var timerQueue = new Queue();
const MAX_TIMERS = 5;

// The zone object is created using the object literal notation. 
// It's a single object with properties and an init method
let zone = {
  id: null,
  size: null,
  duration: null,
  timerHandle: null,
  init: function(id, size) {
    this.id = id;
    this.size = size;
    this.duration = size * 1000;
  }
}

// Function to start watering a zone
function startWatering(zone) {
  console.log('Watering zone:', zone.id);
  // Placeholder for actual pump activation code
}

// Function to stop watering a zone
function stopWatering(zone) {
  console.log('Stopping watering zone:', zone.id);
  // Placeholder for actual pump deactivation code
}

function setPump(zone) {
  if (activeTimers.length < MAX_TIMERS) {
    zone.timerHandle = Timer.set(zone.duration, false, function() {
      stopWatering(zone);
      clearPump(zone.timerHandle)
      checkAndStartQueuedTimer();
    }, null);
    activeTimers.push(zone.timerHandle);
    startWatering(zone);
    return zone.timerHandle;
  } else {
    timerQueue.enqueue(zone);
    return null;
  }
}
 
function clearPump(timerHandle) {
  //activeTimers = activeTimers.filter(timer => timer !== timerHandle);
   var newActiveTimers = [];
    for (var i = 0; i < activeTimers.length; i++) {
        if (activeTimers[i] !== timerHandle) {
            newActiveTimers.push(activeTimers[i]);
        }
    }
    activeTimers = newActiveTimers;
    Timer.clear(timerHandle);
}
 
function checkAndStartQueuedTimer() {
  if (!timerQueue.isEmpty() && activeTimers.length < MAX_TIMERS) {
    var zone = timerQueue.dequeue();
    setPump(zone);
  }
}

// Initialize zones
var zones = [];
for (let i = 1; i <= 10; i++) {
  let currentZone = Object.create(zone);
  currentZone.init(i, i + 2);
  zones.push(currentZone);
}

// Schedule watering for each zone
for (let zone of zones) {
  setPump(zone);
}
