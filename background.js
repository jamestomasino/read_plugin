function onContextCLick(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "readSelectedText",
			"selectedText": info.selectionText
        });
    });
}

function onIconClick(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "readFullPage"
        });
    });
}

// Write this in an expandable way in case we want to move beyond selection
var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Read Selected Text";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "onclick": onContextCLick
    });
}

// Handle clicking on the chrome icon
chrome.browserAction.onClicked.addListener(function(tab) { onIconClick(); });
