(function(){
	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.functiontoInvoke == "readSelectedText") {
			new Read ( request.selectedText ).play();
		}
	});
})();
