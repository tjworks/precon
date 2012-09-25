


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
   
    scroll:'vertical',
    initComponent: function() {
              this.columns = [
              
                 {
                    text     : 'Pubmed ID',
                   // flex     : 1,
                    sortable : true, 
                    width: 80,
                    dataIndex: '_id',
                     renderer: function(val, meta, record){
                      return val && val.indexOf('publ') ==0 ? val.substring(4): val
                      //return '<a href="http://www.ncbi.nlm.nih.gov/pubmed?term='+ record.get('_id').substring(4)+'" target="pubmed">' + val+"</a>"
                    }
                },
                {
                    text     : 'Reference Title (Double click to remove reference)', 
                    flex:1,
                    sortable : true, 
                    dataIndex: 'name',
                    renderer: function(val, meta, record){
                      return val
                      //return '<a href="http://www.ncbi.nlm.nih.gov/pubmed?term='+ record.get('_id').substring(4)+'" target="pubmed">' + val+"</a>"
                    }
                   // renderer: change
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
             { type: 'button', id:'add-ref-btn', text: 'Add Reference', disabled:false, handler:function(btn){ 
                  var val = $("#add-ref-input-inputEl").val();
                  var m = val.match(/(\d{5,}),(.+)/);
                  if(m){
                      var newref = { _id: "publ"+ m[1], name: m[2] };
                      var store =  btn.up("refeditor").getStore();
                      if(store.findExact("_id", newref._id) <0) store.add(newref)     
                  }// end if                
               }// end handler func 
             }// end type 
        ]
    }],
    listeners:{
      itemdblclick:function(vw,a2,a3, rowIndex){
        //console.log("dbclick", arguments)
        myarg = arguments        
        vw.up("refeditor").getStore().removeAt(rowIndex);
      },
      afterrender:function(){
         var searchctl = $("#add-ref-input-inputEl")
         //console.log("Refeditor afterrender ",searchctl);
         
         searchctl.autocomplete({
              open:function(){
                $("ul.ui-autocomplete").css("zIndex", 20000); // in Ext Modal window this is not showing up, must set high z-index (Ext's 19020)
              },
              source: function(req, callback){
                    term = req.term
                    log.debug("validating ref")
                    precon.quickSearch(term, function(results){
                      log.debug("kw search results by "+term, results)
                      callback(results)
                    }, 'publication')      
              },
              minLength:2,
              select: function(event, ui) {
                log.debug("selected " + ui)
                //document.location='/graph/'+ ui.item._id          
              },
              focus: function(event, ui) { 
                //console.log('focused '+ ui.item._id);
                if(ui.item && ui.item._id)
                {
                  searchctl.attr('data', ui.item._id)
                  //$("#add-ref-btn").removeClass('disabled')
                }
                
              },
              search: function(event, ui){
                searchctl.attr('data', '')
                //$("#add-ref-btn").addClass('disabled')
              }
            });
        
       
      }
    }
})

