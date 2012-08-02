$(document).ready(function() {
	$('a.login-window').click(function(evt) {
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
	});
	
	// When clicking on the button close or the mask layer the popup closed
	$('a.close, #mask').live('click', function() { 
		$('#mask , .login-popup').fadeOut(300 , function() {
		$('#mask').remove();  
	}); 
	return false;
	});
	
	//$("#login-form").ajaxForm({url: '/accounts/signin', type: 'post'})
	
	$("#signin-btn").click(function(){
		 $.ajax({
	           type: "POST",
	           url: '/accounts/signin/',
	           data: $("#login-form").serialize(), // serializes the form's elements.
	           success: function(data)
	           {
	               if(data.indexOf("error")>=0)      	   
	            	   //$("#login-error").text( $(data).find("li").text() )
	            	   $("#login-error").text("Invalid login")
	               else {
	            	   console.log("User is ", data)
	            	    $('#mask , .login-popup').fadeOut(300 , function() { 
	            	    	$('#mask').remove();
	            	    });
	            	    matcher = data.match(/'\/accounts\/(.*?)\//)
	            	    if(matcher){
	            	    	$("#userid").text("Hi, "+ matcher[1])
	            	    	$("#signin-link").css("display", "none")	  	            	    	
	            	    }
	               }	            	   
	           }
	         });		
	});
	
	$("#signout-link").click(function(){
		$.ajax({
			url:'/accounts/signout',
			success:function(){
				document.location="/"
			}		
		})
	}); 
	
	
});


/**$(document).ready(function() {
	
	
	
    //Change these values to style your modal popup
    //var source = "demo.html";
    var width = 500;
    var align = "center";
    var top = 100;
    var padding = 10;
    var backgroundColor = "#FFFFFF";
    var borderColor = "#000000";
    var borderWeight = 4;
    var borderRadius = 5;
    var fadeOutTime = 300;
    var disableColor = "#666666";
    var disableOpacity = 40;
    var loadingImage = "/ext/resources/images/loading.gif";
 
    //This method initialises the modal popup
    $(".modal").click(function(evt) {
    	event.preventDefault();
    	var source = $(evt.target).attr("href")
        modalPopup( align,
		    top,
		    width,
		    padding,
		    disableColor,
		    disableOpacity,
		    backgroundColor,
		    borderColor,
		    borderWeight,
		    borderRadius,
		    fadeOutTime,
		    source,
		    loadingImage );
    	
    });	
 
    //This method hides the popup when the escape key is pressed
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            closePopup(fadeOutTime);
        }
    });
 
  });
 */