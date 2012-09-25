


var refTpl = new Ext.XTemplate(
    '<div class="title"><B>References</B></div>',
    '<table style="margin-bottom: 10px;margin-top:10px"',
    '<tpl for=".">',
        ' <tr class="ref-item">',
          '<tr ><td class="ref-id">{_id}</td>',
          '<td class="ref-title">{name}</td>',
          '<td class="ref-action" valign="middle"><img src="/ext/resources/images/minus.png"></td>',
        '</tr>',
    '</tpl>'
    ,'<tr><td colspan="2"><input type="text" size="20" id="add-ref-control"></td><td><img src="/ext/resources/images/plus.png"></td></tr>'
    ,'</table>'
);
/**
Ext.create('Ext.view.View', {
    store: Ext.create('Ext.data.ArrayStore',{
      model:'Precon.model.Reference',
      data:[]
    }),
    tpl: refTpl,
    itemSelector: 'tr.ref-item',
    emptyText: 'No images available',
    renderTo: Ext.getBody()
});

Ext.define('Precon.view.ReferenceEditor', {
	extend:'Ext.view.View',
	alias:'widget.refeditor',
	bodyPadding: 15,
  width: 'auto',
  height: 'auto',
  frame:false,
  border: false,
  bodyBorder:false,
  bodyStyle: {
    background:'transparent'
  },
  store: Ext.create('Ext.data.ArrayStore',{
          model:'Precon.model.Reference',
          data:[]
        }),
    tpl: refTpl,
    itemSelector: 'tr.ref-item',
    emptyText: '',
  
});*/

Ext.define('Precon.view.ReferenceEditor', {
    extend: 'Ext.grid.Panel',
    requires: [
       
        'Precon.model.Reference'
    ],
    //selModel: Ext.create('Ext.selection.CheckboxModel'),
    id:'refeditor',
    alias : 'widget.refeditor',

    title : 'Link References',
    multiSelect:true,
  
  //define the data
  store: Ext.create('Ext.data.ArrayStore', {
    model:'Precon.model.Reference',
    data:[]
  }),
   
    
    initComponent: function() {
              this.columns = [
              
                 {
                    text     : 'Pubmed ID',
                   // flex     : 1,
                    sortable : true, 
                    width: 100,
                    dataIndex: '_id',
                     renderer: function(val, meta, record){
                      return val && val.indexOf('publ') ==0 ? val.substring(4): val
                      //return '<a href="http://www.ncbi.nlm.nih.gov/pubmed?term='+ record.get('_id').substring(4)+'" target="pubmed">' + val+"</a>"
                    }
                },
                {
                    text     : 'Reference Title', 
                    flex:1,
                    sortable : true, 
                    dataIndex: 'name',
                    renderer: function(val, meta, record){
                      return val
                      //return '<a href="http://www.ncbi.nlm.nih.gov/pubmed?term='+ record.get('_id').substring(4)+'" target="pubmed">' + val+"</a>"
                    }
                   // renderer: change
                },{
                  
                }
               
              ];
     
              this.callParent(arguments);
    },
    height: 'auto',
    width: 'auto',
   // renderTo: Ext.getBody(),
    viewConfig: {
        stripeRows: true
    },
     
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'bottom',
        ui: 'footer',
        //margin:'0 0 20 0',
//      defaults: {minWidth: minButtonWidth},
        items: [
             {xtype:'textfield', flex:1,width:300, id:'add-ref-input'},
             { type: 'button', text: 'Add Reference', handler:function(){  } },
        ]
    }] 
})

