$(function(){
    var Country = Backbone.Model.extend();
    var Countries = Backbone.Collection.extend({
        url: 'countries',
        model: Country
    });

    var CountryView = Backbone.View.extend({
        tagName: "option",
        
        initialize: function(){
            _.bindAll(this, 'render');
        },       
        render: function(){
            $(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
            return this;
        }
    });
    
    var CountriesView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll);
        },        
        addOne: function(city){
            $(this.el).append(new CountryView({ model: city }).render().el);
        },        
        addAll: function(){
            this.collection.each(this.addOne);
        }
    });
            
    var countries = new Countries();    
    new CountriesView({el: $("#country"), collection: countries});    
    countries.fetch();
});