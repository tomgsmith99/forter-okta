
const axios = require('axios')

////////////////////////////////////////////////////

const users = {
	"00uptdgk3iNZYSAc10h7": {
		"username": "lois.lane",
		"ip_address": "0.0.0.1",
		"expected_response": "APPROVED"
	},
	"00u12h404fjSQ6JOs0h8": {
		"username": "clark.kent",
		"ip_address": "0.0.0.4",
		"expected_response": "VERIFICATION_REQUIRED"
	},
	"00u12h3y4wdZxVq7m0h8": {
		"username": "lex.luthor",
		"ip_address": "0.0.0.2",
		"expected_response": "DECLINED"
	}
}

module.exports = function(app){
	app.post('/security_answer', function (req, res) {

		console.log("the answer is: " + req.body.security_answer)
		console.log("the id is: " + req.body.security_question_id)

		const apikey = process.env.OKTA_API_KEY

		const factor_id = req.body.security_question_id

		const url = process.env.BASE_URL

		const user_id = req.body.user_id

		const data = JSON.stringify({
		  "answer": req.body.security_answer
		})

		const config = {
		  method: 'post',
		  url: `${url}/api/v1/users/${user_id}/factors/${factor_id}/verify`,
		  headers: { 
		    'Accept': 'application/json', 
		    'Content-Type': 'application/json', 
		    'Authorization': `SSWS ${apikey}`
		  },
		  data: data
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
}
