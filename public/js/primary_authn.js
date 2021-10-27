
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

	oktaSignIn.authClient.session.exists().then(function (sessionExists) {
		if (sessionExists) {

			console.log("the user has an okta session.")

			oktaSignIn.authClient.session.get()
			.then(function(session) {
				post_login(session, session.login, session.userId)
			})
			.catch(function(err) {
				// not logged in
			})
		}
		else {
			oktaSignIn.showSignInAndRedirect({
				el: '#osw-container'
			}).catch(function(error) {
				// Handle error
			})
		}
	})
}

function post_login(session, username, user_id) {

	console.log("okta session:")
	console.dir(session)

	$("#okta_logout").show()
	$("#username").html(username)
	$("#password").hide()

	localStorage.setItem("username", username)
	localStorage.setItem("user_id", user_id)
}

function post_code(code, callback) {
	$.post(
		"/code", {
			code: code
	})
	.done(function( data ) {
		if (data.access_token) {
			window.history.replaceState({}, document.title, "/" + "")
			console.log("access token:")
			console.log(data.access_token)
			localStorage.setItem("access_token", data.access_token)
			$("#password").hide()
		}
		else {
			console.dir(data)
		}
	})
}
