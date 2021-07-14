	var customer = Ext.data.Record.create([{
		name: 'id',
		type: 'integer'
	},{
		name: 'user',
		type: 'integer'
	},{
		name: 'owner',
		type: 'integer'
	},{
		name: 'name',
		type: 'string'
	},{
		name: 'addr1',
		type: 'string'
	},{
		name: 'addr2',
		type: 'string'
	},{
		name: 'country',
		type: 'string'
	},{
		name: 'zipcode',
		type: 'string'
	},{
		name: 'contact',
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
		name: 'notat',
		type: 'string'
	}]);

Ext.ux.CustomerStore = Ext.extend( Ext.data.JsonStore, {
	
	constructor: function(config) {
		
		Ext.ux.CustomerStore.superclass.constructor.call(this, Ext.apply({
			storeId: 'customerstore'
			,autoDestroy: true
			,url: 'php/customer.php'
			,autoLoad: true
			,autoSave: true
			,root: 'rows'
			,idProperty: 'id'
			,fields: customer
			,reader: new Ext.data.JsonReader({
				idProperty: 'id'
				,root: 'rows'
				,totalProperty: 'total'
				,fields: customer
			})
			,writer: new Ext.data.JsonWriter({
				idProperty: 'id'
				,root: 'rows'
				,totalProperty: 'total'
				,writeAllFields: true
				,fields: customer
			})
		}, config) // Ext.apply
		); // Ext.ux.CustomerStore.superclass.constructor.call(this
	} // constructor: function(config)

}); // Ext.ux.CustomerStore

Ext.reg('customerstore', Ext.ux.CustomerStore);
