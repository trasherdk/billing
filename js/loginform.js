//Ext.namespace('Ext.ux');

Ext.ux.LoginForm = Ext.extend( Ext.FormPanel, {
	
	constructor: function(config){
		
		Ext.ux.LoginForm.superclass.constructor.call(this, Ext.apply({
			url:'php/login.php',
			frame:true,
			title:'Please enter credientials', 
			defaultType:'textfield',
			monitorValid:true,
			labelWidth:80,
			items:[{
					id: 'login-user',
					fieldLabel:'Username', 
					name:'loginUsername',
					value: 'mogens',
					allowBlank:false 
				},{
					id: 'login-password',
					fieldLabel:'Password', 
					name:'loginPassword', 
					inputType:'password', 
					allowBlank:false,
					enableKeyEvents: true,
					listeners: {
						'keyup': {
							fn: function(t){
								var v = t.getValue();
								var pw = sha1Hash(v);
								
								var d = Ext.getCmp('passwdhash');
								d.setValue(pw);
							//	Ext.fly(Ext.getCmp('passwdhash')).update(pw);
							},
							scope: this,
							buffer: 1 // buffer to allow the value to update first
						}
						,specialkey: function(field, e) {
							if (e.getKey() == e.ENTER) {
								btn = Ext.getCmp('login-submit-btn');
								btn.handler.call(btn.scope || btn, btn);
							}
						}
					}
				},{
					id: 'passwdhash',
					fieldLabel:'sha-1 hash',
					name: 'passwdhash',
					allowBlank: true,
					hideLabel: false,
					hidden: false,
					width: 285
				}],
			buttons:[{ 
					id: 'login-submit-btn'
					,text:'Login'
					,formBind: false
					// Function that fires when user clicks the button 
					,handler:function(b, e){
						var lu = Ext.getCmp('login-user');
						var lp = Ext.getCmp('login-password');
						var ph = Ext.getCmp('passwdhash');
						
						var username = lu.getValue();
						var userpwd = lp.getValue();
						var pwdhash = ph.getValue();
						
						lu.disable();
						lp.disable();
						ph.disable();
						
						var f = b.ownerCt.ownerCt.getForm();
						f.submit({
							method:'POST',
							params: {
								task : 'login',
								user : username,
							//	passwd : userpwd,
								hash: pwdhash
							},
							waitTitle:'Connecting', 
							waitMsg:'Sending data...',
							success:function(form, action){
								obj = Ext.util.JSON.decode(action.response.responseText);
								//Ext.state.SessionProvider.set('validated',obj.data[0].validated);
								//Ext.Msg.alert('Status', 'Login Successful: ' + obj.data[0].validated, function(btn, text){
								userdata = obj.data;
								Ext.state.Manager.set('userdata', userdata);
								
								btn = Ext.getCmp('login-btn');
								btn.setIconClass('door-out');
								btn.setText('Logout');
								
								btn = Ext.getCmp('reg-btn');
								btn.disable();
								var icon = getIcon(userdata['usergroup']);
								btn.setTooltip(userdata['level']);
								btn.setIconClass(icon);
								btn.setText(userdata['fname'] + ' ' + userdata['lname']);
								btn.enable();
								
								Ext.getCmp('navtree').getRootNode().reload();
								Ext.Msg.alert('Status',	'Login Successful<br />( ' + obj.data.validated + ' )' + obj.data.fname + ' ' + obj.data.lname, function(btn, text){
									if (btn == 'ok'){
										b.ownerCt.ownerCt.ownerCt.close();
									}
								});
								setTimeout("Ext.Msg.hide()",2000);
								b.ownerCt.ownerCt.ownerCt.close();
							},
							failure:function(form, action){ 
								lu.enable();
								lp.enable();
								ph.enable();
								if(action.failureType == 'server'){ 
									obj = Ext.util.JSON.decode(action.response.responseText); 
									Ext.Msg.alert('Login Failed!', obj.errors.reason + '<p />' + obj.errors.sql); 
								}else{ 
									Ext.Msg.alert('Warning!', 'Authentication fail : ' + action.failureType); 
								} 
								btn = Ext.getCmp('login-btn');
								btn.setIconClass('door-in');
								btn.setText('Login');
								
								btn = Ext.getCmp('reg-btn');
								btn.enable();
								btn.setText('No User');
							}
						}); 
					} 
				}],
				hashpassword: function(val,dest)
				{
					var field = Ext.get(dest);
					field.value = sha1Hash(val);
				}
		 
		}, config ));
	}
});

Ext.reg('loginform', Ext.ux.LoginForm);
