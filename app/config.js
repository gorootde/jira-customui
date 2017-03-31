var fs = require('fs');

var config={
  apptitle:"My fancy prototype",
  oauthcallbackurl:"http://localhost:3000/auth/atlassian-oauth/callback",
  consumerSecret:fs.readFileSync('keys/oauth.pem').toString(),
  consumerKey: "mysecretkey",
  jira:{
    baseurl:"http://localhost:8080/"
  }
};

module.exports=config;
