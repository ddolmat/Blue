
var ns = {};

ns.util = {
	sendAjax: function(url, msg, func){
		var oReq = new XMLHttpRequest();
		oReq.open(msg, url);
		oReq.setRequestHeader("Content-type", "application/json");
		oReq.send();
		oReq.addEventListener("load", function(){
			var jsonObj = JSON.parse(oReq.responseText);
			func(jsonObj);
		});
	},
	_sendAjax: function(url, func){
		var oReq = new XMLHttpRequest();
		oReq.open("GET", url);
		oReq.send();
		oReq.addEventListener("load", function(){
			var jsonObj = JSON.parse(oReq.responseText);
			func(jsonObj);
		});
	},
	$:function(selector){
		return document.querySelector(selector);
	},
	getIndexOf: function(child) {
		var parent = child.parentNode;
		var idx = [].indexOf.call(parent.children, child);
		return idx;
	}
};

ns.dispatcher = {
  register: function(fnlist) {
    this.fnlist = fnlist;
  },
  emit: function(o, data) {
    this.fnlist[o.type].apply(null, data);
  }
};

ns.model = {
	currIdx:0,
	total:null,
	subsOnData:[],
	allData:[],
	subscribe:[],
	getAllData: function() {
		return this.allData;
	},
	getSubsOnData: function() {
		return this.subsOnData;
	},
	getSubsList: function() {
		return this.subscribe;
	},
	getCurrIdx: function() {
		return this.currIdx;
	},
	changeCurr: function(idx) {
		this.currIdx = idx;
		ns.dispatcher.emit({
			"type": "changeView"
		},[idx, this.subsOnData]);
	},
	setSubsOnData: function(data) {
		if(this.subscribe.length === 0){
			ns.dispatcher.emit({
				"type":"eraseAll"	
			},[]);
		}else{
			var subsList = this.subscribe.join(" ");
			var tempData = [];
			for(var i = 0; i < data.length; i++){
				if(subsList.includes(data[i].title)) tempData.push(data[i]);
			}
			this.subsOnData = tempData;
			this.total = tempData.length;
			ns.dispatcher.emit({
				"type": "changeView"
			},[this.currIdx, tempData]);
		}
	},
	removeCurrData: function() {
		this.subscribe.splice(this.currIdx, 1);
		if(this.currIdx === this.total - 1) this.currIdx = 0;
		this.setSubsOnData(this.allData);
	},
	removeSubsList: function(title) {
		var idx = this.subscribe.indexOf(title);
		this.subscribe.splice(idx, 1);
		if(this.subscribe.length === 0){
			ns.dispatcher.emit({
				"type":"eraseAll"
			}, []);
		}else this.setSubsOnData(this.allData);
	},
	modSubsList: function(btn){
		if(btn.classList.contains("onSub")){
			btn.classList.remove("onSub");
			this.changeCurr(0);
			this.removeSubsList(btn.innerText);
		}else{
			btn.classList.add("onSub");
			this.addSubsList(btn.innerText);
		}
	},
	addSubsList: function(title) {
		this.subscribe.push(title);
		this.setSubsOnData(this.allData);
	},
	subscribeAll: function(){
		this.allData.forEach(function(v){
			this.subscribe.push(v.title);
		});
	}
};

ns.view = {};

ns.view.header = {
	init:function(){
		this.resistEvent();
	},
	ereseCPage:function(){
		this.cPage.innerHTML = "";
	},
	render:function(cur, total){
		var tempHTML = this.template.replace(/{cur}/, cur);
		tempHTML = tempHTML.replace(/{total}/, total);
		this.cPage.innerHTML = tempHTML;
	},
	resistEvent:function(){
		this.allNews.addEventListener("click", function(evt){
			ns.dispatcher.emit({
				"type":"clickAllNews"
			},[]);
		});
		this.myNews.addEventListener("click", function(evt){
			ns.dispatcher.emit({
				"type":"clickMyNews"
			},[]);
		});
		this.left.addEventListener("click", function(evt){
			ns.dispatcher.emit({
				"type": "clickNextOrPrev"
			}, ["prev"]);
		});
		this.right.addEventListener("click", function(evt){
			ns.dispatcher.emit({
				"type": "clickNextOrPrev"
			}, ["next"]);
		});
	}
};

ns.view.section = {
	init:function(){
		this.resistEvent();
	},
	eraseContent:function(){
		this.content.innerHTML = "<h1>구독하세요</h1>";
	},
	render:function(newsObj){
		var sList = newsObj.newslist.reduce(function(prev, next){
			return prev + "<li>" + next + "</li>";
		}, "");
		var result = this.template.replace(/{title}/, newsObj.title);
		result = result.replace(/{imgurl}/, newsObj.imgurl);
		result = result.replace(/{newsList}/, sList);

		this.content.innerHTML = result;
	},
	resistEvent:function(){
		this.content.addEventListener("click", function(evt){
			var target = evt.target;
			if(target.tagName !== "BUTTON" && target.tagName !== "A") return;
			ns.dispatcher.emit({
				"type": "removeCurrData"
			}, []);
		});
	}
};

ns.view.nav = {
	init:function(){
		this.resistEvent();
	},
	eraseUl:function(){
		this.ul.innerHTML = "";
	},
	render:function(idx, result){
		var tempHTML = result.reduce(function(prev, next){
			return prev + "<li>"+ next.title +"</li>";
		}, "");
		this.ul.innerHTML = tempHTML;
		this.setHighLight(idx);
	},
	setHighLight:function(idx){
		var selected = ns.util.$(".selected");
		if(selected) selected.classList.remove("selected");
		var curr = this.ul.children[idx];
		curr.classList.add("selected");
	},
	resistEvent:function(){
		this.ul.addEventListener("click", function(evt){
			var currIdx = ns.util.getIndexOf(evt.target);
			ns.dispatcher.emit({
				"type":"changeCurr"
			}, [currIdx]);
		}.bind(this));
	}
};

ns.view.subscribe = {
	init:function(){
		this.resistEvent();
	},
	render:function(allData, subsList){
		var subsList = subsList.join(" ");
		var tempHTML = allData.reduce(function(prev, next){
			return prev + "<button class='subBtn'>" + next.title + "</button>";
		}, "");
		var subsBtns = this.subscribe.children;
		this.subscribe.innerHTML = tempHTML;
		for(var i = 0; i < subsBtns.length; i ++){
			if(subsList.includes(subsBtns[i].innerText)){
				subsBtns[i].classList.add("onSub");
			}
		}
	},
	resistEvent:function(){
		this.subscribe.addEventListener("click", function(evt){
			var target = evt.target;
			if(target.tagName !== "BUTTON") return;
			ns.dispatcher.emit({
				"type":"clickSubsBtn"
			},[target]);
		});
	}
};

ns.controller = {
	join: function(){
		ns.dispatcher.register({
			"initView":function(result){
				this.model.allData = result;
				//this.model.subscribeAll();
				this.model.setSubsOnData(result);
			}.bind(this),
			"clickNextOrPrev":function(direction){
				if(this.model.subscribe.length === 0) return;
				var nextIdx = this._getNextIdx(direction);
				this.model.changeCurr(nextIdx);
			}.bind(this),
			"changeCurr":function(idx){
				this.model.changeCurr(idx);
			}.bind(this),
			"removeCurrData":function(){
				this.model.removeCurrData();
			}.bind(this),
			"changeSubsOnData":function(result){
				this.nav.render(this.model.currIdx, this.model.allData);
				this.section.render(result[0]);
				this.header.render(this.model.currIdx+1, this.model.total);
			}.bind(this),
			"changeView":function(nextIdx, subsOnData){
				this.section.render(subsOnData[nextIdx]);
				this.header.render(nextIdx+1, this.model.total);
				this.nav.render(nextIdx, subsOnData);
				this.subscribe.render(this.model.allData, this.model.subscribe);
			}.bind(this),
			"clickSubsBtn":function(btn){
				this.model.modSubsList(btn);
			}.bind(this),
			"clickSubsOn":function(title){
				this.model.addSubsList(title);
			}.bind(this),
			"clickSubsOff":function(title){
				this.model.removeSubsList(title);
			}.bind(this),
			"setSubsOnData":function(){
				this.model.setSubsOnData(data);
			}.bind(this),
			"getSubsList":function(){
				return this.model.getSubsList();
			}.bind(this),
			"getCurrIdx":function(){
				return this.model.getCurrIdx();
			}.bind(this),
			"clickAllNews":function(){
				this.header.myNews.classList.remove("selectedTab");
				this.header.allNews.classList.add("selectedTab");
				this.subscribe.subscribe.classList.remove("displayOff");
				this.model.mainArea.classList.add("displayOff");
			}.bind(this),
			"clickMyNews":function(){
				this.header.allNews.classList.remove("selectedTab");
				this.header.myNews.classList.add("selectedTab");
				this.model.mainArea.classList.remove("displayOff");
				this.subscribe.subscribe.classList.add("displayOff");
			}.bind(this),
			"eraseAll":function(){
				this.header.ereseCPage();
				this.nav.eraseUl();
				this.section.eraseContent();
				this.subscribe.render(this.model.allData, this.model.subscribe);
			}.bind(this)
		});	
	},
	_getNextIdx:function(direction){
		var currIdx = this.model.currIdx;
		var total = this.model.total;
		var nextIdx = currIdx;

		if(direction === "prev"){
			if(currIdx === 0) nextIdx = total - 1;
			else nextIdx--;
		}else if(direction === "next"){
			if(currIdx === total - 1) nextIdx = 0;
			else nextIdx++;
		}
		return nextIdx;
	}
};

document.addEventListener("DOMContentLoaded", function(){
	ns.util.sendAjax("/ajax/","POST", function(result){
		ns.dispatcher.emit({
			"type": "initView"
		}, [result]);
	});
	var model = Object.create(ns.model);
	model.mainArea = ns.util.$(".mainArea");

	var headerView = Object.create(ns.view.header);
	headerView.cPage = ns.util.$(".c_paging");
	headerView.myNews = ns.util.$(".myNews");
	headerView.allNews = ns.util.$(".allNews");
	headerView.left = ns.util.$(".left");
	headerView.right = ns.util.$(".right");
	headerView.template = ns.util.$("#curTemplate").innerHTML;

	var navView = Object.create(ns.view.nav);
	navView.ul = ns.util.$(".mainArea > nav > ul");

	var sectionView = Object.create(ns.view.section);
	sectionView.content = ns.util.$(".content");
	sectionView.template = ns.util.$("#newsTemplate").innerHTML;

	var subscribeView = Object.create(ns.view.subscribe);
	subscribeView.subscribe = ns.util.$(".subscribe");

	var controller = Object.create(ns.controller);
	controller.model = model;
	controller.header = headerView;
	controller.section = sectionView;
	controller.nav = navView;
	controller.subscribe = subscribeView;
	
	headerView.init();
	navView.init();
	sectionView.init();
	subscribeView.init();

	controller.join();
});