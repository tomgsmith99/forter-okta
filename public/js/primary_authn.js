
function authz_code_in_url(callback) {
	const params = new URLSearchParams(window.location.search)

	if (params.has('code')) {
		return callback(null, params.get('code'))
	}
	else {
		return callback("none")
	}
}

function check_for_session() {

	$.get("/session")
	.done(function( data ) {

		console.dir(data)

		if (data.authenticated) {

			console.log("the user has an app session.")

			$("#password").hide()
		}
		else {

			console.log("the user does not have an app session.")

			oktaSignIn.showSignInAndRedirect({
				el: '#osw-container'
			}).catch(function(error) {
				// Handle error
			})
		}
	})
}

function update_ui(data) {

	const { authenticated, firstName, email, user_id } = data

	$("#osw-container").hide()
	$("#password").hide()

	$("#logout").show()
	$("#firstName").html(firstName)

	// oktaSignIn.hide()

	localStorage.setItem("email", email)
	localStorage.setItem("firstName", firstName)
	localStorage.setItem("user_id", user_id)
}

function post_code(code, callback) {
	$.post(
		"/code", {
			code: code
	})
	.done(function( data ) {
		if (data.authenticated) {
			window.history.replaceState({}, document.title, "/" + "")

			console.log("the user has an app session.")

			console.dir(data)

			update_ui(data)
		}
		else {
			console.dir(data)
		}
	})
}
