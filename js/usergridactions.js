Ext.ux.UserGridActions = Ext.extend( Ext.ux.grid.CellActions, {
	
	constructor: function(config){
		
		Ext.ux.UserGridActions.superclass.constructor.call(this, Ext.apply({
			align: 'left'
			,listeners:{
				action:function(grid, record, action, value, dataindex, rowindex, column) {
					Ext.ux.Toast.msg('Event: action', 'You have clicked: <b>{0}</b>, action: <b>{1}</b>', value, action);
				}
				,beforeaction:function(grid, record, action, value, dataindex, rowindex, column) {
					Ext.ux.Toast.msg('Event: beforeaction', 'You can cancel the action by returning false from this event handler.');
				}
			}
			,callbacks:{
				'icon-undo':function(grid, record, action, value, dataindex, rowindex, column) {
					Ext.ux.Toast.msg('Callback: ', 'You have clicked: <b>{0}</b>, action: <b>{1}</b>', value, action);
				}
				,'icon-email':function(grid, record, action, value, dataindex, rowindex, column) {
					Ext.ux.Toast.msg('Callback: ', 'You have clicked: [{2}]<b>{0}</b>, action: <b>{1}</b>', value, action,record.id);
				}
				,'icon-plus':function(grid, record, action, value, dataindex, rowindex, column) {
					Ext.ux.Toast.msg('Callback: ', 'You have clicked: [<b>{2}</b>]<b>{0}</b>, action: <b>{1}</b>', value, action,record.id);
					Ext.Ajax.request({
						url: 'php/usergrid.php'
						,headers: {
							'my-header': 'usergrid'
						}
						,params: {
							task: 'user-promote'
							,kundeid: record.data.kundeid
							,userid: record.id
						}
						,success: function(response, options) {
							/**
							Ext.ux.Toast.msg('Callback: success'
								, 'KundeId: {0} UserId: {1}'
								, options.params.kundeid
								, options.params.userid);
							**/
							var obj = Ext.decode(response.responseText);
							if (obj.success == true)
							{
								grid.getStore().reload();
							}
							
							if (obj.failure == true)
							{
								Ext.Msg.show({
									title: 'Failure: ' + action
									,msg: obj.errors.reason
									,buttons: Ext.Msg.OK
									,icon: Ext.MessageBox.INFO
								});
								setTimeout("Ext.Msg.hide()",3000);
							}
						}
						,failure: function(response, options) {
							Ext.ux.Toast.msg('Callback: failure'
								, 'KundeId: {0} UserId: {1}'
								, options.params.kundeid
								, options.params.userid);
						}
					});
				}
				,'icon-minus':function(grid, record, action, value, dataindex, rowindex, column) {
					Ext.ux.Toast.msg('Callback: ', 'You have clicked: [<b>{2}</b>]<b>{0}</b>, action: <b>{1}</b>', value, action,record.id);
					Ext.Ajax.request({
						url: 'php/usergrid.php'
						,headers: {
							'my-header': 'usergrid'
						}
						,params: {
							task: 'user-demote'
							,kundeid: record.data.kundeid
							,userid: record.id
						}
						,success: function(response, options) {
							/**
							Ext.ux.Toast.msg('Callback: success'
								, 'KundeId: {0} UserId: {1}'
								, options.params.kundeid
								, options.params.userid
							);
							**/
							var obj = Ext.decode(response.responseText);
							
							if (obj.success == true)
							{
								grid.getStore().reload();
							}
							
							if (obj.failure == true)
							{
								Ext.Msg.show({
									title: 'Failure: ' + action
									,msg: obj.errors.reason
									,buttons: Ext.Msg.OK
									,icon: Ext.MessageBox.INFO
								});
								setTimeout("Ext.Msg.hide()",3000);
							}
						}
						,failure: function(response, options) {
							Ext.ux.Toast.msg('Callback: failure'
								, 'KundeId: {0} UserId: {1}'
								, options.params.kundeid
								, options.params.userid);
						}
					});
					grid.getStore().reload();
				}
			}
		}, config ));
	}

});

Ext.reg('usergridactions', Ext.ux.UserGridActions);
