// Initialize editors
var editor_settings = {
	tabSize: 4,
    useSoftTabs: true,
    highlightActiveLine: true,
    showInvisibles: true,
    wrap: true,
    indentedSoftWrap: true
}

var grammar_editor  = ace.edit("grammar_editor")
grammar_editor.setOptions(editor_settings)

var data_editor = ace.edit("data_editor")
data_editor.setOptions(editor_settings)

$("#compile_button").click(function() {
	messaging.compile_grammar(grammar_editor.session.getValue())
})

$("#clear-results").click(function() {
	$("#results-display").empty()
})

let ux = {}

ux.show_grammar = function() {
	$("#tab_data").hide()
	$("#tab_grammar").show()
}

ux.show_data = function() {
	$("#tab_grammar").hide()
	$("#tab_data").show()
}

ux.show_message = function(message, message_type = "info") {

	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var close_button = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
	var alert_time   = '<p align="right">' + time + '</p>'
	var message_para = '<p>' + message + '</p>'

	var alert_box = $("<div>", {
			class: "alert alert-dismissible alert-" + message_type,
			role: "alert",
			html: close_button + alert_time + message_para
		});

	$("#results-display").append(alert_box);
}

