//
//     Copyright (C) 2017  Michael Kolb
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>.

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
