define([
  'backbone',
  'zepto',
  'templates'
], function (Backbone, $, templates) {
  'use strict';

  return Backbone.View.extend({
    template: templates.hello,

    render: function () {
      $(this.el).html(this.template({ someone: 'World' }));
    }
  });
});
