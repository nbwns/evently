var mongoose = require('mongoose');
var relationship = require("mongoose-relationship");
var events = require('./Event.js');

var attendeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    status: String,
    event: { type:mongoose.Schema.ObjectId, ref:"Event", childPath:"attendees" }
});

attendeeSchema.plugin(relationship, { relationshipPathName:'event' });

var Attendee = mongoose.model('Attendee',attendeeSchema);

module.exports = {
    seed: function(event){
        var attendee1 = new Attendee({
            firstName: "Laura",
            lastName: "Vanderpipenzeel",
            phone: "0499455636",
            email: "laura@laura.lol",
            status: "paid",
            event: event._id
        });
        attendee1.save();
    },
    add: function(req,res){
        var attendee = new Attendee(req.body);
        attendee.event = req.params.eventid;
        
        events.Event.findOne({_id:attendee.event}, function(err, event){
            if(err){
                console.log(err);
            }
            console.log(event);
            console.log(event.spotsLeft, (event.spotsLeft > 0));
            if(event.spotsLeft > 0){
                attendee.save(function(err){
                    if(err){
                        console.log(err);
                        res.status(500).send(err);
                    }
                    res.send(attendee);    
                });
            }
            else{
                res.status(500).send("soldout");
            }
        });
    }
};