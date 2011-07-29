$(function(){
    var Country = Backbone.Model.extend();
    var City = Backbone.Model.extend();
    var Suburb = Backbone.Model.extend();
    
    var Countries = Backbone.Collection.extend({
        url: 'countries',
        model: Country
    });
    
    var Cities = Backbone.Collection.extend({
        model: City
    });
    
    var Suburbs = Backbone.Collection.extend({
        model: Suburb
    });    
    
    var LocationView = Backbone.View.extend({
        tagName: "option",
        
        initialize: function(){
            _.bindAll(this, 'render');
        },       
        render: function(){
            $(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
            return this;
        }
    });
    
    var LocationsView = Backbone.View.extend({
        events: {
            "change": "changeSelected"
        },
        
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll);            
        },        
        addOne: function(location){
            var locationView = new LocationView({ model: location });
            this.locationViews.push(locationView);
            $(this.el).append(locationView.render().el);
        },        
        addAll: function(){
            _.each(this.locationViews, function(locationView) { locationView.remove(); });
            this.locationViews = [];
            this.collection.each(this.addOne);
        },
        changeSelected: function(){
            this.setSelectedId($(this.el).val());
        },
        populateFrom: function(url) {
            this.collection.url = url;
            this.collection.fetch();
            this.setDisabled(false);
        },
        setDisabled: function(disabled) {
            $(this.el).attr('disabled', disabled);
        }
    });
            
    var CountriesView = LocationsView.extend({
        setSelectedId: function(countryId) {
            this.citiesView.populateFrom("countries/" + countryId + "/cities");
            
            this.suburbsView.collection.reset();
            this.suburbsView.setDisabled(true);
        }
    });    

    var CitiesView = LocationsView.extend({
        setSelectedId: function(cityId) {
            this.suburbsView.populateFrom("cities/" + cityId + "/suburbs");
        }        
    });    

    var SuburbsView = LocationsView.extend({
        setSelectedId: function(cityId) {
            // Do nothing
        }        
    });    
    
    var countries = new Countries();
    
    var countriesView = new CountriesView({el: $("#country"), collection: countries});
    var citiesView = new CitiesView({el: $("#city"), collection: new Cities()});
    var suburbsView = new SuburbsView({el: $("#suburb"), collection: new Suburbs()});
    
    countriesView.citiesView = citiesView;
    countriesView.suburbsView = suburbsView;
    citiesView.suburbsView = suburbsView;
    
    countries.fetch();
});