
require('dotenv').config()

const express = require('express')
var morgan = require('morgan')

let mustacheExpress = require('mustache-express')

/*************************************************/

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))

// app.use(morgan('combined'))

app.use(express.static('public'))

app.engine('html', mustacheExpress())

app.set('view engine', 'html')

/*************************************************/

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`)
})

/*************************************************/

require('./routes/authz_code')(app)
require('./routes/mfa')(app)
require('./routes/update_profile')(app)

/*************************************************/

app.get('/favicon.ico', (req, res) => {
	res.sendStatus(200)
	return
})

app.get('/', (req, res) => {

	var obj = {
		baseUrl: process.env.BASE_URL,
		clientId: process.env.CLIENT_ID,
		public_password: process.env.PUBLIC_PASSWORD,
		redirectUri: process.env.REDIRECT_URI,
		eu: process.env.FORTER_EU,
		site_id: process.env.FORTER_SITE_ID
	}

	res.render ('index', obj)

})
