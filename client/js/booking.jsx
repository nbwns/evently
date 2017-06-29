import React from 'react';
import ReactDOM from 'react-dom';
var moment = require('moment');
require('jquery');

var EventList = React.createClass({
      getInitialState: function() {
        return { 
            events: [],
            tableVisibility:"hidden",
            selectedEvent: null
        };
     },
     ajaxRequest: function() {
        this.serverRequest = $.get("/api/events", result => {
            this.setState({
              events: result,
              tableVisibility:""
            });
        });
      },
      componentDidMount: function(){
        this.ajaxRequest();
      },
      componentWillUnmount: function() {
        this.serverRequest.abort();
      },
      handleClick: function(event){
        console.log(event);
        this.setState({
            selectedEvent: event
        });
      },
      render: function() { 
    console.log(this.state.selectedEvent);
    		var eventRows = this.state.events.map(e => {
    		    return (
    		        <tr key={e._id}>
    		            <td>
    		                {e.name}
    		            </td>
    		            <td>
    		                {moment(e.datetime.date).format("DD/MM/YYYY")}
    		            </td>
    		            <td>
    		                {e.spotsLeft}
    		            </td>
    		            <td>
    		                <button  onClick={this.handleClick.bind(this,e)} className="btn btn-primary" disabled={e.spotsLeft == 0} >S'inscrire</button>
    		            </td>
    		        </tr>
    		    );
    		})
    		
    		
    		return (
    		    <div>
        		    <table className={ `table ${this.state.tableVisibility}`}>
        		        <tbody>
        		        <tr>
        		            <th>Formation</th>
                            <th>Date</th>
                            <th>Places encore disponibles</th>
                            <th></th>
        		        </tr>
        		        {eventRows}
        		        </tbody>
        		    </table>
        		    {this.state.selectedEvent ? <EventForm event={this.state.selectedEvent}/> : null }
    		    </div>
            );
      }
});

var EventForm = React.createClass({
   updateLastName: function(e){
       this.setState({lastName: e.target.value})
   },
   updateFirstName: function(e){
       this.setState({firstName: e.target.value})
   },
   updateEmail: function(e){
       this.setState({email: e.target.value})
   },
   handleSubmit: function(e){
        $.post(`api/events/${this.props.event._id}/attendees`, this.state)
        .done(function(data){
            alert("votre inscription est prise en compte");
            console.log(data);
        })
        .fail(function(xhr){
            if(xhr.responseText == "soldout"){
                alert("plus de places disponibles");
            }
        });
        e.preventDefault();
   },
   render: function(){
       return (
            <div className="well">
                <h2>S'inscrire à {this.props.event.name}</h2>
                <form onSubmit={this.handleSubmit}>
                   <TextInput id="lastName" label="Nom" type="text" onChange={this.updateLastName}/>
                   <TextInput id="firstName" label="Prénom"  type="text" onChange={this.updateFirstName}/>
                   <TextInput id="email" label="Adresse e-mail"  type="text" onChange={this.updateEmail}/>
                   <button type="submit" className="btn btn-primary">S'inscrire</button>
                </form>
            </div>
       );
   } 
});

var TextInput = React.createClass({
    render: function(){
        return (
        <div className="form-group">
            <label htmlFor={this.props.id}>{this.props.label}</label>
            <input type={this.props.type} className="form-control" id={this.props.id} id={this.props.name} onChange={this.props.onChange}/>
        </div>);
    }
});

var NumberSelect = React.createClass({
    render: function(){
        var options=[];
        for(let i=this.props.min; i <= this.props.max; i++){
            options.push(<option value={i}>{i}</option>);
        }
        
        return (
            <div className="form-group">
            <label htmlFor={this.props.id}>{this.props.label}</label>
            <select className="form-control" id={this.props.id}>
                {options}
            </select>
        </div>
            
        );
    } 
});

ReactDOM.render(
  <EventList />,
  document.getElementById('container')
);