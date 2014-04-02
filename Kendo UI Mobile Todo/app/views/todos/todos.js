define([
    'views/view',
    'text!views/todos/todos.html',
    'app',
    'views/categories/categoriesDataSource'
], function (View, html, app, CatDataSrc) {

    var view;
    var navbar;
    var category;

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

    var findCategory = function (id) {
        return $.Deferred(function(dfd) {
            if(!id) {
                dfd.resolve(app.defaults.category);
            } else {
                var ds = new CatDataSrc({}, { field: "Id", operator: "eq", value: id });
                ds.fetch(function() {
                    dfd.resolve(this.view()[0]);
                })
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
        afterShow: function (e) {
            findCategory(e.view.params.category).then(function(category) {
				todosDataSource.filter({
                    field: 'category',
                    operator: 'eq',
                    value: category.id
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

});