var app = angular.module("dashboardApp",['moment-picker']);

app.controller("DashboardController", function($scope, $http){
    var dashboard = this;
    dashboard.showForm = false;
    
    $http.get('/api/events').success(function(data) {
        dashboard.events = data;
    });
    
    dashboard.show = function(){
        dashboard.showForm = true;
    }
    
    dashboard.add = function(){
        dashboard.vm.spotsLeft = dashboard.vm.availableSpots;
        $http.post("/api/events", dashboard.vm).success(function(data){
            console.log(data);
            dashboard.events.push(data);
            dashboard.vm = null;
            dashboard.showForm = false;
        });
    };

});