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
	$("#progress").fadeIn()
	messaging.compile_grammar(grammar_editor.session.getValue())
})

$("#data-test_button").tooltip({ trigger : "manual", placement: "left", title: "Compile grammar to test data" })

$("#data-test_button").hover(function () { if($(this).hasClass('disabled')) { $(this).tooltip('show') } },
							  function() { if($(this).hasClass('disabled')) { $(this).tooltip('hide') } })

$("#data-test_button").click(function() {
	if(!$(this).hasClass('disabled')) {
		$("#progress").fadeIn()
		messaging.test_data(data_editor.session.getValue())
	} else {
		ux.show_message("Compile grammar to test the data", "warning")
	}
})

$("#clear-results").click(function() {
	$("#results-display").empty()
})

let ux = {}

ux.show_grammar = function() {
	$("#tab_data").hide()
	$("#tab_grammar").show()
	grammar_editor.focus()
}

ux.show_data = function() {
	$("#tab_grammar").hide()
	$("#tab_data").show()
	data_editor.focus()
}

ux.show_message = function(message, message_type = "info") {

	var today = new Date()
	var time = [today.getHours(), today.getMinutes(), today.getSeconds()].map(x => x >= 10 ? x : "0" + x).join(':')

	var close_button = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
	var alert_time   = '<p align="right">' + time + '</p>'
	var message_para = '<p>' + message + '</p>'

	var alert_box = $("<div>", {
			class: "alert alert-dismissible alert-" + message_type,
			role: "alert",
			html: close_button + alert_time + message_para
		});

	$("#results-display").prepend(alert_box).scrollTop();

	// fade in the top
	$("#results-display .alert").first().hide().fadeIn();

}

