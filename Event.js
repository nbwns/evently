var mongoose = require('mongoose');
var _ = require('underscore');
var moment = require('moment');

var eventSchema = new mongoose.Schema({
    name: String,
    //shortName: String,
    //typeCode: String,
    //description: String,
    //dates: [Date],
    datetime:{
        date: Date,
        timeStart: String,
        timeEnd: String,    
    },
    
    /*prices: [
            {
                name: String,
                price: Number
            }    
        ],*/
    availableSpots: Number,
    place: {
        name: String,
        street: String,
        number: String,
        zip: String,
        city: String
    },
    attendees:[{ type:mongoose.Schema.ObjectId, ref:"Attendee" }]
});

eventSchema.virtual('spotsLeft').get(function( ) {
    return this.availableSpots - this.attendees.length;
});

eventSchema.set('toObject', { virtuals: true });
eventSchema.set('toJSON', { virtuals: true });

var Event = mongoose.model('Event',eventSchema);

module.exports = {
    Event: Event,
    seed: function(){
        var event1 = new Event(
            {
                name: "Formation au langage des signes pour bébés", 
                /*shortName: "Signes bébé juin", 
                typeCode: "signesbebe",
                description: "Trop cool",
                dates: [new Date()], */
                datetime:{
                    date: new Date(),
                    timeStart: "09:00",
                    timeEnd: "16:00",    
                },
                //prices: [{name:"Personne seule", price:30 },{name:"Couple", price: 40}],
                availableSpots: 12,
                place:{
                    name: "Enfants Admis",
                    street: "Chaussée de Waterloo",
                    number: "48",
                    zip: "1180",
                    city: "Uccle"
                }
            });
        event1.save();
        return event1;
    },
    list: function(req,res){
        Event.find({}, function(err, events){
            if(err){
                console.log(err);
            }
            
            res.send(events);
        })
    },
    add: function(req,res){
        var event = new Event(req.body);
        event.datetime.date = moment(req.body.datetime.date,"DD/MM/YYYY").toDate();
        event.save(function(err){
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            res.send(event);
        });
        
    }
};