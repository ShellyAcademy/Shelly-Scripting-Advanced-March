let snippetCode = "let a=1+5; console.log('snippet result:', a);";
// to get the current script id we can use Shelly.getCurrentScriptId()
let scriptId = Shelly.getCurrentScriptId();

Shelly.call("Script.eval", { id:scriptId, code: snippetCode });