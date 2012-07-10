(typeof u =='undefined') &&(u ={});

/**util.translate
 * 	Given a message key, returns the localized string. 
 *  Fallback to english version then the key itself
 * 
 */
u.t=function(key){
	var lan = localStorage.getItem('language') || 'en';
	var ret = u.MSGS[ lan ]? u.MSGS[lan][key] : null;	 
	return (ret || u.MSGS['en'][key] || key) 
	
	
}
/**util.translateAll
 * 
 * <label>
 * <span class="x-text">
 * [data-lang]
 * 
 */
u.ta = function(loc){
	 if(loc)
		 localStorage.setItem('language', loc);   
	$("[data-lang]").each(function(indx, el){
		 var key = $(el).attr('data-lang');
		 var trans = key && u.t(key);
		 var obj = $(el);
		 if(trans){			 
			 while(obj.children().length >0){
				 // jQuery enhanced widgets adds nested div/span
				 obj = obj.children().first();
				 //log.log(obj);
			 } 				 
			 obj.text(trans);
		 }
		 //log.log("i18n: " + key+"= "+ trans)
	});
	
//	$("label").each(function(indx, el){
//		var key = $(el).text();
//		var trans = key && u.t(key);
//		if(trans!=key)
//			$(el).text(trans);
//	});
//	
//	$("span").each(function(indx,el){
//		var key = $(el).text();
//		var trans = key && u.t(key);
//		if(trans!=key)
//			$(el).text(trans);
//	});
}
u.changeLocale=function(lan){
	 if(localStorage.getItem('language') == lan)
		 return;
	 	 
	 u.ta(lan);
	 localStorage.setItem('language', lan);
	 Ext.Msg.show({
         title:u.t('confirm'),
         msg: u.t("confirm.change.lang"), 
         buttons: Ext.Msg.YESNO,
         icon: Ext.Msg.QUESTION,
         fn: function(button, text, opt){
        	 if(button == 'yes'){
        		 document.location.reload();
        	 }
         }
    });
}
u.detectLanguage = function(){
    var detectedLng;
    if (window.navigator) {
        detectedLng =  (navigator.language) ? navigator.language : navigator.userLanguage;
    }    
    // check to see if language is valid
    detectedLng && (detectedLng = detectedLng.substring(0,2));
    detectedLng && (detectedLng = detectedLng.toLowerCase());
    if(!u.MSGS[detectedLng]){
    	//log.log("Language "+ detectedLng+" not supported, fallback to en");
    	detectedLng = 'en';
    }    
    // fallback
    if(!detectedLng)
    	detectedLng = 'en';
    //log.log("deteted language: "+ detectedLng);
   return detectedLng;
}


u.MSGS = {
	en: {
		"app.name": "Speaking Challenge",
		"title.practice": "PRACTICE",
		"title.stats": "RECORDS",
		"title.books": "CHALLENGES",		
		"title.options": "OPTIONS",		
		"title.sel_book": "Select Course",
		"label.english":"English",
		"label.chinese":"Chinese",
		"label.spanish":"Spanish",		
		"label.language":"Language",
		
		"link.home": "Home",
		"link.back": "Back",
		
		"label.email_addr":"Email Address",
		"label.tellemail":"Enter your email",
		"label.nickname": "Name",
		"label.maxwords": "Max words in a line",
		
		"title.session_date":"Practice Date",
		"title.minutes":"Minutes",
		"title.words_spoken":"Words Spoken",
		"title.words_rec":"Words Recognized",
		"title.words_listened":"Words Listened",
		"title.practice_sessions":"Practice Sessions",
		
		"title.accuracy":"Speaking Accuracy",
		"title.average":"Your Score",
		"title.topscore":"Top Score",
		"your.score":"Your Score",
		"title.recognized":"Recognized",
		
		
		"Add Story":"Add",
		"Delete Story":"Delete",
		"Add Course": "Add Challenge",
		"Edit Course": "Edit Challenge",
		"Drag and drop a picture here": "Drag and drop a picture here",
		"Course Title": "Title",
		"Course Tags":  "Tags",
		"Thumbnail": "Thumbnail",
		"Story Title":"Level Title",
		"Stories":"Challenge Levels",
		"title.level.content":"Content(click on the level then edit its content here)",
		"Title":"Title",
		"Created By":"Created By",
		"Added On":"Added On",
		"Add New Course":"Add Your Own Challenge",
		"Add New Challenge":"Add Your Own Challenge",
		"me":"me",
		"others":"others",
		"Today":"Today",
		"Yesterday":"Yesterday",
		"not.me":"not me",
		"confirm.change.lang":"The new language will take full effect after you refreshed you page. Refresh now?",
		
		"tip0":"Click the microphone icon then read the highlighted line",
		"tip1":"Click the speaker icon to listen to the sample pronounciation",
		"tip2":"You can change number of the words in a line on the Options page",
  	    "tip3":"You can skip the names in the beginning of the sentence",
  	    
  	    "confirm":"Confirm",
  	    
  	    "unlocked!":"Unlocked!",
  	    "start.unlock": "Unlock me!",
  	    "welcome":"Welcome",
  	    "error.missing.level":"At least one level is required for the challenge",
  	    "level":"Level",
  	    "dblclick.change.challenge":"Double click on the title to switch to a different challenge",
  	    "Challenge Saved":"Challenge Saved",
  	    "Cancel":"Cancel",
  	    "max.7":"Cannot add more than 7 levels",
  	    "cur.challenge":"Current Challenge",
  	    "switch.challenge":"switch challenge",
  	    "chrome.unsupported":"Unfortunately, only Google Chrome browser is supported in the beta version.",
  	    "download.chrome":"Download and Install Google Chrome Here",
  	    "label.slogan1":"Speak along the line and get instant feedback on your pronunciation",
  	    "label.slogan2":"Conquer the challenge and share with friends",
  	    "label.slogan3":"Create your own challenge - use your text book or study material",
  	    "switch.challenge":"Switch Challenge"
	},
	cn: {
		"switch.challenge":"切换挑战",
		"label.slogan1":"想知道自己的英语说得到底有多好？",
  	    "label.slogan2":"口语挑战可以即时给你反馈！",
  	    "label.slogan3":"添加自己的口语教材，和朋友同学一起玩！",
		"download.chrome":"点击下载 Google Chrome",
		"chrome.unsupported":"十分抱歉，目前这个版本的应用只能在Google Chrome浏览器内使用",
		"cur.challenge":"当前挑战",
		"switch.challenge":"另选",
		"max.7":"最多允许添加7项",
		"Cancel":"取消",
		"Challenge Saved":"保存成功",
		"dblclick.change.challenge":"双击任意一行即可切换成选定的挑战",
		"level":"级别",
		"error.missing.level":"你必须至少添加一个挑战",
		"welcome":"你好",
		"app.name": "口语挑战",
		"title.practice": "口语练习",
		"title.stats": "成绩记录",
		"title.books": "挑战选择",		
		"title.options": "设置选项",		
		"title.sel_book": "选择课程",
		"label.english":"英语",
		"label.chinese":"中文",
		"label.spanish":"西班牙语",		
		"label.language":"选择语言",
		
		"label.tellemail":"请输入你的EMAIL地址",
		"link.home": "首页",
		"link.back": "后退",
		
		"label.email_addr":"电子邮件",
		"title.enter_email":"请输入你的有效电子邮件地址",
		"label.nickname": "姓名",
		"label.maxwords": "每句单词数",
		"title.session_date":"练习日期",
		"title.minutes":"练习时间（分钟）",
		"title.words_spoken":"所说单词数",
		"title.words_rec":"准确单词数",
		"title.words_listened":"听力单词数",
		"title.practice_sessions":"练习历史",
		
		"title.accuracy":"准确率",
		"title.average":"得分",
		"title.topscore":"最高得分",
		"your.score":"我的得分",
		"title.recognized":"识别结果",		 
		"Add Story":"新建",
		"Delete Story":"删除",
		"Add Course": "新建挑战",
		"Edit Course": "修改挑战",
		"Drag and drop a picture here": "拖放图片于此",
		"Course Title": "挑战名称",
		"Course Tags":  "备注",
		"Thumbnail": "图片",
		"Story Title":"标题",
		"Stories": "级别",
		"title.level.content":"内容(点击左边章节然后编辑内容)",
		"Title":"标题",
		"Created By":"编辑者",
		"Added On":"添加日期",
		"Add New Course":"添加我的挑战",
		"Add New Challenge":"添加我的挑战",
		"me":"我",
		"others":"其他人",
		"Today":"今天",
		"Yesterday":"昨天",
		"not.me":"不是我",
		"confirm.change.lang":"如要完全改变语言，需要重新刷新页面，继续？",
		"tip0":"点击麦克风图标然后大声读出当前语句",
		"tip1":"点击小喇叭或者笑脸图标可以听标准发音",
		"tip2":"你可以在选项设置中修改一行最多单词数",
  	    "tip3":"句首的名字可以不用读",
  	    "confirm":"确认",
  	    "unlocked!":"过关成功！",
  	    "start.unlock":"开始闯关"
	}
//	,es: {
//		"app.name": "Hablamos Inglés",
//		"title.practice": "PRACTICA",
//		"title.stats": "HISTORIA",
//		"title.books": "CURSOS",		
//		"title.options": "OPCIONES",		
//		"title.sel_book": "Elige un Curso",
//		"label.english":"inglés",
//		"label.chinese":"chino",
//		"label.spanish":"español",
//		"label.language":"Elige idioma",
//		"label.nickname": "Nombre",
//		"label.maxwords": "Palabras  Máximas",
//		
//		"link.home": "Primera",
//		"link.back": "Regresar",
//		"label.email_addr":"Correo Electronico",
//		"title.enter_email":"Su correo electronic, por favor",
//		
//		
//		"title.accuracy":"Accuracy",
//		"title.average":"Average Score",
//		"title.topscore":"Top Score",
//		"title.recognized":"Recognized"
//	}
}
u.MSGS['zh'] =u.MSGS['cn'];  
