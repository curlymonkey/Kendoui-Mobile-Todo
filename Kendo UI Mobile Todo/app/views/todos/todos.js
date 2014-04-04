define([
    'views/view',
    'text!views/todos/todos.html',
    'app'
], function (View, html, app) {

    var view;
    var navbar;
    var category;
    var fetchedCats = false;    
    var fetchMeMaybe = function(cb) {
        if(!fetchedCats) {
            fetchedCats = true;
            app.data.categories.fetch(cb);
        } else {
            cb();
        }
    };
    
    var findCategory = function (id) {
        return $.Deferred(function(dfd) {
            if(!id) {
                dfd.resolve(app.defaults.category);
            } else {
                fetchMeMaybe(function() {
                    app.data.categories.filter({ field: "Id", operator: "eq", value: id });
                		dfd.resolve(app.data.categories.view()[0]);
                });
            }
        }).promise();
    };

    var model = kendo.observable({
        todos: app.data.todos
    });

    var events = {
        init: function (e) {
            navbar = e.view.header.find('.km-navbar').data('kendoMobileNavBar');
        },
        show: function(e) {
            this.loader.show();
        },
        afterShow: function (e) {
            var self = this;
            findCategory(e.view.params.category).then(function(category) {
                self.loader.hide();
				model.todos.filter({
                    field: 'Category',
                    operator: 'eq',
                    value: category.Id
                });
                navbar.title(category.name);                
            });
        }
    };

    view = new View('todos', html, model, events);
});