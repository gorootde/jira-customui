User = function(id,name, fullName, email,token, tokenSecret){
    this.userid = id;
    this.name = name;
    this.fullName = fullName;
    this.email = email;
    this.token = token;
    this.tokenSecret = tokenSecret;
};

//Just a simple Array for now
module.exports = User;