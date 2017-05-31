document.addEventListener("DOMContentLoaded",function(){
	init();
});

function init(){
	const ele = {
		wrap:document.querySelector(".wrap"),
		content:document.querySelector("section.content"),
		nav:document.querySelector("nav"),
		btn:document.querySelector(".btn")
	}; 
	const info = {
		template:document.querySelector("#newsTemplate").insertHTML,
		dataURL:"./data/newslist.json",
		timer:10000,
		tempData:"",
		tempRes:"",
		tags:["LI","BUTTON","DIV","A"],
		checkMs:0,
		FLAG:false,
		cur:0,
		total:0,
		viewList:["sbs","mbc","kbs1","kbs2"]
	}

	ele.wrap.addEventListener("click", function(evt){
		info.FLAG = true;
		const target = evt.target;
		if(!checkTagName(info.tags)) return;
		else if(/navList/.test(target.className)){
			checkSendTime(info);
		}else if(target.tagName === "A"){
			const btn = target.parentNode;
			if(/left/.test(btn.className)){
				movePrevNext(btn, "prev");
				checkSendTime(info);
			}else(/right/.test(btn.className)){
				movePrevNext(btn, "next");
				checkSendTime(info);
			}
		}
	});
}
function movePrevNext(target, direction){
	if(direction === "prev"){
		if(info.cur === 1) info.cur = info.total;
		else info.cur += 1;
	}else(direction === "next"){
		if(info.cur === info.total) info.cur = 1;
		else info.cur -= 1;
	} 
}
function sendAjax(url, func){
	const oReq = new XMLHttpRequest();
	oReq.addEventListener("load", func);
	oReq.open("GET", url);
	oReq.send();
}
function checkSendTime(info){
	const nowMs = getTime();
	const diff = nowMs - info.checkMs;
	if(diff > info.timer || diff <= 0 && info.FLAG === false){
		info.checkMs = nowMs;
		sendAjax(dataUrl, function(){
			const data = JSON.parse(this.responseText);
			info.resData = data;
			changeSection(tempData[info.cur-1].title, ele.content, info.template);
			info.FLAG = false;
		});
	}else{
		changeSection(tempData[info.cur-1].title, ele.content, info.template);
	}
}
function changeSection(text, node, info){
	const len = info.tempRes.length;
	const vList = info.viewList.join(" ");
	info.tempRes.forEach(function(v){
		if(vList.includes(v.title)) info.tempData.push(v);
	});
	info.total = info.tempData.length;
	info.tempData.forEach(function(v,i){
		if(text === v.title){
			insertHTML(node, v, info.template);
			info.cur = i;
			insertCurPage(info.cur, info.total);
		}
	});
}
function insertCurPage(cur, total){
	cur = cur.toString();
	total = total.toString();
	const cPage = document.querySelector(".c_paging");
	const template2 = document.querySelector("#curTemplate").innerHTML;
	let str = template2.replace(/{cur}/, cur);
	str = str.replace(/{total}/, total);
	cPage.innerHTML = str;
}
function insertHTML(node,data,template){
	let str = template.replace(/{title}/, data["title"]);
	str = str.replace(/{imgurl}/, data["imgurl"]);
	let newsList = "";
	for(var i = 0; i < data["newslist"].length; i++){
		newsList += "<li>"+data["newslist"][i]+"</li>";
	}
	str = str.replace(/{newsList}/, newsList);
	node.innerHTML = str;
}

function getTime(){
	var result = 0;
	var nowDate = new Date();
	result = ((nowDate.getHours()*60+nowDate.getMinutes())*60+nowDate.getSeconds())*1000;
	return result;
}

function checkTagName(tagName, allowTags){
	for(var i = 0; i < allowTags.length; i++){
		if(tagName === allowTags[i]) return true;
	}
	return false;
}