var express = require('express');
var router = express.Router();
var Config = require('../app/config');
var request = require('request');



var CredentialCache = require('../app/models/credentialcache');




/* GET home page. */
router.get('/', function(req, res, next) {
  var user=null;

  if(req.user){
    CredentialCache.getEntry(req.session.passport.user,function(userProfile){
      res.render('index', { title: Config.apptitle, user:{name:userProfile.fullName}});
    });
  } else {
    res.render('index', { title: Config.apptitle, user:null});
  }


});




module.exports = router;
