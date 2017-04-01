var express = require('express');
var router = express.Router();
var passport = require('passport');
var AtlassianOAuthStrategy = require('passport-atlassian-oauth').Strategy;
var CredentialCache = require('../app/models/credentialcache');
var Config = require('../app/config');


passport.serializeUser(function(user, done) {
    done(null,user.userid);
});

passport.deserializeUser(function(username, done) {
    CredentialCache.getEntry(username, function(user) {
        if (user) {
            done(null, user);
        } else {
            done(new Error('User ' + username + ' not found in database'), null);
        }
    });

});

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
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
}));


router.get('/atlassian-oauth',
    passport.authenticate('atlassian-oauth'),
    function(req, res) {
        // The request will be redirected to the Atlassian app for authentication, so this
        // function will not be called.
    });


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
