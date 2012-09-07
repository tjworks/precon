Ext.define('Precon.view.ZoomSliderView' ,{
    //extend: 'Ext.slider.Single',
   //     alias : 'widget.zoomslider',
    
    extend: 'Ext.window.Window',
        alias : 'widget.zoomslider',
        title : 'this is test',
         width: 80,
         height:240,  
         //id:"zoomslider",
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
         bodyStyle:" border-color:transparant; background-color:transparant; ",
         style:"left:30px; top 10px; border-width:0px; border-color:transparent; background-color:transparent; box-shadow: 0 0px 0 0 transparent inset, 0 -1px 0 0 transparent inset, -1px 0 0 0 transparent inset, 1px 0 0 0 transparent inset",
         layout: 'anchor',
         //buttonAlign:'left',
         items:[
                      {
    
					  xtype: 'slider',
					  name: 'label',
					  cls:'zoomslider',
					  //value:obj.label
					  vertical:true,
					  id: "zoomslider",
					  value:8,
					  fieldStyle:"border-color:transparant; background-color:transparant; ",
					  style:"border-color:transparant; background-color:transparant;",
				       minValue: 0,
				       maxValue: 14,
				      increment: 1,
					  width:45,
					  height:150,
					  label:'label',
					  fieldSubTpl:[
							        '<img src="../ext/resources/images/plus.png" alt="plus" width="16"; height="16" style="margin:4px" role="presentation">',
							                '</img>',
							        '<div id="{id}" class="' + Ext.baseCSSPrefix + 'slider {fieldCls} {vertical}" aria-valuemin="{minValue}" aria-valuemax="{maxValue}" aria-valuenow="{value}" aria-valuetext="{value}">',
							            
							            '<div id="{cmpId}-endEl" class="' + Ext.baseCSSPrefix + 'slider-end" role="presentation">',
							                '<div id="{cmpId}-innerEl" class="' + Ext.baseCSSPrefix + 'slider-inner" role="presentation">',
							                    '{%this.renderThumbs(out, values)%}',
							                '</div>',
							            '</div>',
							        '</div>',
							        '<img src="../ext/resources/images/minus.png" alt="plus" width="16"; height="16" style="margin:4px" role="presentation">',
							                '</img>',
							        {
							            renderThumbs: function(out, values) {
							                var me = values.$comp,
							                    i = 0,
							                    thumbs = me.thumbs,
							                    len = thumbs.length,
							                    thumb,
							                    thumbConfig;
							
							                for (; i < len; i++) {
							                    thumb = thumbs[i];
							                    thumbConfig = thumb.getElConfig();
							                    thumbConfig.id = me.id + '-thumb-' + i;
							                    Ext.DomHelper.generateMarkup(thumbConfig, out);
							                }
							            },
							            disableFormats: true
							        }
							    ],
					  tipText: function (v) {if (v.value>8) return "+"+(v.value-8); else if (v.value<8) return "-"+(8-v.value); else return ""},
					  hideLabel:false,
					  listeners: {
					  	afterrender: function() {
					  		console.log(this.el.dom.parentElement);
					  		console.log(this.el.dom.parentElement.id);
					  		Ext.get(this.el.dom.parentElement.id).setStyle("background","none repeat scroll 0 0 transparent");
					  	}
					  },
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
		

