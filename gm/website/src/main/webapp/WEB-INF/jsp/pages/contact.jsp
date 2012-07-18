<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<h1>Contact us</h1>

<c:if test='${pageContext.request.method == "GET"}'>
	 <p id="instructions">If you have any questions or comments, please contact us via the form below.</p>
	 <p/>
	
	 <div id="error_msg" style="display: none;">
	     <div class="empty">must not be empty</div>
	     <div class="invalid">must be complete and valid</div>
	 </div>
	 
	 <form id="feedback" method="post" action="">
	     <label>Name</label>
	     <input id="name" name="name" type="text" maxlength="100" class="widget" value="" tabindex="1"/>
	     
	     <label>Email address <span class="ui-validation-error-message"></span></label>
	     <input id="email" name="from" type="text" maxlength="100" class="widget" value="" tabindex="2"/>
	     
	     <label>Nature of message <span class="ui-validation-error-message"></span></label>
	     <input id="subject" name="subject" type="text" maxlength="100" class="widget" value=""  tabindex="3"/>
	     <div class="example" style="display: block;">Examples: <a href="#">software bug</a>, <a href="#">feedback</a>, <a href="#">feature request</a></div>
	     
	     <label>Message <span class="ui-validation-error-message"></span></label>
	     <textarea id="message" name="message" class="widget" value=""  tabindex="4"></textarea>
	     
	     <input type="submit" id="feedbackBtn" value="Send message" class="widget"  />
	</form>
	
	<div class="loading_message loading_line">
		Sending message...
	</div>
	<div class="complete_message complete_line">
		Message sent to the GeneMANIA team
	</div>
</c:if>

<c:if test='${pageContext.request.method == "POST"}'>
	<p>Thank you!  Your message has been received by the GeneMANIA team.</p>
</c:if>

