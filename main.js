(function(){

	var wpm = 300;

	chrome.storage.sync.get("wpm", function(val) {
		wpm = val.wpm;
	});

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.functiontoInvoke == "readSelectedText") {
			var r = new Read ( request.selectedText, "body", wpm );
			r.play();
		}
	});

	$(document).on( 'blur', '.read .speed', function () {
		wpm = Math.min( 15000, Math.max( 0, parseInt(this.value,10)));
		console.log (wpm);
		chrome.storage.sync.set({"wpm": wpm}, function() { });
	});

})();

