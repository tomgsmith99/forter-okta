
const axios = require('axios')

var qs = require('qs')

////////////////////////////////////////////////////

module.exports = function(app){
	app.post('/code', function (req, res) {

		console.log("the code is: " + req.body.code)

		// const widget_config = JSON.parse(config[flow_name].widget_config)

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
			res.json({"access_token": response.data.access_token})
			return
		})
		.catch(function (error) {
			console.dir(error)
			res.json({"error": "something went wrong with the token request to okta"})
			return
		})		
	})
}
