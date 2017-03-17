class ToDoList {
	constructor(){
		this.taskList = [],
		this.completeList = []
	}

	addTask(task){
		this.taskList.push(task);
	}

	completeTask(task){
		var idx = this.taskList.indexOf(task);
		var completeOne = this.taskList.splice(idx, 1);
		this.completeList.push(completeOne[0]);
	}

	showAll(){
		console.log("ToDoList");
		this.taskList.forEach(function(v){
			console.log(v);
		});
		console.log("CompleteList");
		this.completeList.forEach(function(v){
			console.log(v);
		});	
	}
}

var myTask = new ToDoList();

myTask.addTask("놀기");
myTask.addTask("공부하기");
myTask.completeTask("공부하기");
myTask.showAll();
