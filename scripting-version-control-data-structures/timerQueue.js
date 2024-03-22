function Queue() {
    this.items = [];
   
    this.enqueue = function (element) {
      this.items.push(element);
    };
   
    this.dequeue = function () {
      if (this.isEmpty()) {
        return 'Queue is empty';
      }
      return this.items.splice(0, 1)[0];
    };
   
    this.isEmpty = function () {
      return this.items.length === 0;
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
   
  // Timer Call Stack Limitation Handling Using Queue
  var activeTimers = [];
  var timerQueue = new Queue(); // Using Queue to manage the timer queue
   
  const MAX_TIMERS = 5;
   
  function setTimer(duration, callback, userdata) {
      if (activeTimers.length < MAX_TIMERS) {
          var timerHandle = Timer.set(duration, false, function(ud) {
              callback(ud);
              clearTimer(timerHandle);
              checkAndStartQueuedTimer();
          }, userdata);
          activeTimers.push(timerHandle);
          return timerHandle;
      } else {
          timerQueue.enqueue({duration: duration, callback: callback, userdata: userdata});
          return null;
      }
  }
   
  function clearTimer(timerHandle) {
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
          var timerInfo = timerQueue.dequeue();
          if (timerInfo !== null) {
              setTimer(timerInfo.duration, timerInfo.callback, timerInfo.userdata);
          }
      }
  }
   
  // Usage example
  setTimer(5000, function() {
      console.log('First Timer');
  }, null);
   
  // More setTimer calls as needed
  setTimer(5000, function() {
      console.log('Second Timer');
  }, null);
   
  setTimer(5000, function() {
      console.log('Third Timer');
  }, null);
   
  setTimer(5000, function() {
      console.log('Fourth Timer');
  }, null);
   
  setTimer(5000, function() {
      console.log('Fifth Timer');
  }, null);
   
  setTimer(6000, function() {
      console.log('Sixth Timer');
  }, null);