function reverseText(text) {
    // stack structure we use to pop the chars in reverse order
    let textArray = text.split("");
    console.log(text);
    console.log(textArray);
    let resultArray = [];
    for (let i=0; i<text.length; i++) {
      resultArray.push(textArray.pop());
    }
    return resultArray.join("");
  }
  
  console.log(reverseText("Shelly PRO"));