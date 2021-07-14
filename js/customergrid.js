Ext.ux.CustomerGrid = Ext.extend( Ext.grid.EditorGridPanel, {
	
	constructor: function(config) {
		
		Ext.ux.CustomerGrid.superclass.constructor.call(this, Ext.apply({
			title: 'Kunde liste'
			,id: 'customer-grid-panel'
			,autoExpandColumn: 'adresse'
			,layout: 'fit'
			,frame: true
			,width: 'auto'
			,height: 300
			,plugins:[
				new Ext.ux.CustomerGridActions({align:'left'})
			]
			,stripeRows:true
			,store: new Ext.ux.CustomerStore({
				storeId: 'customer-grid-store'
				,autoSave: true
				,autoLoad: true
				,autoDestroy: true
				,batch: false
				,root: 'rows'
				,totalProperty: 'results'
				,url: 'php/customergrid.php'
				,baseParams: {
					task: 'customer'
					,start: 0
					,limit: 10
				}
			})
			,colModel: new Ext.grid.ColumnModel({
				defaults:{
					width: 100
					,sortable: true
					,editor:new Ext.form.TextField()
				}
				,columns: [
					{id: 'kundeid', header:'Kundeid', hidden: true, sortable: false, dataIndex: 'kundeid'}
					,{header:'Level', dataIndex: 'level', editable: false
						,cellActions: [{
							 iconCls:'icon-plus'
							,qtip:'Promote'
						},{
							 iconCls:'icon-minus'
							,qtip:'Demote'
						}]
					}
					,{header:'Fornavn', width: 80, dataIndex: 'fornavn'
					}
					,{header:'Efternavn', width: 80,  dataIndex: 'efternavn'}
					,{id:'adresse', header:'Adresse', dataIndex: 'adresse'}
					,{header:'Postnr', width: 45, dataIndex: 'postnr'}
					,{header:'Bynavn', dataIndex: 'bynavn', editable: false}
					,{header:'Telefon', dataIndex: 'telefon'}
					,{header:'Mobil', dataIndex: 'mobil'}
					,{header:'Email', width: 140, dataIndex: 'email'
						, cellActions: [{
							 iconCls:'icon-email'
							,qtip:'Click to send email'
						}]
					}
					,{header: 'userid', hidden: true, dataIndex: 'userid'}
					,{header: 'usergroup', hidden: true, dataIndex: 'usergroup'}
				]
			})
			,bbar: new Ext.PagingToolbar({
				pageSize: 10
				,store: 'customer-grid-store'
				,displayInfo: true
				,displayMsg: 'Displaying topics {0} - {1} of {2}'
				,emptyMsg: "No topics to display"
				,items:['-']
			})
		}, config ) // Ext.apply
		); // Ext.ux.CustomerGrid.superclass.constructor.call(this
	
	} // constructor: function(config)

}); // Ext.ux.CustomerGrid

Ext.reg('customergrid', Ext.ux.CustomerGrid);
