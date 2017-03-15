document.addEventListener("DOMContentLoaded", function(){
	init();
});

function init(){
	var except = [];
	var pages = {cur:0, total:0};
	var FLAG = false;
	var tags = ["LI", "BUTTON", "DIV", "A"];
	var tempData = "";
	var checkMs = 0;
	var wrap = document.querySelector(".wrap");
	var template = document.querySelector("#newsTemplate").innerHTML;
	var contentSec = document.querySelector("section.content");
	var nav = document.querySelector("nav");
	var dataUrl = "./data/newslist.json";

	var btn = document.querySelector(".btn");

	sendAjax(dataUrl, function(){
		var data = JSON.parse(this.responseText);
		var tempStr = "";
		for(var i = 0; i < data.length; i++){
			tempStr += "<li class='navList'>"+data[i]["title"]+"</li>";
		}
		nav.innerHTML = tempStr;
		insertHTML(contentSec, data[0], template);
		pages.total = data.length;
		pages.cur = 1;
		insertCurPage(1, data.length);
	});

	wrap.addEventListener("click", function(evt){
		console.log(evt.target.tagName);
		FLAG = true;
		if(!checkTagName(evt.target.tagName, tags)){
			return;
		}else if(/navList/.test(evt.target.className)){
			var nowMs = getTime();
			var diff = nowMs - checkMs;
			if(diff > 12000 || diff <= 0 && FLAG === false){
			checkMs = nowMs;	
				sendAjax(dataUrl, function(){
					var data = JSON.parse(this.responseText);
					tempData = data;
					changeSection(evt.target.innerText, tempData, contentSec, template, pages);
					FLAG = false;
				});
			}else{
					changeSection(evt.target.innerText, tempData, contentSec, template, pages);
			}
		}else if(evt.target.tagName === "A"){
			if(/left/.test(evt.target.parentNode.className)){
				var total = pages.total;
				if(pages.cur === 1) pages.cur = pages.total;
				else pages.cur -= 1;
				var nowMs = getTime();
				var diff = nowMs - checkMs;
				if(diff > 12000 || diff <= 0 && FLAG === false){
					checkMs = nowMs;	
					sendAjax(dataUrl, function(){
						var data = JSON.parse(this.responseText);
						tempData = data;
						changeSection(tempData[pages.cur-1]["title"], tempData, contentSec, template, pages);
						FLAG = false;
					});
				}else changeSection(tempData[pages.cur-1]["title"], tempData, contentSec, template, pages); 
			}else if(/right/.test(evt.target.parentNode.className)){
				if(pages.cur === pages.total) pages.cur = 1;
				else pages.cur += 1;
				var nowMs = getTime();
				var diff = nowMs - checkMs;
				if(diff > 12000 || diff <= 0 && FLAG === false){
					checkMs = nowMs;	
					sendAjax(dataUrl, function(){
						var data = JSON.parse(this.responseText);
						tempData = data;
						changeSection(tempData[pages.cur-1]["title"], tempData, contentSec, template, pages);
						FLAG = false;
					});
				}else changeSection(tempData[pages.cur-1]["title"], tempData, contentSec, template, pages);
			}/*else if(/delBtn/.test(evt.target.parentNode.className)){
				var nowMs = getTime();
				var diff = nowMs - checkMs;
				if(diff > 12000 || diff <= 0 && FLAG === false){
					checkMs = nowMs;	
					sendAjax(dataUrl, function(){
						nav.removeChild(nav.children[pages.cur - 1]);
						changeSection(tempData[pages.cur]["title"], tempData, contentSec, template);
						pages.total -= 1;
						insertCurPage(pages.cur, pages.total);
						FLAG = false;
					});
				} else {
					nav.removeChild(nav.children[pages.cur - 1]);
					pages.total -= 1;
					changeSection(tempData[pages.cur - 1]["title"], tempData, contentSec, template);

				}
			}*/
		}
	});


}

function sendAjax(url, func){
	var oReq = new XMLHttpRequest();
	oReq.addEventListener("load", func);
	oReq.open("GET", url);
	oReq.send();
}

function changeSection(text, data, node, template, pages){
	for(var i = 0; i < data.length; i++){
		if(text === data[i]["title"]){
			insertHTML(node, data[i], template);
			pages.cur = i+1;
			insertCurPage(pages.cur, pages.total);
			return;
		}
	}
}
function insertCurPage(cur, total){
	cur = cur.toString();
	total = total.toString();
	var cPage = document.querySelector(".c_paging");
	var template2 = document.querySelector("#curTemplate").innerHTML;
	var str = template2.replace(/{cur}/, cur);
	str = str.replace(/{total}/, total);
	cPage.innerHTML = str;
}
function insertHTML(node,data,template){
	var str = template.replace(/{title}/, data["title"]);
	str = str.replace(/{imgurl}/, data["imgurl"]);
	var newsList = "";
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
