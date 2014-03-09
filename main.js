(function(){

	var wpm = 300;

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
		switch (request.functiontoInvoke) {
			case "readSelectedText":
				getWPM ( request.selectedText );
				break;
			case "readFullPage":
				getWPM ( document.body.innerText || document.body.textContent );
				break;
		}
	});

	$(document).on( 'blur change', '.__read .__read_speed', function () {
		var val = Math.min( 15000, Math.max( 0, parseInt(this.value,10)));
		setWPM( val );
	});

	function getWPM ( text ) {
		chrome.storage.sync.get("wpm", function(val) {
			wpm = val.wpm;
			//console.log ('getWPM:', wpm);
			if (!wpm) wpm = 300;
			var r = new Read ( text, {"wpm":wpm} );
			r.play();
		});
	}

	function setWPM( val ) {
		wpm = val;
		chrome.storage.sync.clear(function () {
			chrome.storage.sync.set({"wpm": wpm}, function() {
				//console.log ('setWPM:', val, wpm);
			});
		});
	}

})();
