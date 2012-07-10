/**utils for debugging purpose*/


function _speak(txt){
	if(!hablas.chapterView)
		return;
	if(txt)
		hablas.chapterView.onRecognition(txt);
	else if(hablas.chapterView.getActivePhrase())
		hablas.chapterView.onRecognition( hablas.chapterView.getActivePhrase().getText());
	
}



