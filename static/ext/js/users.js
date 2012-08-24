$(document).ready(function() {
	$('a.login-window').click(showLoginBox);	
	// When clicking on the button close or the mask layer the popup closed
	$('a.close, #mask').live('click', function() { 
		$('#mask , .login-popup').fadeOut(300 , function() {
			$('#mask').remove();  
		}); 
		return false;
	});
	
	//$("#login-form").ajaxForm({url: '/accounts/signin', type: 'post'})
	
	$("#signin-btn").click(function(){
		$("#login-error").text("")
		if(!$("#username").attr("value") || ! $("#password").attr("value")){
			$("#login-error").text("Enter your email and password")
			return;
		}
			
		if( $("#id_signup")[0].checked )
			doSignup()
		else
			doSignin()		 	
	});
	
	$("#signout-link").click(function(){
		$.ajax({
			url:'/accounts/signout',
			success:function(){
				document.location="/"
			}		
		})
	}); 
	
	$(document).on(precon.event.UserLogin, updateUserLogin)
	
});
function showLoginBox(evt) {
    //Getting the variable's value from a link 
	var loginBox = $(this).attr('href');
	
	//Fade in the Popup
	$(loginBox).fadeIn(300);
	
	//Set the center alignment padding + border see css style
	var popMargTop = ($(loginBox).height() + 24) / 2; 
	var popMargLeft = ($(loginBox).width() + 24) / 2; 
	
	$(loginBox).css({ 
		//'margin-top' : -popMargTop,
		//'margin-left' : -popMargLeft
		top:   $('a.login-window').offset().top + 50,
		left: $('a.login-window').offset().left - 200
	});
	
	// Add the mask to body
	$('body').append('<div id="mask"></div>');
	$('#mask').fadeIn(300);
	
	return false;
}
function doSignup(){
	var uname =  $("#username").attr("value")
	if(uname.indexOf("@") < 0 ){
		$("#login-error").text("Require email address, thanks!")
		return;
	}
	
	$("#password1").attr("value" , $("#password").attr("value"))
	$("#password2").attr("value" , $("#password").attr("value"))
	
	$("#email").attr("value" ,uname)
	$("#newuser").attr("value", uname.replace(/@.*$/, ''))
	$.ajax({
        type: "POST",
        url: '/accounts/signup/',
        data: $("#login-form").serialize(), // serializes the form's elements.
        success: function(data)
        {
        	log.debug("Signup complete: ", data)
            if(data.indexOf("error")>=0)      	   
            	 $("#login-error").text( $(data).find("li").text() )      
            else {
         	    //log.debug("User is ", data)
         	    $('#mask , .login-popup').fadeOut(300 , function() { 
         	    	$('#mask').remove();
         	    });         	   
         	    doSignin()
         	    $(document).trigger(precon.event.UserLogin, uname)	           	    
            }	            	   
        }
      });	
}
function doSignin(){
	$.ajax({
        type: "POST",
        url: '/accounts/signin/',
        data: $("#login-form").serialize(), // serializes the form's elements.
        success: function(data)
        {
            if(data.indexOf("error")>=0)      	   
            	$("#login-error").text("Invalid login")
            else {
         	   //log.debug("User is ", data)
         	    $('#mask , .login-popup').fadeOut(300 , function() { 
         	    	$('#mask').remove();
         	    });
         	    matcher = data.match(/'\/accounts\/(.*?)\//)
         	    if(matcher){
         	    	 $(document).trigger(precon.event.UserLogin, $("#username").attr("value"))	    	            	    	
         	    }
            }	            	   
        }
      });	
}

function updateUserLogin(evt, username){
	log.debug("User logged in: "+ username)
	$("#userid").text("Hi, "+ username)
 	$("#signin-link").css("display", "none")	
 	
 	window.user = window.user || {}
	window.user.email = username
	window.user.user_id = username
}
