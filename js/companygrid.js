Ext.ux.CompanyGrid = Ext.extend( Ext.grid.EditorGridPanel, {
	
	constructor: function(config) {
		
		Ext.ux.CompanyGrid.superclass.constructor.call(this, Ext.apply({
			title: 'Company List'
			,id: 'company-grid-panel'
//			,autoExpandColumn: 'email'
			,layout: 'fit'
			,frame: true
			,width: 'auto'
			,height: 300
			,plugins:[
//				new Ext.ux.CustomerGridActions({align:'left'})
			]
			,stripeRows:true
			,store: new Ext.ux.CompanyStore({
				storeId: 'company-grid-store'
				,autoSave: true
				,autoLoad: true
				,autoDestroy: true
				,batch: false
				,root: 'rows'
				,totalProperty: 'results'
				,url: 'php/company.php'
				,contentType: 'application/json; charset=UTF-8'
				,baseParams: {
					task: 'company'
					,start: 0
 					,limit: 10
 					,userid: userdata.validated
				}
			})
			,colModel: new Ext.grid.ColumnModel({
				defaults:{
					width: 100
					,sortable: false
					,editor:new Ext.form.TextField()
				}
				,columns: [
					{header:'id', hidden: true, sortable: false, dataIndex: 'id', id: 'id'}
					,{header:'Name', width: 80, dataIndex: 'company', editable: true}
					,{header:'Adresse1', width: 80, dataIndex: 'addr1', id: 'adresse1'}
					,{header:'Adresse2', width: 80, dataIndex: 'addr2'}
					,{header:'Zipcode', dataIndex: 'zipcode'}
					,{header:'City', width: 80, dataIndex: 'city', editable: true}
					,{header:'Country', dataIndex: 'country'}
					,{header:'Phone', dataIndex: 'phone'}
					,{header:'Mobile', dataIndex: 'mobile'}
					,{header:'Email',  dataIndex: 'email', id: 'email'}
					,{header:'Web-site',  dataIndex: 'web'}
				]
			})
			,bbar: new Ext.PagingToolbar({
				pageSize: 10
				,store: 'company-grid-store'
				,displayInfo: true
				,displayMsg: 'Displaying topics {0} - {1} of {2}'
				,emptyMsg: "No topics to display"
				,items:['-']
			})
		}, config ) // Ext.apply
		); // Ext.ux.CompanyGrid.superclass.constructor.call(this
	
	} // constructor: function(config)

}); // Ext.ux.CompanyGrid

Ext.reg('companygrid', Ext.ux.CompanyGrid);
