Ext.define('Precon.view.GraphLegendWindow', 
	{
		extend:'Ext.window.Window',
	    bodyPadding: 5,
	    width: 189,
	    height:250,	   
	    animCollapse:true,
	    resizable:false,
	    animateTarget:'legendToggleBtn',
	    collapseDirection:'bottom',
	    //collapsible:true,
	    title: 'Graph Legend',
	    hidden:true,
	    id:'legendWindow',
	    autoHeight:true,
	    closeAction: 'hide',
	    html: '<table width="250" border="0" height="200"><tr><td width="40"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="activates"/></svg></td><td>Activates</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="association"/></svg></td><td>Association</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="beinguptaken"/></svg></td><td>Being Uptaken</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="decreases"/></svg></td><td>Decreases</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="inhibits"/></svg></td><td>Inhibits</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="pathway"/></svg></td><td>Pathway</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="phosphorylates_activates"/></svg></td><td>Phosphorylates/Activates</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="physical_interaction"/></svg></td><td>Physical Interaction</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="predicted"/></svg></td><td>Predicted</td></tr><tr><td width="30"  height="10"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px", height="10px"><line x1="0" y1="10" x2="30" y2="10" class="stimulats"/></svg></td><td>Stimulats</td></tr></table>',
	    listeners: {
	    	close: { 
	    		fn: function () {
	    				Ext.getCmp("legendToggleBtn").toggle();
	    			}
	    	}
	    }
	});
