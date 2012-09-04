Ext.define('Precon.view.ZoomSliderView' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.zoomslider',
    title : 'this is test',
   	 width: 50,
     height:160,  
     hidden:false,
     frame:false,
     border:false,
     resizable:false,
     closable:false,
     header:false,
     shadow:false,
     draggable:false,
     x:30,
     y:10,
     bodyStyle:" border-color:white; background-color:white; ",
     style:"left:30px; top 10px; border-width:0px; border-color:white; background-color:white; box-shadow: 0 0px 0 0 white inset, 0 -1px 0 0 white inset, -1px 0 0 0 white inset, 1px 0 0 0 white inset",
     layout: 'anchor',
	 //buttonAlign:'left',
	 items:[
				  {
					  xtype: 'slider',
					  name: 'label',
					  cls:'zoomslider',
					  id:'zoomslider',
					  //value:obj.label
					  vertical:true,
					  value:8,
				       minValue: 0,
				       maxValue: 14,
				      increment: 1,
					  width:45,
					  height:150,
					  tipText: function (v) {if (v.value>8) return "+"+(v.value-8); else if (v.value<8) return "-"+(8-v.value); else return ""},
					  hideLabel:true,
					  tpl:new Ext.XTemplate('<tpl for=".">','<table class="x-field zoomslider x-form-item x-field-default x-anchor-form-item" style="height: 150px; table-layout: auto;" id="slider-1011" cellpadding="0"><tbody><tr id="slider-1011-inputRow"><td id="slider-1011-labelCell" style="display:none;" halign="left" class="x-field-label-cell" valign="top" width="105"><label id="slider-1011-labelEl" for="slider-1011-inputEl" class="x-form-item-label x-form-item-label-left" style="width:100px;margin-right:5px;">sliderlabel</label>test</td><td class="x-form-item-body " id="slider-1011-bodyEl" colspan="3" role="presentation"><div style="-moz-user-select: text;" data-errorqtip="" aria-invalid="false" id="slider-1011-inputEl" class="x-slider x-form-field x-slider-vert" aria-valuemin="0" aria-valuemax="15" aria-valuenow="" aria-valuetext=""><div id="slider-1011-endEl" class="x-slider-end" role="presentation"><div style="height: 136px;" id="slider-1011-innerEl" class="x-slider-inner" role="presentation"><div style="bottom:0%;" id="slider-1011-thumb-0" class="x-slider-thumb"></div></div></div></div></td></tr></tbody></table>','</tpl>'),
					  listeners: {
					  	afterrender: function() {
					  	}
					  }
				  }
		],
	constructor: function(config) {
		//this.initConfig(config);
		this.callParent(arguments);
	},
	initComponent: function() {
		this.callParent(arguments);
	}
}
);
		

