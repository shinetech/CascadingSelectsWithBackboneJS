$(function(){
    var Country = Backbone.Model.extend();
    var City = Backbone.Model.extend({urlRoot:'cities'});
    var Suburb = Backbone.Model.extend({urlRoot:'suburbs'});
    
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
            if (this.selectedId) {
                $(this.el).val(this.selectedId);
            }
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
            this.citiesView.selectedId = null;
            this.citiesView.setCountryId(countryId);
            
            this.suburbsView.collection.reset();
            this.suburbsView.setDisabled(true);
        }
    });    

    var CitiesView = LocationsView.extend({
        setSelectedId: function(cityId) {
            this.suburbsView.selectedId = null;
            this.suburbsView.setCityId(cityId);
        },
        setCountryId: function(countryId) {
            this.populateFrom("countries/" + countryId + "/cities");
        }
    });    

    var SuburbsView = LocationsView.extend({
        setSelectedId: function(cityId) {
            // Do nothing
        },
        setCityId: function(cityId) {
            this.populateFrom("cities/" + cityId + "/suburbs");
        }
    });    
    
    var countries = new Countries();
    
    var countriesView = new CountriesView({el: $("#country"), collection: countries});
    var citiesView = new CitiesView({el: $("#city"), collection: new Cities()});
    var suburbsView = new SuburbsView({el: $("#suburb"), collection: new Suburbs()});
    
    countriesView.citiesView = citiesView;
    countriesView.suburbsView = suburbsView;
    citiesView.suburbsView = suburbsView;
    
    var suburbId = 3;
    
    new Suburb({id:suburbId}).fetch({success: function(suburb){
        suburbsView.selectedId = suburb.id;        
        var cityId = suburb.get('city_id');
        suburbsView.setCityId(cityId);
        
        new City({id: cityId}).fetch({success: function(city){
            citiesView.selectedId = city.id;
            var countryId = city.get('country_id');
            citiesView.setCountryId(countryId);
            
            countriesView.selectedId = countryId;
            countries.fetch();
        }});
    }});
});