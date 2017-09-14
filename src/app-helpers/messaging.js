const {ipcRenderer} = require('electron')

// Receiving events

ipcRenderer.on('load-grammar', function(event, message) {
	if(message != null) {
		// see ux.js for grammar_editor
		grammar_editor.session.setValue(message)
	}
})

ipcRenderer.on('load-data', function(event, message) {
	if(message != null) {
		// see ux.js for data_editor
		data_editor.session.setValue(message)
	}
})

// Sending events
messaging = {};

messaging.compile_grammar = function(grammar_string) {
	var success = ipcRenderer.sendSync('compile-grammar', grammar_string)

	if(success) {
		alert("Compiled!")
	} else {
		alert("Did not compile")
	}

}
