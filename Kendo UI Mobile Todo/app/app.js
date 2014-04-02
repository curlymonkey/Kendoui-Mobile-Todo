define([
    'settings'
], function (settings) {
    var loadUI = function () {
        return $.Deferred(function (dfd) {
            require([
                'views/todos/todos',
                'views/categories/categories',
                'views/newTodo/newTodo',
                'views/newCategory/newCategory'
            ], function () {
                dfd.resolve();
            })
        }).promise();
    };
    
    //TODO: Stop calling cat service EVERY time. 
    var getDefaultCat = function (target) {
        return $.Deferred(function (dfd) {
            var defaultCat = localStorage.getItem("defaultCat");
            if (!defaultCat) {
                require(['views/categories/categoriesDataSource'], function (CatDataSrc) {
                    var cats = new CatDataSrc({}, {
                        field: "IsDefault",
                        operator: "eq",
                        value: true
                    });
                    cats.fetch(function () {
                        localStorage.setItem("defaultCat", JSON.stringify(this.data()[0]));
                        dfd.resolve(this.data()[0]);
                    });
                });
            } else {
                dfd.resolve(JSON.parse(defaultCat));
            }
        }).promise();
    };

    var app = {
        defaults: {},
        init: function () {
            var self = this;
            self.bes = new Everlive({
                apiKey: settings.everlive.apiKey,
                scheme: settings.everlive.scheme
            });
            $.when(loadUI(), getDefaultCat()).then(function (nil, cat) {
                self.defaults.category = cat;
                self.instance = new kendo.mobile.Application(document.body, {
                    skin: 'flat',
                    initialView: 'todos'
                });
            });
        }
    };

    return app;
});