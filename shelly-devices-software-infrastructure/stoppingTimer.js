const TIME_TO_REPEAT_TIMER = 3;
let timerCounter = 0;

let timerHandler = Timer.set(3000, true, function() {
  timerCounter++;
  console.log("Doing something in the timer.");
  if (timerCounter == TIME_TO_REPEAT_TIMER) {
    console.log("Stopping timer", timerHandler);
    Timer.clear(timerHandler);
    // kills and stops the whole script
    //die("Stopping timer");
  }
});