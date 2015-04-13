define(['backbone'], function(Backbone){
// Our basic **Todo** model has `title`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

    // Default attributes for the todo item.
	//ʹ�õ��Ǻ��������Ƕ�����Ϊ������ڽű����ص�ʱ��ִ�У��������ٵ��õ�ʱ���ִ�У���Ȼ�ᱨ��
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