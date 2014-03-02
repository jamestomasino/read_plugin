(function(){

	var wpm = 300;

	chrome.storage.sync.get("wpm", function(val) {
		wpm = val.wpm;
	});

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
		switch (request.functiontoInvoke) {
			case "readSelectedText":
				var r = new Read ( request.selectedText, "body", wpm );
				r.play();
				break;
			case "readFullPage":
				//var r = new Read ( request.selectedText, "body", wpm );
				var a = grabArticle();
				console.log (a);
				//r.play();
				break;
		}
	});

	$(document).on( 'blur', '.read .speed', function () {
		wpm = Math.min( 15000, Math.max( 0, parseInt(this.value,10)));
		console.log (wpm);
		chrome.storage.sync.set({"wpm": wpm}, function() { });
	});

})();

