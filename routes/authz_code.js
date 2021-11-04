
const axios = require('axios')

var qs = require('qs')

const jwt_decode = require('jwt-decode')

////////////////////////////////////////////////////

module.exports = function(app){
	app.post('/code', function (req, res) {

		console.log("the code is: " + req.body.code)

		const client_id = process.env.CLIENT_ID

		const client_secret = process.env.CLIENT_SECRET

		const issuer = process.env.ISSUER

		////////////////////////////////////////////////////

		const data = qs.stringify({
		  'grant_type': 'authorization_code',
		  'redirect_uri': process.env.REDIRECT_URI,
		  'code': req.body.code,
		  'client_id': client_id,
		  'client_secret': client_secret
		})

		const c = {
		  method: 'post',
		  url: issuer + '/v1/token',
		  headers: { 
			'Accept': 'application/json', 
			'Content-Type': 'application/x-www-form-urlencoded'
		  },
		  data: data
		}
		
		axios(c)
		.then(function (response) {

			console.dir(response.data)

			if (response.data.id_token) {
				req.session.authenticated = true

				const decoded = jwt_decode(response.data.id_token)

				console.dir(decoded)

				res.json({
					authenticated: true,
					firstName: decoded.firstName,
					email: decoded.email,
					user_id: decoded.sub
				})
			}
		})
		.catch(function (error) {
			console.dir(error)
			res.json({"error": "something went wrong with the token request to okta"})
		})		
	})
}
