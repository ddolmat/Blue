document.addEventListener("DOMContentLoaded", function(){
	init();
}

function init(){
	const INFO = {
		dataURL:"./data/newslist.json",
		timer:10000
	};

	var newsHeader = Object.create(headerObj);
	newsHeader.btns = util.$(".btns");
	newsHeader.template = util.$(".curTemplate").innerHTML;
	newsHeader.cPage = util.$(".c_paging");
	newsHeader.template = util.$("#curTemplate");

	var newsNav = Object.create(navObj);
	newsNav.navList = util.$("nav > ul");
	newsNav.template = util.$(".#navTemplate");

	var newsSection = Object.create(sectionObj);
	var newsData = Object.create(dataObj);
	newsData.subscribe = ["sbs","mbc","kbs1","kbs2"];

	util.sendAjax(INFO.dataURL, function(){
		var data = JSON.parse(this.responseText);
		newsData.tempData = data;
	});

	newsHeader.contendLoad(newsData.cur, newsData.total);
	newsNav.contendLoad();
	newsSection.contendLoad();
});	

var headerObj = {
	//돔컨텐트가 로드되면 작동 
	contendLoad:function(cur, total){
		this.viewCurTotal(cur, total);
	},
	// < > 버튼 클릭시 작동하는 함수 
	clickPrevOrNext:function(){

	},
	// 현재페이지/전체페이지 수를 표시
	viewCurTotal:function(cur, total){
		cur = cur.toString();
		total = total.toString();
		let tempHTML = this.template.replace(/{cur}/, cur);
		tempHTML = tempHTML.replace(/{total}/, total);	
	}
};

var navObj = {
	//돔컨텐트가 로드되면 작동
	contendLoad:function(data){
		let tempHTML = "";
		data.forEach(function(v){
			tempHTML += this.template.replace(/{title}/, v.title);
		});
		this.navList.innerHTML = tempHTML;
	},
	//nav하위의 li를 클릭하면 작동하는 함수
	clickTitle:function(){

	},
	//선택된 li 하이라이트
	changeSelected:function(){

	}
};

var sectionObj = {
	//돔컨텐트가 로드되면 작동
	contendLoad:function(){

	},
	//해지버튼을 눌렀을때 작동하는 함수
	clickUnSub:function(){

	},
	//입력값: json을 파싱한 data, 템플릿 | 템플릿에 파싱한 데이터를 대치해서 section에 뿌려줌
	changeContent:function(){

	}
};

var util = {
	//입력값: url, 콜백함수
	sendAjax:function(url, func){
		let oReq = new XMLHttpRequest();
		oReq.addEventListener("load", func);
		oReq.open("GET", url);
		oReq.send();
	},
	//Date()를 이용해 현재시간을 가져와 ms단위로 환산해서 반환
	getMsFromTime:function(){
		var nowDate = new Date();
		var result = ((nowDate.getHours()*60+nowDate.getMinutes())*60+nowDate.getSeconds())*1000;
		return result;
	},
	//Ajax통신완료후 일정시간이 경과 했는지 체크해서 T/F 반환
	checkInterval:function(){

	},
	//querySelector를 줄여쓰기 위함
	$:function(query){
		return document.querySelector(query);
	},
	//입력값:태그네임, 허용된태그네임배열 | 출력값:허용된 태그네임배열에 태그네임이 있을경우:true/없을경우:false 
	checkTagName(){

	},
	//입력값:노드1,노드2,클래스 | 노드1의 클래스를 삭제하고 노드2에 추가
	swapClass(node1, node2, targetClass){
		node1.classList.remove(targetClass);
		node2.classList.add(targetClass);
	}
};

var dataObj = {
	FLAG:false,
	cur:0,
	total:0,
	ajaxDoneMs:0,
	tempData:[],
	subscribe:[]
}

