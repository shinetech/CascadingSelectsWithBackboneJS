// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

    // Model Classes
    // ----------

    var Network = Backbone.Model.extend({});
    var Site = Backbone.Model.extend({urlRoot: 'service/sites'});
    var Area = Backbone.Model.extend({urlRoot: 'service/areas'});
    var Product = Backbone.Model.extend({urlRoot: 'service/products'}); 
    
    // Collection Classes
    // ---------------
    var Categories = Backbone.Collection.extend({
        clear: function() {
            this.reset();
            this.selected = null;
        }       
    });
    
    var Networks = Categories.extend({
        url: 'service/networks',
        model: Network,
        setSelectedId: function(networkId) {
            this.sites.setParentId(networkId);
        }
    });

    var Sites = Categories.extend({
        model: Site,
        setSelectedId: function(siteId) {
            this.areas.setParentId(siteId);
        },
        setSelected: function(site) {
            this.selected = site;
            this.setNetworkId(site.get('networkId'));           
        },
        setParentId: function(networkId){
            if (networkId) {
                this.setNetworkId(networkId);
            }
            else {
                this.reset();
            }
            
            this.networkId = networkId;
            this.areas.clear();
        },
        setNetworkId: function(networkId) {
            this.url = 'service/networks/' + networkId + '/sites';
            this.fetch();           
        }                   
    });

    var Areas = Categories.extend({
        model: Area,
        setSelectedId: function(areaId) {
            if (this.products) {
                this.products.setParentId(areaId);
            }
        },
        setSelected: function(area) {
            this.selected = area;
            this.setSiteId(area.get('siteId'));         
        },
        setParentId: function(siteId) {
            if (siteId) {
                this.setSiteId(siteId);
            } else {
                this.reset();
            }
            
            this.siteId = siteId;
            this.clear();           
        },
        setSiteId: function(siteId) {
            this.url = 'service/sites/' + siteId + '/areas';
            this.fetch();           
        },
        clear: function() {
            Categories.prototype.clear.call(this);
            if (this.products) {
                this.products.clear();
            }
        }       
    });

    var Products = Categories.extend({
        model: Product,
        setSelectedId: function(productId) {
            this.selected = this.get(productId);
        },
        setSelected: function(product) {
            this.selected = product;
            this.setAreaId(product.get('areaId'));      
        },
        setParentId: function(areaId) {
            if (areaId) {
                this.setAreaId(areaId);
            } else {
                this.clear();
            }
            
            this.areaId = areaId;           
        },
        setAreaId: function(areaId) {
            this.url = 'service/areas/' + areaId + '/products';
            this.fetch();           
        }
    });
  
    // Views
    // --------------
    
    // Used for displaying a network, site, area or product
    var CategoryView = Backbone.View.extend({
        tagName: "option",
        
        initialize: function(){
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
            this.model.view = this;
        },
        
        render: function(){
            $(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
            return this;
        }
    });
    
    // Used for displaying a list of networks, sites, areas or products
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
        
        addOne: function(site){
            var categoryView = new CategoryView({ model: site });
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
        var networks = new Networks();      
        var sites = new Sites();        
        var areas = new Areas();        
        var products = new Products();
        
        networks.sites = sites;
        sites.areas = areas;
        areas.products = products;      
        
        var networksView = new CategoriesView({el: $("#network"), collection: networks});
        var sitesView = new CategoriesView({el: $("#site"), collection: sites});
        var areasView = new CategoriesView({el: $("#area"), collection: areas});
        var productsView = new CategoriesView({el: $("#product"),collection: products});
        
        networks.fetch();
        
        new Product({id:3}).fetch({success: function(product){
            products.setSelected(product);
            new Area({id: product.get('areaId')}).fetch({success: function(area){
                areas.setSelected(area);
                new Site({id: area.get('siteId')}).fetch({success: function(site){
                    sites.setSelected(site);
                    $('#network').val(site.get('networkId'));
                }});
            }});
        }});        
    }
    
    setup();
});