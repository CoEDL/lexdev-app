exports.open_file_dialog = function() {
	const { dialog } = require('electron');
	const fs = require('fs');

	var files    = dialog.showOpenDialog({ properties: ['openFile'] });

	if(files != null) {
		return fs.readFileSync(files[0]).toString()
	} else {
		return null
	}

}
