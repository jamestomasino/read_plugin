var readInstance = null;

function genericOnClick(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "readSelectedText",
			"selectedText": info.selectionText,
			"readInstance": readInstance
        });
    });
}

// Create one test item for each context type.
var contexts = ["selection"];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Read Selected Text";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "onclick": genericOnClick
    });
}
