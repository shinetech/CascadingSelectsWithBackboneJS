$(function(){
    var Country = Backbone.Model.extend();
    var Countries = Backbone.Collection.extend({
        url: 'countries',
        model: Country
    });

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
            
    var countries = new Countries();    
    new CategoriesView({el: $("#country"), collection: countries});    
    countries.fetch();
});