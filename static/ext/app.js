/*
 * Here defines the main interface for the Graph part of the code.
 */
Ext.Loader.setConfig({
	enabled:true,
	 paths   : {
            'Ext.ux' : '/ext/extjs/ux'      
        } 
	});
Ext.require([
    //'Ext.selection.CheckboxModel'
]);
Ext.onReady(function(){
	log.info("Ext ready");
});
Ext.application({
	enabled:true,
	//the name space for the app
    name: 'Precon',
    //the location of the code folder
    appFolder: '/ext/app',
    
    //defines the controllers 
    controllers: [
    	'GraphWin','Reference','NetworkGridController','LinkController', 'NodeController'
    ],    
    stores:['MyNetworks', 'Networks'],
    views:[ 'GraphViewport'],    
	init: function(){
		log.info("Ext Application init")
		// create model instance
    	this.graphModel = new precon.NetworkGraph()    	
		// define a global reference to the appication
		app = this;
	},
	//start the view port components
    launch: function() {    	
    	log.info("Ext Application launch")
    	// create view
    	Ext.create('Precon.view.GraphViewport' )  
    	precon.flushCache();  	
    },
    getUser:function(){
    	if(window.user && window.user.user_id)
    		return window.user
    	return null
    }
});


