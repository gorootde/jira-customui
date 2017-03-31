var express = require('express');
var router = express.Router();
var passport = require('passport');
var AtlassianOAuthStrategy = require('passport-atlassian-oauth').Strategy;
var CredentialCache = require('../app/models/credentialcache');
var Config = require('../app/config');


passport.use(new AtlassianOAuthStrategy({
            applicationURL: Config.jira.baseurl,
            callbackURL: Config.oauthcallbackurl,
            consumerKey: Config.consumerKey,
            consumerSecret: Config.consumerSecret
        },
        function(token, tokenSecret, profile, done) {

            var user = new User(profile.id, profile.username, profile.displayName, profile.emails, token, tokenSecret);
            CredentialCache.addOrUpdateEntry(user);
            return done(null, user);
        }
    )
);


/* GET users listing. */
router.post('/', passport.authenticate('atlassian-oauth', {
    successRedirect: '/api/jira/loadcredentials',
    failureRedirect: '/',
    failureFlash: true
}));



// GET /auth/atlassian-oauth
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Atlassian authentication will involve
//   redirecting the user to the atlassian Oauth authorisation page.  After authorization, the Atlassian app will
//   redirect the user back to this application at /auth/atlassian-oauth
router.get('/atlassian-oauth',
    passport.authenticate('atlassian-oauth'),
    function(req, res) {
        // The request will be redirected to the Atlassian app for authentication, so this
        // function will not be called.
    });

// GET /auth/atlassian-oauth/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/atlassian-oauth/callback',
    passport.authenticate('atlassian-oauth', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
