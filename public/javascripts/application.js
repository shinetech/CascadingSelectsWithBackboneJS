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
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll);
        },        
        addOne: function(location){
            $(this.el).append(new LocationView({ model: location }).render().el);
        },        
        addAll: function(){
            this.collection.each(this.addOne);
        }
    });
            
    var countries = new Countries();
    
    new LocationsView({el: $("#country"), collection: countries});
    new LocationsView({el: $("#cities"), collection: new Cities()});
    new LocationsView({el: $("#suburbs"), collection: new Suburbs()});
    
    countries.fetch();
});