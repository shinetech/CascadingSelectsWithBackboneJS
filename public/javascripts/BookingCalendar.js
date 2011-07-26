// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

    // Model Classes
    // ----------

    var Country = Backbone.Model.extend();
    var City = Backbone.Model.extend();
    var Suburb = Backbone.Model.extend(); 
    
    // Collection Classes
    // ---------------
    var Categories = Backbone.Collection.extend({
        clear: function() {
            this.reset();
            this.selected = null;
        }       
    });
    
    var Countries = Categories.extend({
        url: 'countries',
        model: Country,
        setSelectedId: function(countryId) {
            this.cities.setParentId(countryId);
        }
    });

    var Cities = Categories.extend({
        model: City,
        setSelectedId: function(cityId) {
            this.suburbs.setParentId(cityId);
        },
        setSelected: function(city) {
            this.selected = city;
            this.setCountryId(city.get('countryId'));           
        },
        setParentId: function(countryId){
            if (countryId) {
                this.setCountryId(countryId);
            }
            else {
                this.reset();
            }
            
            this.countryId = countryId;
            this.suburbs.clear();
        },
        setCountryId: function(countryId) {
            this.url = 'countries/' + countryId + '/cities';
            this.fetch();           
        }                   
    });

    var Suburbs = Categories.extend({
        model: Suburb,
        setSelectedId: function(suburbId) {
            this.selected = this.get(suburbId);
        },
        setSelected: function(suburb) {
            this.selected = suburb;
            this.setCityId(suburb.get('cityId'));      
        },
        setParentId: function(cityId) {
            if (cityId) {
                this.setCityId(cityId);
            } else {
                this.clear();
            }
            
            this.cityId = cityId;           
        },
        setCityId: function(cityId) {
            this.url = 'cities/' + cityId + '/suburbs';
            this.fetch();           
        }
    });
  
    // Views
    // --------------
    
    // Used for displaying a country, city, city or suburb
    var CategoryView = Backbone.View.extend({
        tagName: "option",
        
        initialize: function(){
            _.bindAll(this, 'render');
        },
        
        render: function(){
            $(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
            return this;
        }
    });
    
    // Used for displaying a list of countries, cities, cities or suburbs
    var CategoriesView = Backbone.View.extend({
        events: {
            "change": "changeSelected"
        },
        
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll', 'render');

            this.categoryViews = [];            
            this.collection.bind('reset', this.addAll);
            this.collection.bind('all', this.render);
        },
        
        render: function(){
            return this;
        },
        
        addOne: function(city){
            var categoryView = new CategoryView({ model: city });
            this.categoryViews.push(categoryView);          
            $(this.el).append(categoryView.render().el);
        },
        
        addAll: function(){
            // Clear out the old options
            _.each(this.categoryViews, function(categoryView) { categoryView.remove(); });
            this.categoryViews = [];
            $(this.el).attr('disabled', this.collection.length < 1);            
            this.collection.each(this.addOne);
            
            var selected = this.collection.selected;
            if (selected) {
                $(this.el).val(selected.id);    
            }                       
        },
        
        changeSelected: function(e){
            this.collection.setSelectedId($(this.el).val());
        }
    });
    
        
    // Bootstrap everything in a function to avoid polluting the global namespace
    function setup(){
        var countries = new Countries();        
        var cities = new Cities();        
        var suburbs = new Suburbs();
        
        countries.cities = cities;
        cities.suburbs = suburbs;      
        
        new CategoriesView({el: $("#country"), collection: countries});
        new CategoriesView({el: $("#city"), collection: cities});
        new CategoriesView({el: $("#suburb"),collection: suburbs});
        
        countries.fetch();
        
//        new Suburb({id:3}).fetch({success: function(suburb){
//            suburbs.setSelected(suburb);
//            new City({id: suburb.get('cityId')}).fetch({success: function(city){
//                cities.setSelected(city);
//                $('#country').val(city.get('countryId'));
//            }});
//        }});        
    }
    
    setup();
});