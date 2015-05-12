define(['backbone','underscore','TaskModel','jqm'], function(Backbone, _, TaskModel){
	var taskView = Backbone.View.extend({
		tagName:'li',
		template:_.template(''),
		events:{

		},
		initialize:function(){

		}

	});
	return taskView;
});