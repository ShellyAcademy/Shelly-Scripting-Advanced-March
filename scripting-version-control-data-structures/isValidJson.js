function isValidJSON(text) {
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    } finally {
      console.log("Validation finished");
    }
  }
  
  console.log("Is JSON valid:", isValidJSON("{'a':10}"));