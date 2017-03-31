var User = require('./user');
var Datastore = require('nedb');
var debug=require('debug')('CredentialCache');



CredentialCache = function(){
    var _self = this;

    _self.db=new Datastore({filename:'db/databasedata',autoload:true});


    _self.addOrUpdateEntry = function(user) {

      var query={userid:user.userid};
      debug('addOrUpdateEntry given user=%o query=%o',user,query)
      _self.db.update(query,user,{upsert:true});
    };

    _self.getEntry = function(userid,callback) {
      debug('getEntry userid=%o',userid);
      _self.db.findOne({userid:userid},function(err,docs){
        debug('getEntry userid=%o result=%o err=%o',userid,docs,err);
        callback(docs);
      });

    };

    _self.removeEntry = function(userid) {
      _self.db.remove({userid:userid});
    };
};

module.exports = new CredentialCache();
