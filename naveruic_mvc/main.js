document.addEventListener("DOMContentLoaded", function(){
	init();
});

function init(){
	var bond = function(msg, args){
		switch(msg){
			case "navCS": newsNav.changeSelected(arguments[1]);
			break;
			case "secCC": newsSection.changeContent(arguments[1], arguments[2]);
			break;
			case "setData": newsData.setData(arguments[1], arguments[2]);
			break;
			case "getData": newsData.getData(arguments[1]);
			break;
			case "interval": ut.checkInterval(arguments[1]);
			break;
			case "sendAjax": ut.sendAjax(arguments[1], arguments[2]);
			break;
			case "navCT": newsNav.clickTitle(arguments[1], arguments[2], arguments[3]);
			break;
			case "headVCT": headerObj.viewCurTotal(arguments[1]);
			break;
			case "navVT": newsNav.viewTitles(arguments[1]);
			break;
			case "conLoad":
				newsData.getData(newsData.tempData);
				newsHeader.contendLoad(newsData);
				newsNav.contendLoad(newsData);
				newsSection.contendLoad(newsData.cur, newsData.tempData);
			break;
		}
	};

	var ut = Object.create(utilObj);

	var newsHandler = Object.create(eventHandler);

	var newsData = Object.create(dataObj);
	newsData.timer = 10000;
	newsData.dataURL = "./data/newslist.json";
	newsData.curTemplate = ut.$("#curTemplate").innerHTML;
	newsData.curPage = ut.$(".c_paging");
	newsData.navList = ut.$("nav > ul");

	var newsHeader = Object.create(headerObj);
	newsHeader.btns = ut.$(".btn");


	var newsNav = Object.create(navObj);
	newsNav.navList = ut.$("nav > ul");
	newsNav.template = ut.$("#navTemplate").innerHTML;

	var newsSection = Object.create(sectionObj);
	newsSection.content = ut.$("section.content");
	newsSection.template = ut.$("#newsTemplate").innerHTML;

	ut.sendAjax(newsData, function(){
		var data = JSON.parse(this.responseText);
		newsData.ajaxDoneMs = ut.getMsFromTime();
		newsData.cur = 1;
		newsData.getData(data);
		newsHeader.contendLoad(newsData);
		newsNav.contendLoad(newsData);
		newsSection.contendLoad(newsData.cur, newsData.tempData);
		newsHandler.header(newsHeader, newsData, bond);
		newsHandler.nav(newsNav, newsData, bond);
		newsHandler.section(newsSection, newsData, bond);
	});
}

var eventHandler = {
	header:function(headerObj, dataObj, bond){
		headerObj.btns.addEventListener("click",function(evt){
			var target = evt.target;
			if(target.parentNode.classList.contains("left")){
				direction = "prev";
			}else if(target.parentNode.classList.contains("right")){
				direction = "next";
			}
			headerObj.clickPrevOrNext(direction, dataObj, bond);
		});
	},
	nav:function(navObj, dataObj, bond){
		dataObj.navList.addEventListener("click", function(evt){
			/*
			if(bond("interval", dataObj)){
				bond("sendAjax", dataObj.dataURL, function(){
					var data = JSON.parse(this.responseText);
					dataObj.getData(data);
				});
			}
			*/
			if(evt.target.tagName !== "LI") return;
			else{
				bond("navCT", evt.target, dataObj, bond);
			}
		});
	},
	section:function(sectionObj, dataObj, bond){
		sectionObj.content.addEventListener("click", function(evt){
			var target = evt.target;
			if(evt.target.tagName !== "A" && evt.target.tagName !== "BUTTON") return;
			else {
				sectionObj.clickUnSub(dataObj, bond);
			}
		});
	}
};

var headerObj = {
	//돔컨텐트가 로드되면 작동 
	contendLoad:function(dataObj){
		this.viewCurTotal(dataObj);
	},
	// < > 버튼 클릭시 작동하는 함수 
	clickPrevOrNext:function(direction, dataObj, bond){
		/*
		if(bond("interval", dataObj)){
			bond("sendAjax", dataObj, function(){
			var data = JSON.parse(this.responseText);
			dataObj.getData(data);
			console.log(dataObj.ajaxDoneMs);
			});
		}*/
		if(direction === "prev"){
			if(dataObj.cur ===  1) {
				dataObj.cur = dataObj.total; 
			}else{
				dataObj.cur -= 1;
			}
		}else if(direction === "next"){
			if(dataObj.cur === dataObj.total){
				dataObj.cur = 1;
			}else{
				dataObj.cur += 1; 
			}
		}
		this.viewCurTotal(dataObj);
		bond("secCC", dataObj.cur, dataObj.tempData);
		bond("navCS", dataObj);
		bond("navVT", dataObj);

	},
	// 현재페이지/전체페이지 수를 표시
	viewCurTotal:function(dataObj){
		if(dataObj.total === 0) dataObj.cur = 0;
		var cur = dataObj.cur.toString();
		var total = dataObj.total.toString();
		var tempHTML = dataObj.curTemplate.replace(/{cur}/, cur);
		tempHTML = tempHTML.replace(/{total}/, total);
		dataObj.curPage.innerHTML = tempHTML;	
	}
};

var navObj = {
	//돔컨텐트가 로드되면 작동
	contendLoad:function(dataObj){
		var tempHTML = "";
		dataObj.tempData.forEach(function(v){
			tempHTML += this.template.replace(/{title}/, v.title);
		}.bind(this));
		this.navList.innerHTML = tempHTML;
		if(dataObj.cur === 0) return;
		else this.navList.children[dataObj.cur-1].classList.add("selected");
	},
	viewTitles:function(dataObj){
		var tempHTML = "";
		dataObj.tempData.forEach(function(v){
			tempHTML += this.template.replace(/{title}/, v.title);
		}.bind(this));
		this.navList.innerHTML = tempHTML;
		this.navList.children[dataObj.cur-1].classList.add("selected");
	},
	//nav하위의 li를 클릭하면 작동하는 함수
	clickTitle:function(target, dataObj, bond){
		var titleList = this.navList.children;
		for(var i = 0; i < titleList.length; i++){
			if(target.innerText === titleList[i].innerText){
				idx = i;
				break;
			}
		}
		dataObj.cur = idx + 1;
		this.changeSelected(dataObj);
		bond("secCC", dataObj.cur, dataObj.tempData);
		bond("headVCT", dataObj);
	},
	//선택된 li 하이라이트
	changeSelected:function(dataObj){
		var titleList = this.navList.children;
		var idx = null;
		for(var i = 0; i < titleList.length; i++){
			if(titleList[i].classList.contains("selected")){
				idx = i;
				break;
			}
		}
		titleList[i].classList.remove("selected");
		titleList[dataObj.cur-1].classList.add("selected");
	}
};

var sectionObj = {
	//돔컨텐트가 로드되면 작동
	contendLoad:function(cur, data){
		if(data.length === 0) this.content.innerHTML = "";
		this.changeContent(cur, data);
	},
	//해지버튼을 눌렀을때 작동하는 함수
	clickUnSub:function(dataObj, bond){
		var liList = dataObj.navList;
		var subsList = dataObj.subscribe;
		subsList.splice(dataObj.cur-1, 1);
		if(dataObj.total < 0) return;
		else if(dataObj.cur === dataObj.total) dataObj.cur = 1;
		bond("conLoad", dataObj);
	},
	//입력값: json을 파싱한 data, 템플릿 | 템플릿에 파싱한 데이터를 대치해서 section에 뿌려줌
	changeContent:function(cur, datalist){
		if(datalist.length === 0) {
			this.content.innerHTML = "";
			return;
		}else {
			var data = datalist[cur-1];
			var tempStr = "";
			var tempHTML = this.template.replace(/{title}/, data.title);
			tempHTML = tempHTML.replace(/{imgurl}/, data.imgurl);
			data.newslist.forEach(function(v){
				tempStr += "<li>"+v+"</li>";
			});
			tempHTML = tempHTML.replace(/{newsList}/, tempStr);
			this.content.innerHTML = tempHTML;
		}		
	}
};

var utilObj = {
	//입력값: url, 콜백함수
	sendIntervalAjax:function(dataObj, func){
		var nowMs = this.getMsFromTime();
		var diff = nowMs - dataObj.ajaxDoneMs;
		if(diff > dataObj.timer || diff <= 0){
			dataObj.ajaxDoneMs = nowMs;
			this.sendAjax(dataObj.dataURL, func);
		}else return;
	},
	sendAjax:function(dataObj, func){
		var oReq = new XMLHttpRequest();
		oReq.addEventListener("load", func);
		oReq.open("GET", dataObj.dataURL);
		oReq.send();
	},
	//Date()를 이용해 현재시간을 가져와 ms단위로 환산해서 반환
	getMsFromTime:function(){
		var nowDate = new Date();
		var result = ((nowDate.getHours()*60+nowDate.getMinutes())*60+nowDate.getSeconds())*1000;
		return result;
	},
	//Ajax통신완료후 일정시간이 경과 했는지 체크해서 T/F 반환
	checkInterval:function(dataObj){
		var nowMs = this.getMsFromTime();
		var diff = nowMs - dataObj.ajaxDoneMs;
		if(diff > dataObj.timer || diff <= 0){
			dataObj.ajaxDoneMs = nowMs;
			return true;
		}else{
			return false;
		}
	},
	//querySelector를 줄여쓰기 위함
	$:function(query){
		return document.querySelector(query);
	},
	$$:function(target, query){
		return target.querySelector(query);
	}
};

var dataObj = {
	dataURL:"",
	ajaxDoneMs:null,
	cur:null,
	total:null,
	timer:null,
	subscribe:["sbs","mbc","kbs1","kbs2"],
	tempData:[],
	getData: function(datalist){
		var subsList = this.subscribe.join(" ");
		var subsData = [];
		for(var i = 0; i < datalist.length; i++){
			if(subsList.includes(datalist[i].title)){
				subsData.push(datalist[i]);
			}
		}
		this.total = subsData.length;
		this.tempData = subsData;
	},
	setData: function(prop, val){
		this[prop] = val;
	}
};



