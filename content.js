/**
 * @return {Array} of objects containing script names and their contents
 */
function getScripts() {
  var output = [];
  var scripts = document.querySelectorAll('script');
  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    var scriptInfo = {};
    if (script.src) {
      // If there's a src on the script, fetch contents
      scriptInfo.src = script.src;
      scriptInfo.contents = fetchScript(script.src);
    } else {
      // If no src, script is inline
      scriptInfo.src = nameInlineScript();
      scriptInfo.contents = script.innerText;
    }
    //console.log('scriptInfo', scriptInfo.name, scriptInfo.contents);
    output.push(scriptInfo);
  }
  console.log('got all scripts', output);
  return output;
}

/**
 * Do a synchronous XHR for the script contents
 *
 * @param {String} url URL of the script to retrieve
 * @return {String} contents of the script
 */
function fetchScript(url) {
  var response = null;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.onreadystatechange = function() {
    if (xhr.status == 200) {
      response = xhr.responseText;
      // console.log('fetched script', response);
    }
  }
  xhr.send();
  return response;
}

/**
 * @return {String} unique (per page) name for the inline script
 */
function nameInlineScript() {
  if (!arguments.callee.lastId) {
    arguments.callee.lastId = 0;
  }
  var name = 'inline_' + arguments.callee.lastId++;
  return name;
}

function benchScripts(scripts) {
  scripts.forEach(function(script, scriptIndex) {
    script.forEach(function(error, errorIndex) {
      var i, start, before, after;

        try{ 
      start = new Date();
      for(i = 0; i < 100; i++) {
        eval(error.originalJQuery);
      }
      before = new Date() - start;

      start = new Date();
      for(i = 0; i < 100; i++) {
        eval(error.rewritten);
      }
      after = new Date() - start;
      
      scripts[scriptIndex][errorIndex].speedup = before - after;
        } catch(e) {
      scripts[scriptIndex][errorIndex].speedup = 0;
        }
    });
  });
  return scripts;
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if(request.type == "getScripts") {
    sendResponse({scripts: getScripts()});
  } else if(request.type == "benchChanges") {
    sendResponse({scripts: benchScripts(request.args)});
  } else {
    sendResponse();
  }
});
