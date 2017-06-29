var mongoose = require('mongoose');

var authSchema = new mongoose.Schema({
    username: String,
    password: String
});

authSchema.methods.validPassword = function( pwd ) {
    // TODO: crpyt the password :)
    return ( this.password === pwd );
};

var UserAuth = mongoose.model('UserAuth',authSchema);

module.exports = {
    findOne: function(params, callback){
        console.log("findOne");
        UserAuth.findOne(params, callback);
    },
    seed: function(){
        UserAuth.find({ username:"marie" }).remove(function(){
            var admin = new UserAuth({username:"marie", password: "bakedbean"});
            admin.save(function(err) {
                if (err) throw err;
            });    
        });
    }
}
    