define([
    'views/view',
    'text!views/todos/todos.html',
    'app',
    'views/categories/categoriesDataSource'
], function (View, html, app, CatDataSrc) {

    var view;
    var navbar;
    var category;
    var catDataSrc = new CatDataSrc();
    var fetchedCats = false;

    var todoModel = {
        id: 'Id',
        fields: {
            title: {
                field: 'Title',
                defaultValue: ''
            },
            createdAt: {
                field: 'CreatedAt',
                defaultValue: new Date()
            },
            category: {
                field: 'category',
                defaultValue: null
            },
            userId: {
                field: 'UserId',
                defaultValue: null
            }
        }
    };

    var todosDataSource = new kendo.data.DataSource({
        type: 'everlive',
        schema: {
            model: todoModel
        },
        transport: {
            // Required by Everlive
            typeName: 'Todos'
        },
        sort: {
            field: 'CreatedAt',
            dir: 'desc'
        }
    });
    
    var fetchMeMaybe = function(cb) {
        if(!fetchedCats) {
            fetchedCats = true;
            catDataSrc.fetch(cb);
        } else {
            cb();
        }
    }
    
    // TODO: Stop calling cat endpoint EVERY time here, please ;-)
    var findCategory = function (id) {
        return $.Deferred(function(dfd) {
            if(!id) {
                dfd.resolve(app.defaults.category);
            } else {
                fetchMeMaybe(function() {
                    catDataSrc.filter({ field: "Id", operator: "eq", value: id });
                		dfd.resolve(catDataSrc.view()[0]);
                });
            }
        }).promise();
    };

    var model = kendo.observable({
        todos: todosDataSource
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
				todosDataSource.filter({
                    field: 'Category',
                    operator: 'eq',
                    value: category.Id
                });
                navbar.title(category.name);                
            });
        }
    };

    view = new View('todos', html, model, events);

    $.subscribe('/newTodo/add', function (e, text) {
        todos.add({
            title: text,
            category: category
        });
    });

    $.subscribe('/newCategory/add', function(e) {
        catDataSrc.fetch();
    });
});