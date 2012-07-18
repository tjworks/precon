$(function() {

	if ($("#feedback").size() == 0) {
		return;
	}

	var all = $("#email").add("#name").add("#subject").add("#message");
	var check_as_email = $("#email");
	var check_as_non_blank = $("#name").add("#subject").add("#message");

	$(".example").each(function() {
		var input = $(this).prevAll(":input:first");

		if (!input.attr("disabled")) {
			$(this).show();
		}

		$(this).find("a").click(function() {
			input.val($(this).text());
			input.trigger("validate");
			return false;
		});
	});

	all.each(function() {
		$(this).before("<div class=\"ui-validation-completion\"></div>");
	});

	check_as_email
			.each(function() {
				var label = $(this).prevAll("label:first");
				var completion = $(this).prevAll(
						".ui-validation-completion:first");

				$(this)
						.validate(
								{
									completionIcon : completion,
									label : label,
									valid : function(str) {
										return str
												.match(/^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/);
									},
									errorMessage : function(str) {
										if (str == "") {
											return $("#error_msg .empty")
													.text();
										} else {
											return $("#error_msg .invalid")
													.text();
										}
									},
									validateOnLoad : true
								});
			});

	check_as_non_blank.each(function() {
		var label = $(this).prevAll("label:first");
		var completion = $(this).prevAll(".ui-validation-completion:first");

		$(this).validate( {
			completionIcon : completion,
			label : label,
			valid : function(str) {
				return str != "";
			},
			errorMessage : function(str) {
				return $("#error_msg .empty").text();
			},
			validateOnLoad : true
		});
	});

	all.bind("validate", function() {
		var done = true;
		$(".ui-validation-completion").each(function() {
			if (!$(this).hasClass("ui-validation-complete")) {
				done = false;
			} 
		});

//		console.log(done);
		
		if (done) {
			$("#feedbackBtn").removeAttr("disabled");
		} else {
			$("#feedbackBtn").attr("disabled", "true");
		}
	});

	var button_string = $("#feedbackBtn").val();
	$("#feedbackBtn").remove();
	$("#info_content")
			.append(
					'<input id="feedbackBtn" type="button" value="' + button_string + '" class="widget" disabled/>');

	$("#feedbackBtn").click(function() {
		$("#feedback").addClass("loading");
		$(".loading_message").show();
		$(this).css("visibility", "hidden");

		$.ajax( {
			data: {
				message: $("[name=message]").val(),
				subject: "Contact form: " + $("[name=subject]").val(),
				name: $("[name=name]").val(),
				from: $("[name=from]").val()
			},
			type: "POST",
			url: absoluteUrl("json/mail"),
			success: function(){
				$(".loading_message").hide();
				$(".complete_message").show();
			},
			error: function(){
				$(".loading_message").hide();
				$(".error_message").show();
			}
		});

		$(".loading_message").show();
		
		// send email
		// show msg when sent
	});

});