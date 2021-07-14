	var user = Ext.data.Record.create([{
		name: 'id',
		type: 'integer'
	},{
		name: 'manager',
		type: 'integer'
	},{
		name: 'fname',
		type: 'string'
	},{
		name: 'lname',
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
		name: 'login',
		type: 'string'
	},{
		name: 'passwd',
		type: 'string'
	},{
		name: 'usergroup',
		type: 'integer'
	},{
		name: 'level',
		type: 'string'
	},{
		name: 'kundeid',
		type: 'integer'
	}]);
	
Ext.ux.UserStore = Ext.extend( Ext.data.JsonStore, {
	
	constructor: function(config) {
		
		Ext.ux.UserStore.superclass.constructor.call(this, Ext.apply({
			storeId: 'userstore'
			,autoDestroy: true
			,url: 'php/user.php'
			,autoLoad: true
			,autoSave: true
			,root: 'rows'
			,idProperty: 'id'
			,fields: user
			,reader: new Ext.data.JsonReader({
				idProperty: 'id'
				,root: 'rows'
				,totalProperty: 'total'
				,fields: user
			})
			,writer: new Ext.data.JsonWriter({
				idProperty: 'id'
				,root: 'rows'
				,totalProperty: 'total'
				,writeAllFields: true
				,fields: user
			})
		}, config) // Ext.apply
		); // Ext.ux.UserStore.superclass.constructor.call(this
	} // constructor: function(config)

}); // Ext.ux.UserStore

Ext.reg('userstore', Ext.ux.UserStore);
