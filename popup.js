// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
  
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
 
  filename = "dom";
  var html = '',
    node = document.firstChild
  while (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        html += node.outerHTML
        break
      case Node.TEXT_NODE:
        html += node.nodeValue
        break
      case Node.CDATA_SECTION_NODE:
        html += '<![CDATA[' + node.nodeValue + ']]>'
        break
      case Node.COMMENT_NODE:
        html += '<!--' + node.nodeValue + '-->'
        break
      case Node.DOCUMENT_TYPE_NODE:
        // (X)HTML documents are identified by public identifiers
        html +=
          '<!DOCTYPE ' +
          node.name +
          (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') +
          (!node.publicId && node.systemId ? ' SYSTEM' : '') +
          (node.systemId ? ' "' + node.systemId + '"' : '') +
          '>\n'
        break
    }
    node = node.nextSibling
  }
  
  
  var file = new Blob([html], {
    type: 'text/html'
  });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

}