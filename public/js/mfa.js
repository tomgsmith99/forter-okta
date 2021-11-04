
function show_factor(factor_type) {

    $("#mfa_response").val("")

    $("#mfa_response_div").show()

	localStorage.setItem("chosen_factor", factor_type)

	let msg

	if (factor_type == "email") {

		$.post(
        "/send_email_challenge", {
            factor_id: localStorage.getItem("email_factor_id"),
            user_id: localStorage.getItem("user_id")
	    })
	    .done(function( data ) {
	    	console.log("Okta response:")
	    	console.dir(data)
	    })

	    msg = "<p>We have sent a security code to the email address on file (" + localStorage.getItem('email') + ").</p><p>Please enter the security code here:</p>"
	}
	else {
	    msg = "<p>" + localStorage.getItem("security_question") + "</p>"	
	}

	$("#mfa_instrux").html(msg)
	$("#factors_list_div").hide()
}

function submit_mfa_response() {

	const factor_type = localStorage.getItem("chosen_factor")

	let factor_id

	if (factor_type == "email") {
        factor_id = localStorage.getItem("email_factor_id")
	}
	else {
        factor_id = localStorage.getItem("question_factor_id")
	}

	$.post(
    "/mfa_response", {
    	factor_type: factor_type,
        mfa_response: $("#mfa_response").val(),
        factor_id: factor_id,
        user_id: localStorage.getItem("user_id")
    })
    .done(function( data ) {

    	console.log("Okta MFA result:")

    	console.dir(data)

    	if (data.factorResult == "SUCCESS") {
    		$("#mfa_success").show()
    		$("#update_profile").show()
    		$("#mfa_response_div").hide()
    		$("#incorrect_response").hide()
    	}
    	else {
    		$("#mfa_response").val("")
    		$("#incorrect_response").show()
    	}
    })
}
