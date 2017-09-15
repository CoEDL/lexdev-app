const {ipcRenderer} = require('electron')

// Receiving events

ipcRenderer.on('load-grammar', function(event, grammar_file) {
	if(grammar_file != null) {
		// see ux.js for grammar_editor
		$("#grammar_editor").data('file_path', grammar_file.path)
		grammar_editor.session.setValue(grammar_file.value)
		ux.show_grammar()

		ux.show_message("Nearley grammar opened from <b>" + grammar_file.path + "</b>", "success")
	}
})

ipcRenderer.on('load-data', function(event, data_file) {
	if(data_file != null) {
		// see ux.js for grammar_editor
		$("#data_editor").data('file_path', data_file.path)
		data_editor.session.setValue(data_file.value)
		ux.show_data()

		ux.show_message("Data read in from <b>" + data_file.path + "</b>", "success")
	}
})

// Sending events
messaging = {};

messaging.compile_grammar = function(grammar_string) {
	var compiling = ipcRenderer.sendSync('compile-grammar', grammar_string)

	$("#progress").fadeOut()

	if(compiling.success) {
		$("#data-test_button").removeClass('disabled')
		ux.show_message("Grammar compiled!", "success")
	} else {
		$("#data-test_button").addClass('disabled')

		var linked_message = compiling.results.replace(/line (\d+)/, '<a href="#" onClick="ux.show_data();grammar_editor.gotoLine($1)">line $1</a>')

		ux.show_message('Compilation failed.<br /><br />' + linked_message, "danger")
	}

}

messaging.test_data = function(data_string) {

	var test = ipcRenderer.sendSync('test-data', data_string)

	$("#progress").fadeOut()

	if(test.success) {
		ux.show_message("Data is valid!", "success")
	} else {
		var linked_message = test.results.replace(/line (\d+)/, '<a href="#" onClick="ux.show_data();data_editor.gotoLine($1)">line $1</a>')

		ux.show_message('Data is invalid!<br /><br />' + linked_message, "danger")
	}

}

messaging.save_file = function(source_editor, target_file = null) {

	let contents_to_save

	if (source_editor == "data_editor") {
		contents_to_save = data_editor.session.getValue()
		target_file = $("#data_editor").data("file_path")
	} else if (source_editor == "grammar_editor") {
		contents_to_save = grammar_editor.session.getValue()
		target_file = $("#grammar_editor").data("file_path")
	} else {
		throw "Specify either 'data_editor' or 'grammar_editor'."
	}

	var saving = ipcRenderer.sendSync('save-file', { target_file: target_file, data: contents_to_save })

	if(saving.result == "save-succeeded") {
		ux.show_message("File saved to" + saving.target_file, "success")

		if(saving.update_ux_filepath) {
			$("#" + source_editor).data("file_path", saving.target_file)
		}
	} else if (saving.result == "save-failed") {
		ux.show_message("Failed to save file to" + saving.target_file + "<br /><br />" + saving.error, "danger")
	}

}
