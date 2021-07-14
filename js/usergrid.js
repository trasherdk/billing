Ext.ux.UserGrid = Ext.extend( Ext.grid.EditorGridPanel, {
	
	constructor: function(config) {
		
		Ext.ux.UserGrid.superclass.constructor.call(this, Ext.apply({
			title: 'Bruger liste'
			,id: 'user-grid-panel'
			,autoExpandColumn: 'email'
			,layout: 'fit'
			,frame: true
			,width: 'auto'
			,height: 300
			,plugins:[
				new Ext.ux.UserGridActions({align:'left'})
			]
			,stripeRows:true
			,store: new Ext.ux.UserStore ({
				storeId: 'user-grid-store'
				,autoSave: true
				,autoLoad: true
				,autoDestroy: true
				,batch: false
				,root: 'rows'
				,totalProperty: 'results'
				,url: 'php/usergrid.php'
				,baseParams: {
					task: 'user'
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
					{id: 'id', header:'id', hidden: true, sortable: false, dataIndex: 'id'}
					,{header:'Fornavn', width: 100, dataIndex: 'fname'
						,cellActions: [{
							 iconCls:'icon-plus'
							,qtip:'Promote'
						},{
							 iconCls:'icon-minus'
							,qtip:'Demote'
						}]
					}
					,{header:'Efternavn', width: 80,  dataIndex: 'lname'}
					,{header:'Telefon', width: 80, dataIndex: 'phone'}
					,{header:'Mobil', width: 80, dataIndex: 'mobile'}
					,{id: 'email', header:'Email', width: 140, dataIndex: 'email'
						, cellActions: [{
							 iconCls:'icon-email'
							,qtip:'Click to send email'
						}]
					}
					,{header: 'Level', dataIndex: 'level'}
					,{header: 'kundeid', hidden: true, dataIndex: 'kundeid'}
					,{header: 'usergroup', hidden: true, dataIndex: 'usergroup'}
				]
			})
			,bbar: new Ext.PagingToolbar({
				pageSize: 10
				,store: 'user-grid-store'
				,displayInfo: true
				,displayMsg: 'Displaying topics {0} - {1} of {2}'
				,emptyMsg: "No topics to display"
				,items:['-']
			})
		}, config ) // Ext.apply
		); // Ext.ux.UserGrid.superclass.constructor.call(this
	
	} // constructor: function(config)

}); // Ext.ux.UserGrid

Ext.reg('usergrid', Ext.ux.UserGrid);
