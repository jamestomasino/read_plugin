(function(){

	var readOptions = {
		"wpm": 300,
		"slowStartCount": 5,
		"sentenceDelay": 2.5
	};

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
		switch (request.functiontoInvoke) {
			case "readSelectedText":
				getReadOptions ( request.selectedText );
				break;
			case "readFullPage":
				getReadOptions ( document.body.innerText || document.body.textContent );
				break;
		}
	});

	$(document).on( 'blur', '.__read .__read_speed', function () {
		var val = Math.min( 15000, Math.max( 0, parseInt(this.value,10)));
		setReadOptions( {"wpm": val} );
	});

	$(document).on( 'blur', '.__read .__read_slow_start', function () {
		var val = Math.min( 5, Math.max( 1, parseInt(this.value,10)));
		setReadOptions( {"slowStartCount": val} );
	});

	$(document).on( 'blur', '.__read .__read_sentence_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"sentenceDelay": val} );
	});

	function setReadOptions ( myOptions ) {
		readOptions = $.extend( {}, readOptions, myOptions );
		chrome.storage.sync.clear(function () {
			chrome.storage.sync.set(readOptions, function() {
				console.log('[READ] set:', readOptions);
			});
		});
	}

	function getReadOptions ( text ) {
		chrome.storage.sync.get(null, function ( myOptions ) {
			readOptions = $.extend( {}, readOptions, myOptions );
			console.log('[READ] get:', readOptions);
			var r = new Read ( text, readOptions );
			r.play();
		});
	}
})();
