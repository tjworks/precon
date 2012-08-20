/**
 * A base controller to define common methods
 */
Ext.define('Precon.controller.BaseController', {
    extend: 'Ext.app.Controller',

    getGraphModel: function(){ return app && app.graphModel},
    // get the object id from the URL, if it's available
    getObjectIdFromUrl: function(){
    	var matcher = location.href.match(/graph\/([^\/]*?)[#\?]?$/)
    	if(matcher) return matcher[1]
    	return ''
    },
});

 