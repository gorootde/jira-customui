/*!
    Copyright (C) 2017  Michael Kolb

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


import * as Express from "express";
import * as Passport from "passport";
import * as AtlassianOAuthStrategy from "passport-atlassian-oauth";
import * as Persistence from "../app/models/persistence";
import * as Config from "../app/config";
import * as Debug from "debug";

var debug = Debug("login");
var router = Express.Router();



Passport.serializeUser<Persistence.User, string>(function(user: Persistence.User, done: (err: any, id?: string) => void) {
    debug("Serialize %o", user.userid);
    done(null, user.userid);
});


Passport.deserializeUser<Persistence.User, string>(function(username: string, done: (err: any, id: Persistence.User) => void) {
    Persistence.CredentialCache.getEntry(username, function(user: Persistence.User) {
        debug("Deserialize %o", user);
        if (user) {
            done(null, user);
        } else {
            done(new Error("User " + username + " not found in database"), null);
        }
    });

});

Passport.use(new AtlassianOAuthStrategy.Strategy({
    applicationURL: Config.jira.baseurl,
    callbackURL: Config.oauthcallbackurl,
    consumerKey: Config.consumerKey,
    consumerSecret: Config.consumerSecret
},
    function(token: string, tokenSecret: string, profile: JIRARest.User, done: (err: any, id: Persistence.User) => void) {

        var user = new Persistence.User(profile.id, profile.username, profile.displayName, profile.emailAddress, token, tokenSecret);
        Persistence.CredentialCache.addOrUpdateEntry(user);
        return done(null, user);
    }
)
);



/* GET users listing. */
router.post("/", Passport.authenticate("atlassian-oauth", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));


router.get("/atlassian-oauth",
    Passport.authenticate("atlassian-oauth"),
    function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        // The request will be redirected to the Atlassian app for authentication, so this
        // function will not be called.
    });


router.get("/atlassian-oauth/callback",
    Passport.authenticate("atlassian-oauth", {
        failureRedirect: "/login"
    }),
    function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        res.redirect("/");
    });

router.get("/logout", function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    req.logout();
    res.redirect("/");
});

export = router;
