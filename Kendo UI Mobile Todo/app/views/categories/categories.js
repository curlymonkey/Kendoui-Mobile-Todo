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
        onCategorySelect : function(e) {
            var cat = { id: e.data.id, name: e.data.name };
            localStorage.setItem("defaultCat", JSON.stringify(cat));
            $.publish('/category/selected', [ cat ]);
            APP.instance.navigate('todos?category=' + e.data.Id);
        }
    };

    return new View('categories', html, model);

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