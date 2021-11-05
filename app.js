
require('dotenv').config()

const express = require('express')
var morgan = require('morgan')

var session = require('express-session')

let mustacheExpress = require('mustache-express')

/*************************************************/

const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: true}))

// app.use(morgan('combined'))

app.use(express.static('public'))

app.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false}))

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
		logo_url: process.env.LOGO_URL,
		site_id: process.env.FORTER_SITE_ID
	}

	res.render ('index', obj)

})

app.get('/session', function (req, res) {
		if (req.session.authenticated) {
			res.json({authenticated: true})
		}
		else {
			res.json({authenticated: false})
		}
})

app.get('/log_out', function (req, res) {
		req.session.authenticated = false
		res.sendStatus(200)
})
