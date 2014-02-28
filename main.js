chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.functiontoInvoke == "readSelectedText") {
        _onReadSelectedText(message.selectedText);
    }
});

function _onReadSelectedText ( text ) {
	var r = new Read ( text );
	r.play();
}

