define([
  'backbone',
  'zepto',
  'views/hello'
], function (Backbone, $, HelloView) {
  'use strict';

  return Backbone.Router.extend({
    routes: {
      '': 'hello'
    },

    hello: function () {
      var view = new HelloView({el: $('#hello')});
      view.render();
    }
  });
});
