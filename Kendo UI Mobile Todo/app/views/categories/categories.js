define([
    'views/view',
    'text!views/categories/categories.html',
    'app'
], function (View, html, app) {

    var model = {
        categories: app.data.categories,
        title: 'Title',
        beforeShow: function() {
            app.data.categories.filter([]);
        },
        onCategorySelect: function (e) {
            var cat = {
                Id: e.data.Id,
                name: e.data.name
            };
            localStorage.setItem("defaultCategory", JSON.stringify(cat));
            $.publish("/category/selected", [ cat ]);
        }
    };

    var view = new View('categories', html, model);

    $.subscribe('/newCategory/add', function (e, text) {
        var cat = model.categories.add({
            name: text
        });
        model.categories.one('sync', function () {
            $.publish('/newCategory/added', [ cat ]);
        });
        model.categories.sync();
    });

});