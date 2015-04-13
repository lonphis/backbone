define(['backbone'], function(Backbone){
// Our basic **Todo** model has `title`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

    // Default attributes for the todo item.
	//使用的是函数，不是对象，因为对象会在脚本加载的时候执行，而函数再调用的时候才执行，不然会报错
    defaults: function() {
      return {
        title: "empty todo...",
        order: 1,
        done: false
      };
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });
  return Todo;
});