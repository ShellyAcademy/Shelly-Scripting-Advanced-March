function changeLEDs(red, green, blue, brightness) {
  let config = {
    config: {
      leds: {
        colors: {
          "switch:0": {
            on: {
              rgb: [red, green, blue],
              brightness: brightness,
            },
          },
        },
      },
    },
  };
  Shelly.call("PLUGS_UI.SetConfig", config);
}

// Define a stack using a function-based approach
function Stack() {
  var items = []; // Stack storage

  return {
      // Method to push an item onto the stack
      push: function(item) {
          items.push(item);
      },

      // Method to pop an item off the stack
      pop: function() {
          if(items.length > 0) {
              return items.pop();
          }
          return null; // Indicates the stack is empty
      },

      // Method to peek at the top item of the stack without removing it
      peek: function() {
          return items[items.length - 1];
      },

      // Method to check if the stack is empty
      isEmpty: function() {
          return items.length === 0;
      },

      // Method to get the number of items in the stack
      size: function() {
          return items.length;
      },

      elements: function() {
        return items;
      },

      // Method to clear the stack
      clear: function() {
          items = [];
      }
  };
}

let colorStack = Stack();
let isGenerating = false

function generateColors() {
    let red = Math.round(Math.random() * 100);
    let green = Math.round(Math.random() * 100);
    let blue = Math.round(Math.random() * 100);

    let colorsObj = {
      red: red,
      green: green,
      blue: blue,
    };

    colorStack.push(colorsObj);
    changeLEDs(red, green, blue, 100);
 }
  //   let colorStack = [
  //       { "red": 88, "green": 51, "blue": 33 },
  //       { "red": 48, "green": 57, "blue": 44 },
  //       { "red": 5, "green": 49, "blue": 28 },
  //       { "red": 32, "green": 35, "blue": 41 },
  //       { "red": 81, "green": 9, "blue": 68 }
  //       ]


let timerHandler = Timer.set(3000, true, generateColors);

generateColors();

Shelly.addEventHandler(function (event) {
  if (event.info.event === "BLU_BUTTON") {
    let value = event.info.data.Button;
    let desiredColorsObj;

    if (value === 1) {
      isGenerating = false
      Timer.clear(timerHandler);
    } else if (value === 2) {
      if(isGenerating == false){
        colorStack.pop();
        desiredColorsObj = colorStack.pop();
      }
      console.log("Two times");
    } else if (value === 4) {
      isGenerating = true
      colorStack.clear();
      timerHandler = Timer.set(3000, true, generateColors);
      console.log("Long press");
    }

    if (desiredColorsObj) {
      let red = desiredColorsObj["red"];
      let green = desiredColorsObj["green"];
      let blue = desiredColorsObj["blue"];
      changeLEDs(red, green, blue);
    }
  }
});


// In case there is a problem with the changeLEDs function
// function changeLEDs(elements) {
//   let red = elements[0];
//   let green = elements[1];
//   let blue = elements[2];
//   let brightness = elements[3];
//   let config = {
//     config: {
//       leds: {
//         colors: {
//           "switch:0": {
//             on: {
//               rgb: [red, green, blue],
//               brightness: brightness,
//             },
//           },
//         },
//       },
//     },
//   };
//   Shelly.call("PLUGS_UI.SetConfig", config);
// }

// // changeLEDs(100, 67, 28, 100);

// function Stack() {
//   var items = [];
  
//   return {
//     // function to add an item to the stack
//     push: function(item) {
//       items.push(item);
//     },
    
//     // function to pop an item from the stack
//     pop: function() {
//       if (items.length > 0) {
//         return items.pop();
//       }
//       return null;
//     },
    
//     // function to see which is the last element without removing it
//     peek: function() {
//       if (items.length > 0) {
//         return items[items.length - 1];
//       } else {
//         return [];
//       }
//     },
    
//     // function to check if the stack is empty
//     isEmpty: function() {
//       return items.length === 0;
//     },
    
//     // function to get the size of the stack
//     size: function() {
//       return items.length;
//     },
     
//     // function to clear the stack
//     clear: function() {
//       items = [];
//     },
    
//     elements: function() {
//       return items;
//     }
//   }
// }

// let colorStack = Stack();
// let isGenerating = false;

// function generateColors() {
//   // let red = Math.round(Math.random() * 100);
//   let red = Math.round(Math.random() * 100);
//   let green = Math.round(Math.random() * 100);
//   let blue = Math.round(Math.random() * 100);
  
//   let colorsObj = {
//     red: red,
//     green: green,
//     blue: blue,
//   };
  
//   colorStack.push(colorsObj);
//   console.log(colorStack.elements());
//   changeLEDs([red, green, blue, 100]);
// }

// let timerHandler = Timer.set(3000, true, generateColors);

// Shelly.addEventHandler(function(event) {
//   if (event.info.event === "BLU_BUTTON") { 
//     let value = event.info.data.Button;
//     let desiredColorsObj;
//     if (value === 1) {
//       isGenerating = false;
//       Timer.clear(timerHandler);
//       console.log("One time");
//     } else if (value === 2) {
//       if (isGenerating == false) {
//         colorStack.pop();
//         desiredColorsObj = colorStack.pop();
//       }
//       console.log("Two times");
//     } else if (value === 4) {
//       isGenerating = true;
//       colorStack.clear();
//       timerHandler = Timer.set(3000, true, generateColors);
//       console.log("Long press");
//     }
    
//     if (desiredColorsObj) {
//       let red = desiredColorsObj["red"];
//       let green = desiredColorsObj["green"];
//       let blue = desiredColorsObj["blue"];
//       // changeLEDs(red, green, blue, 100);
//       Timer.set(1000, false, changeLEDs, [red, green, blue, 100]);
//     }
//   }
// });
// generateColors();