define([
  'views/view',
  'text!views/categories/categories.html',
  'views/categories/categoriesDataSource'
], function (View, html, catDataSrc) {

  var model = {
    categories: new catDataSrc(),
    title: 'Title',
    onCategorySelect : function(e) {
        var cat = { id: e.data.id, name: e.data.name };
        localStorage.setItem("defaultCategory", JSON.stringify(cat));
    }
  };

  var view = new View('categories', html, model);

  $.subscribe('/newCategory/add', function (e, text) {
    categories.add({ name: text });
  });

});