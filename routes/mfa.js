
const axios = require('axios')

////////////////////////////////////////////////////

const BASE_URL = process.env.BASE_URL
const OKTA_API_KEY = process.env.OKTA_API_KEY

////////////////////////////////////////////////////

module.exports = function(app){

	app.post('/mfa_response', function (req, res) {

		const factor_type = req.body.factor_type

		const factor_id = req.body.factor_id

		const user_id = req.body.user_id

		let data

		if (factor_type == "question") {
			data = {
			  "answer": req.body.mfa_response
			}
		}
		else {
			data = {
		 		"passCode": req.body.mfa_response
			}
		}

		const config = {
		  method: 'post',
		  url: `${BASE_URL}/api/v1/users/${user_id}/factors/${factor_id}/verify`,
		  headers: { 
		    'Accept': 'application/json', 
		    'Content-Type': 'application/json', 
		    'Authorization': `SSWS ${OKTA_API_KEY}`
		  },
		  data: JSON.stringify(data)
		}

		axios(config)
		.then(function (response) {
		  console.log(JSON.stringify(response.data))

		  if (response.data.factorResult == "SUCCESS") {
		  	res.json({factorResult: "SUCCESS"})
		  }
		  else {
		  	res.json({factorResult: "ERROR"})
		  }
		})
		.catch(function (error) {
		  console.log(error)
		  res.json({factorResult: "ERROR"})
		})
	})

	app.post('/send_email_challenge', function (req, res) {

		console.log("the user id: " + req.body.user_id)
		console.log("the factor id is: " + req.body.factor_id)

		const factor_id = req.body.factor_id

		const user_id = req.body.user_id

		const config = {
		  method: 'post',
		  url: `${BASE_URL}/api/v1/users/${user_id}/factors/${factor_id}/verify`,
		  headers: { 
		    'Accept': 'application/json', 
		    'Content-Type': 'application/json', 
		    'Authorization': `SSWS ${OKTA_API_KEY}`
		  }
		}

		axios(config)
		.then(function (response) {
		  console.log(JSON.stringify(response.data))

		  if (response.data.factorResult == "CHALLENGE") {
		  	res.json({factorResult: "CHALLENGE"})
		  }
		  else {
		  	res.json({factorResult: "ERROR"})
		  }
		})
		.catch(function (error) {
		  console.log(error)
		  res.json({factorResult: "ERROR"})
		})
	})
}
