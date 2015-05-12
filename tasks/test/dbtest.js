var Task = require('../model/taskModel');
var data1 = {title:'playing', content:'to play the pingpang'};
var data2 = {title:'working', content:'learning the nodejs and mongodb'};
//var mytask = new Task(data2);
//mytask.save(function(err, result){
//	console.log(result);
//});

//Task.get('55498f1200d2f19431c3964f', function(err, result){
//    console.log(result);
//})

//Task.update('55498f1200d2f19431c3964f',{title: 'this is the update content'},function(err, result){
//    console.log(result);
//})

//Task.delete('55498f1200d2f19431c3964f',function(err, result){
//    console.log(result);
//});
//Task.get(function(err, result){
//    console.log(result);
//});

//Task.getByTime('1430888059072',function(err,result){
//    if(err){
//        console.log(err);
//    }
//	console.log(result);
//});
//测试获取任务的详细信息
Task.getTaskDetail('1430888059072',function(err,result){
   console.log(result);
});