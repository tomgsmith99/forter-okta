
const axios = require('axios')

////////////////////////////////////////////////////

const users = {

	"00uptdgk3iNZYSAc10h7": {
		"accountId": "lois-abc-123",
		"username": "lois.lane",
		"ip_address": "0.0.0.1",
		"expected_response": "APPROVED"
	},
	"00u12h404fjSQ6JOs0h8": {
		"accountId": "clark-abc-123",
		"username": "clark.kent",
		"ip_address": "0.0.0.4",
		"expected_response": "VERIFICATION_REQUIRED"
	},
	"00u12h3y4wdZxVq7m0h8": {
		"accountId": "lex-abc-123",
		"username": "lex.luthor",
		"ip_address": "0.0.0.2",
		"expected_response": "DECLINED"
	}
}

module.exports = function(app){
	app.post('/update_profile', function (req, res) {

		const username = req.body.username
		const user_id = req.body.user_id
		const forter_token = req.body.forter_token

		console.log("the username is: " + username)
		console.log("the user_id is: " + user_id)
		console.log("the forter token is: " + forter_token)

		const data = JSON.stringify({
		  "accountId": users[user_id].accountId,
		  "connectionInformation": {
		    "customerIP": users[user_id].ip_address,
		    "userAgent": req.headers['user-agent'],
		    "forterTokenCookie": forter_token
		  },
		  "eventTime": Date.now()
		})

		const config = {
		  auth: {
			username: process.env.FORTER_KEY
		  },
		  method: 'post',
		  url: process.env.FORTER_TENANT + '/v2/accounts/profile-access/' + users[user_id].accountId,
		  headers: { 
		    'api-version': '2.36', 
		    'Content-Type': 'application/json'
		  },
		  data: data
		}

		axios(config)
		.then(function (response) {
		  console.log(JSON.stringify(response.data))

		  if (response.data.forterDecision == "VERIFICATION_REQUIRED") {

		  	get_factors(user_id, function(err, factors_raw) {

		  		if (err) console.log(err)

		  		let factors = []

		  		for (factor of factors_raw) {

		  			console.log(factor)

		  			let f = {
		  				id: factor.id,
		  				factorType: factor.factorType
		  			}

		  			if (factor.factorType == "question") {
		  				f.question_text = factor.profile.questionText
		  			}
		  			else if (factor.factorType == "email") {
		  				f.email = factor.profile.email
		  			}

		  			factors.push(f)
		  		}

		  		response.data.factors = factors

		  		res.json(response.data)
		  	})
		  }
		  else {
		  	res.json(response.data)
		  }
		})
		.catch(function (error) {
		  console.log(error)
		})
	})
}

function get_factors(user_id, callback) {

	const url = process.env.BASE_URL
	const apikey = process.env.OKTA_API_KEY

	const config = {
	  	method: 'get',
	  	url: `${url}/api/v1/users/${user_id}/factors`,
		headers: { 
			'Accept': 'application/json', 
			'Content-Type': 'application/json', 
			'Authorization': `SSWS ${apikey}`
		}
	}

	axios(config)
	.then(function (response) {
	  console.log(JSON.stringify(response.data))

	  return callback(null, response.data)
	})
	.catch(function (error) {
	  console.log(error)
	})
}
