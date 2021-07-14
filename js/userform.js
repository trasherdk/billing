Ext.ux.UserForm = Ext.extend( Ext.FormPanel, {
	
	constructor: function(config){
		
		Ext.ux.UserForm.superclass.constructor.call(this, Ext.apply({
			url:'php/userform.php',
			frame:true,
			title:'Please enter credientials', 
			defaultType:'textfield',
			monitorValid:true,
			labelWidth:80,
			items: [{
				id: 'user-id',
				fieldLabel: 'ID',
				name: 'data[id]',
				value: 0,
				hideLabel:true,
				hidden:true
			},{
				id: 'user-manager',
				fieldLabel:'Manager', 
				xtype:'combo',
				hiddenId:'user-manager-id',
				hiddenName:'data[manager]',
				typeAhead:true,
				minChars:2,
				emptyText: 'Select a Manager...',
				loadingText: 'Loading...',
				triggerAction: 'all',
				lazyRender: true,
				mode: 'remote',
				allowBlank: false,
				valueField: 'data[manager]' ,
				displayField: 'managername',
				hiddenValue: Ext.state.Manager.get('userdata.manager'),
				store: new Ext.data.JsonStore({
					autoDestroy: true,
					autoLoad: true,
					url: 'php/userform.php',
					baseParams: {
						task: 'get-manager'
						,user: Ext.state.Manager.get('userdata.validated')
						,debug: 0
					},
					root: 'rows',
					totalProperty: 'results',
					id: 'manager',
					idProperty: 'manager',
					fields: ['manager','managername']
				})
			},{
				id: 'user-fname',
				fieldLabel:'First Name', 
				name:'data[fname]',
				value: '',
				allowBlank:false 
			},{
				id: 'user-lname',
				fieldLabel:'Last Name', 
				name:'data[lname]',
				value: '',
				allowBlank:false 
			},{
				id: 'user-location',
				fieldLabel:'Location', 
				name:'data[location]',
				value: '',
				hideLabel:true,
				hidden:true
			},{
				id: 'user-phone',
				fieldLabel:'Phone', 
				name:'data[phone]',
				value: '',
				allowBlank:false 
			},{
				id: 'user-mobile',
				fieldLabel:'Mobile', 
				name:'data[mobile]',
				value: '',
				hideLabel:true,
				hidden:true
			},{
				id: 'user-email',
				fieldLabel:'E-mail', 
				width: 250,
				name:'data[email]',
				value: '',
				allowBlank:false 
			},{
				id: 'user-domain',
				fieldLabel:'Domain', 
				name:'data[domain]',
				value: '',
				hideLabel:true,
				hidden:true
			},{
				id: 'user-login',
				fieldLabel:'Login', 
				name:'data[login]',
				value: '',
				hideLabel:true,
				hidden:true
			},{
				id: 'user-passwd',
				fieldLabel:'Password', 
				name:'data[passwd]',
				value: '',
				allowBlank:false
			},{
				id: 'user-pwcrypt',
				fieldLabel:'EnCrypted', 
				name:'data[pwcrypt]',
				value: '',
				hideLabel:true,
				hidden:true
			},{
				id: 'user-admin',
				fieldLabel:'Administrator', 
				xtype:'checkbox',
				name:'data[admin]',
				value: false,
				allowBlank:false 
			},{
				id: 'user-read-write',
				fieldLabel:'Read/Write', 
				xtype:'checkbox',
				name:'data[readwrite]',
				value: false,
				allowBlank:false 
			},{
				id: 'user-usergroup',
				fieldLabel:'Usergroup', 
				xtype:'combo',
				hiddenId:'user-group-id',
				hiddenName:'data[usergroup]',
				typeAhead:true,
				minChars:2,
				emptyText: 'Select a Usergroup...',
				loadingText: 'Loading...',
				triggerAction: 'all',
				lazyRender: true,
				mode: 'remote',
				allowBlank: false,
				valueField: 'usergroup' ,
				displayField: 'usergroupname',
				store: new Ext.data.JsonStore({
					autoDestroy: true,
					autoLoad: false,
					url: 'php/userform.php',
					baseParams: {
						task: 'get-usergroup',
						debug: 0
					},
					root: 'rows',
					totalProperty: 'results',
					id: 'usergroup',
					idProperty: 'usergroup',
					fields: ['usergroup','usergroupname']
				})
			},{
				id: 'user-kundeid',
				fieldLabel:'Kunde ID', 
				name:'data[kundeid]',
				value: '',
				hideLabel:true,
				hidden:true
			}]
			,buttons:[{
				id: 'user-form-submit'
				,text: 'Save'
				,handler:function(b,e){
					var f = b.ownerCt.ownerCt.getForm();
					
					f.submit({
						method:'POST'
						,url:'php/userform.php'
						,params: {
							task : 'user-save'
							,user: userdata
						}
						,waitTitle:'Connecting'
						,waitMsg:'Sending data...'
						,success:function(form, action){
							obj = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.show({
								title: 'Database Message'
								,icon:Ext.Msg.INFO
								,buttons:Ext.Msg.OK
								,closable : true
								,msg: 'Customer Data Saved'
								,modal:true
							});
							setTimeout("Ext.Msg.hide()",2000);
						}
						,failure:function(form, action) {
							obj = Ext.util.JSON.decode(action.response.responseText);
							Ext.Msg.show({
								title: 'Database Error'
								,icon:Ext.Msg.ERROR
								,buttons:Ext.Msg.OK
								,closable : false
								,msg: obj.errors.reason
								,modal:true
							});
							setTimeout("Ext.Msg.hide()",2000);
						}
					});
				} // handler:function(b,E)
			}] // buttons:[]
		}, config ));
	}

});

Ext.reg('userform', Ext.ux.UserForm);
