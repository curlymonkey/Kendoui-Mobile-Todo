define([
  'views/view',
  'text!views/newCategory/newCategory.html'
], function (View, html) {
  
  var view, modalView;

  var model = kendo.observable({
    text: null,
    close: function (e) {
      modalView.close();
    },
    add: function (e) {
      $.publish('/newCategory/add', [ this.get('text') ]);
      modalView.close();
    }
  });

  var events = {
    init: function (e) {
      modalView = e.sender;
    }
  };

  return new View('newCategory', html, model, events);

});