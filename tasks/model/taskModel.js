/*任务模型*/
var util = require('../lib/util');
var config = require('./db.config'), mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient;
  ObjectId = mongodb.ObjectId;

function Task(task){
  this.title = task.title;
  this.content = task.content;
  this.state = task.state;
  this.time = task.time;
  this.id = task._id;
}

Task.prototype.isConnected = function(){
  return this.isConnected ? true : false;
}
Task.ObjectId = function(id){
  return new ObjectId(id);
}
Task.getId = function(objectid){
  return objectid.str;
}
/*change the _id of the results*/
//Task.changeResult = function (results){
//  if(Array.isArray(results)){
//    for(var a=0; i< results.length; i++){
//            results[i]._id = results[i]._id.str;
//        }
//  }else{  //if results is not array,just fix it
//    results._id = results._id.str;
//  }
//    console.log(results);
//  return results;
//}
/*保存数据*/
Task.prototype.save = function (callback){
  var task  = {title: this.title,content: this.content,
        state:this.state || 'undone',time:this.time  || (new Date()).getTime()};
  MongoClient.connect(config.url, function(err, db){
    if(err)
      return callback(err);
    var collection = db.collection('tasks');
    collection.insert(task, {safe:true}, function(err, result) {
      db.close();
      callback(err, result);
    });
  });
}
/*更新数据库*/
Task.update = function(id, data, callback) {
  MongoClient.connect(config.url, function(err, db){
    if(err) return callback(err);
    db.collection('tasks', function(err, collection){
      if(err){
        db.close();
        return callback(err);
      }
      collection.update({_id: Task.ObjectId(id)}, {$set: data},function(err, result){
        db.close();
        if(result){
          //change the _id of the result
          callback(err, result);
        }else{
          callback(err, null);
        }
      });
    });
  });
}
/*删除任务*/
Task.delete = function(id, callback){
  MongoClient.connect(config.url, function(err, db){
    if(err) return callback(err);
    db.collection('tasks', function(err, collection){
      if(err){
        db.close();
        return callback(err);
      }
      collection.remove({_id: Task.ObjectId(id)}, function(err, result){
        db.close();
        if(result){
          callback(err, result);
        }else{
          callback(err, null);
        }
      });
    });
  });
};
/*获取一个任务*/
Task.get = function(id, callback){
  MongoClient.connect(config.url, function(err, db){
    if (err) {
      return callback(err);
    }
    db.collection('tasks', function(err, collection){
      if(err){
        db.close();
        return callback(err);
      }
//            if id is not number, find all tasks
            if(typeof id === 'string'){
                collection.findOne({_id: Task.ObjectId(id)}, function(err, result){
                    db.close();
                    if(result){
                        var task = new Task(result);
                        callback(err, task);
                    }else{
                        callback(err, null);
                    }
                });
            }else{
                //attention!!! replace the callback
                callback = id;
                collection.find().toArray(function(err, result){
                    db.close();
                    //build the list of task object
                    var list = [];
                    for(var i=0; i< result.length; i++){
                        list.push( new Task(result[i]));
                    }
                    callback(err, list);
                });
            }
    });

  });
};
//get Tasks by time
Task.getByTime = function(time, callback){
  MongoClient.connect(config.url, function(err, db){
    if (err) {
      return callback(err);
    }
    var collection = db.collection('tasks');
      var startTime = util.getTimestampOfDate(time),
        endTime = startTime + 24*3600*1000;
      collection.find({time:{$gt:startTime,$lt:endTime}}).toArray(function(err, result){
          db.close();
          //build the list of task object
          var list = [];
          for(var i=0; i< result.length; i++){
              list.push( new Task(result[i]));
          }
          callback(err, list);
      });
    });
};
//获取某一天任务的数目
Task.getTaskDetail = function(time, callback){
  var result={};
  MongoClient.connect(config.url, function(err, db){
    if (err) {
      return callback(err);
    }

    db.collection('tasks', function(err, collection){
      if(err){
        db.close();
        return callback(err);
      }
      var startTime = util.getTimestampOfDate(time),
        endTime = startTime + 24*3600*1000;
      //格式化字符串,遵循iso-8601
      //result.time = util.format(new Date(parseInt(time)),'yyyy年MM月dd日');
      result.time = time;
      collection.find({time:{$gt:startTime,$lt:endTime}}).count(function(err, num){
        result.count = num;
        //获取任务完成的数目
        collection.find({state:'done',time:{$gt:startTime,$lt:endTime}}).count(function(err, num){
          result.doneCount = num;
          db.close();
          callback(err, result);
        });
      });

    });
  });
 
};

module.exports = Task;