Ext.ux.CustomerWindow = Ext.extend( Ext.Window, {
	
	constructor: function(config){
		
		Ext.ux.CustomerWindow.superclass.constructor.call(this, Ext.apply({
		
		}, config ));
	}

});

Ext.reg('customerwindow', Ext.ux.CustomerWindow);
