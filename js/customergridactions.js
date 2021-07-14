Ext.ux.CustomerGridActions = Ext.extend( Ext.ux.grid.CellActions, {
	
	constructor: function(config){
		
		Ext.ux.CustomerGridActions.superclass.constructor.call(this, Ext.apply({
			align: 'left'
			,listeners:{
				action:function(grid, record, action, value, dataindex, rowindex, column) {
					Ext.ux.Toast.msg('Event: action', 'You have clicked: <b>{0}</b>, action: <b>{1}</b>', value, action);
				}
				,beforeaction:function(grid, record, action, value, dataindex, rowindex, column) {
					/**
					Ext.ux.Toast.msg('Event: beforeaction', 'You can cancel the action by returning false from this event handler.');
					**/
					error = false;
					switch(action)
					{
						case 'icon-minus':
							if (record.data.userid == null)
							{
								error = true;
								mesg  = '['+ action + '] Has been canceled because<br />customer not in users database.';
							}
							else if (record.data.usergroup < 2)
							{
								error = true;
								mesg  = '['+ action + '] Has been canceled because<br />customer is allready at lowest access level.';
							}
							if (record.data.userid == userdata['validated'])
							{
								error = true;
								mesg = '['+ action + '] Has been canceled because:<br />You can not promote/demote yourself.<br />Contact an Administrator.';
							}
							break;
						case 'icon-plus':
							if (record.data.userid == userdata['validated'])
							{
								error = true;
								mesg = '['+ action + '] Has been canceled because:<br />You can not promote/demote yourself.<br />Contact an Administrator.';
							}
							break;
					}
					
					if (error == true)
					{
						Ext.Msg.show({
							title: 'Customer Action'
							,msg: mesg
							,buttons: Ext.Msg.OK
							,icon: Ext.MessageBox.INFO
						});
						setTimeout("Ext.Msg.hide()",3000);
						
						return false;
					}
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
						url: 'php/customergrid.php'
						,headers: {
							'my-header': 'customergrid'
						}
						,params: {
							task: 'customer-promote'
							,kundeid: record.id
							,userid: record.data.userid
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
							/**/
							Ext.ux.Toast.msg('Callback: failure'
								, 'KundeId: {0} UserId: {1}'
								, options.params.kundeid
								, options.params.userid);
							/**
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
							**/
						}
					});
				}
				,'icon-minus':function(grid, record, action, value) {
					Ext.ux.Toast.msg('Callback: ', 'You have clicked: [<b>{2}</b>]<b>{0}</b>, action: <b>{1}</b>', value, action,record.id);
					Ext.Ajax.request({
						url: 'php/customergrid.php'
						,headers: {
							'my-header': 'customergrid'
						}
						,params: {
							task: 'customer-demote'
							,kundeid: record.id
							,userid: record.data.userid
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
			}
		}, config ));
	}

});

Ext.reg('customergridactions', Ext.ux.CustomerGridActions);
