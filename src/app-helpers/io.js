const { dialog } = require('electron');
const fs = require('fs');

exports.open_file_dialog = function(exts_allowed) {
	
	var files    = dialog.showOpenDialog({ properties: ['openFile'], filters: [ { name: "Allowed extension", extensions: exts_allowed } ] });

	if(files != null) {
		return { path: files[0], value: fs.readFileSync(files[0]).toString() }
	} else {
		return null
	}

}

exports.save_file = function(saving_object) {
	try {
		fs.writeFileSync(saving_object.target_file, saving_object.data, 'utf8')
	} catch(save_error) {
		return { result: "save-failed", target_file: saving_object.target_file, error: save_error }
	}

	return { result: "save-succeeded", target_file: saving_object.target_file, update_ux_filepath: saving_object.update_ux_filepath }
}

exports.save_file_as_dialog = function(saving_object) {
	var file_path = dialog.showSaveDialog({})

	if(file_path != undefined) {
		saving_object["target_file"] = file_path
		saving_object["update_ux_filepath"] = true

		return exports.save_file(saving_object)
	} else {
		// User pressed cancel on save dialog
		return { result: "save-cancelled" }
	}

}
