var MyPromise = function(fn){
	this.then = function(func) {
		this.func = func;
	};

	this.resolve = function(arg) {
		setTimeout(this.func(arg), 0);
	}.bind(this);

	fn(this.resolve);
};

var myFirstPromise = new MyPromise((resolve, reject) => {
  setTimeout(function(){
    resolve("Success!"); 
  }, 250);
});

myFirstPromise.then((successMessage) => {
  console.log("Yay! " + successMessage);
});