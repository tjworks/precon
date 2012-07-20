function getElementsByClass(objArea, thisTag, thisClass) {
	var obj = document.getElementById(objArea).getElementsByTagName(thisTag);
	var arrElements = new Array();
	for (i = 0; i < obj.length; i++) {
				if(obj[i].className == thisClass) {
							arrElements[arrElements.length] = obj[i]
				}
	}
	return arrElements;
}

function showWidget(tab,objNum) {
	var objTab = document.getElementById("wTabs" + objNum);
	objTab = objTab.getElementsByTagName("li");
	var objContent = getElementsByClass("tabWidget" + objNum, "div", "wContentBox");
	for (i = 0; i < objTab.length; i++) {
		if (i == tab) {
			objTab[i].className = "on";
			objContent[i].style.display = "block";
		} else {
			objTab[i].className = "";
			objContent[i].style.display = "none";
		}
	}
}