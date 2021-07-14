	var company = Ext.data.Record.create([{
		name: 'id',
		type: 'integer'
	},{
		name: 'company',
		type: 'string'
	},{
		name: 'addr1',
		type: 'string'
	},{
		name: 'addr2',
		type: 'string'
	},{
		name: 'zipcode',
		type: 'string'
	},{
		name: 'city',
		type: 'string'
	},{
		name: 'country',
		type: 'string'
	},{
		name: 'cvr',
		type: 'string'
	},{
		name: 'phone',
		type: 'string'
	},{
		name: 'mobile',
		type: 'string'
	},{
		name: 'email',
		type: 'string'
	},{
		name: 'web',
		type: 'string'
	}]);

Ext.ux.CompanyStore = Ext.extend( Ext.data.JsonStore, {
	
	constructor: function(config) {
		
		Ext.ux.CompanyStore.superclass.constructor.call(this, Ext.apply({
			storeId: 'companystore'
			,autoDestroy: true
			,url: 'php/company.php'
			,autoLoad: true
			,autoSave: true
			,root: 'rows'
			,idProperty: 'id'
			,fields: company
			,reader: new Ext.data.JsonReader({
				idProperty: 'id'
				,root: 'rows'
				,totalProperty: 'total'
				,fields: company
			})
			,writer: new Ext.data.JsonWriter({
				idProperty: 'id'
				,root: 'rows'
				,totalProperty: 'total'
				,writeAllFields: true
				,fields: company
			})
		}, config) // Ext.apply
		); // Ext.ux.CompanyStore.superclass.constructor.call(this
	} // constructor: function(config)

}); // Ext.ux.CompanyStore

Ext.reg('companystore', Ext.ux.CompanyStore);
