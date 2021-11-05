# Forter + Okta demo #

## Overview ##

This demo provides an example of how Forter and Okta can complement each other in the user journey.

The public, functioning version of this demo is at: [https://forter-okta.herokuapp.com/](https://forter-okta.herokuapp.com/)

The basic scenario is that three different users can authenticate (against Okta). After authentication, when the user clicks on "edit profile", the app will make a call to Forter.

Forter will respond with `approve`, `decline`, or `verification_required`.

If the response is `verification_required` then the app will retrieve the user's enrolled MFA factors from Okta and ask the user to complete MFA.

## Setup ##

This is a NodeJS app.

You will need an Okta tenant and a Forter instance to set this up.

Copy the file `.env_example` to `.env` and update the values as appropriate.

To run the app:

`node app.js`
