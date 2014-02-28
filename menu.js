function _onReadSelectedText (obj) {
	//localStorage.setItem("selectedText", obj.selectionText);
	var __read = new Read ( obj.selectionText );
	__read.play();
}

// Create selection menu
var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++) {
	var context = contexts[i];
	var title = "Read Selected Text";
	var id = chrome.contextMenus.create({"title": title, "contexts":[context], "onclick": _onReadSelectedText});
}
