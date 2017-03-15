var taskObj = {
	addTask:function(task){
		this.taskList.push(task);
	},
	completeTask:function(task){
		var idx = this.taskList.indexOf(task);
		var completeOne = this.taskList.splice(idx, 1);
		this.completeList.push(completeOne[0]);
	},
	showAll:function(){
		console.log("ToDoList");
		this.taskList.forEach(function(v){
			console.log(v);
		});
		console.log("CompleteList");
		this.completeList.forEach(function(v){
			console.log(v);
		});
	}
};

function makeObject(attr, proto){
	var obj = Object.create(proto);
	Object.keys(attr).forEach(function(key){
		obj[key] = attr[key];
	});
	return obj;
}

var myTask = makeObject({
	taskList:[],
	completeList:[]
}, taskObj);


myTask.addTask("놀기");
myTask.addTask("공부하기");
myTask.completeTask("공부하기");
myTask.showAll();