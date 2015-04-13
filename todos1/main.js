//require����
require.config({
	baseUrl:'../',
	paths:{
		jquery:'lib/jquery-1.10.2',
		underscore:'lib/underscore',
		backbone:'lib/backbone',
		localStorage:'lib/backbone.localStorage',
		text:'lib/text',
		appView:'todos1/views/appView',
		itemView:'todos1/views/itemView',
		todo:'todos1/models/todo',
		todoList:'todos1/collections/todoList'
	},
	shim:{
		'underscore':{exports:'_'}
	}
});
//����Ӧ�ó���
require(['appView'], function(AppView){
	var app_view = new AppView();
});