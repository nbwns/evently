var mongoose = require('mongoose');
var userAuth = require('./UserAuth.js');
var events = require('./Event.js');
var attendees = require('./Attendee.js');
var express = require('express');
var bodyParser = require('body-parser');
var mustache = require('mustache');
var cors = require("cors");
var app = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(express.static(__dirname + '/client'));
app.set('view engine', 'mustache');
app.use( bodyParser.json() );
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());

mongoose.connect('mongodb://xxx:xxx@ds038379.mlab.com:38379/evently');

userAuth.seed();
/*var e = events.seed()
attendees.seed(e);*/

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("processing...")
    userAuth.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("no user found");
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        console.log("password invalid");
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("auth successful");
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.post('/',
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/loginfail',
                                   failureFlash: false })
);

app.get('/dashboard', function(req,res){
    console.log(req.user);
    //if(req.user){
      res.sendfile(__dirname + '/client/dashboard.html');  
    /*}
    else{
      res.send("not logged in !");
    }*/
});

app.get('/loginfail', function(req,res){
    res.send("Wrong login or password");
});

app.get('/api/events', events.list);
app.post('/api/events', events.add);
app.post('/api/events/:eventid/attendees', attendees.add)

app.set('port', process.env.PORT || 3000);
app.listen(process.env.PORT || app.get('port'), process.env.IP || "0.0.0.0", function(){
   console.log('Express started on port ' + app.get('port')); 
});

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 
