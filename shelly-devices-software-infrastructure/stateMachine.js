function createLightStateMachine(event) {
    let currentState = "Off"; // Initial State
    
    // Define the states as objects
    let states = {
      'On': {
        onEnter: function () {      
          Shelly.call("Switch.Set", { "id": 0, "on": false });
          currentState = "Off";
        },
        transitions: {
          toggle: 'Off'
        }
      },
    
      'Off': {
        onEnter: function () {      
          Shelly.call("Switch.Set", { "id": 0, "on": true });
          currentState = "On";
        },
        transitions: {
          toggle: 'On'
        }
      }
    };
   
    handleEvent(event);
   
    function handleEvent(event) {
      let currentStateObj = states[currentState];
      let nextState = currentStateObj.transitions[event];
      
      if (!nextState) {
        console.log('Invalid event: ' + event);
        return;
      }
   
      currentStateObj.onEnter();
    }
  }
   
  const lightStateMachine = createLightStateMachine("toggle");