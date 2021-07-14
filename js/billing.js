Ext.BLANK_IMAGE_URL = '/ext3/resources/images/default/s.gif';
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Ext.onReady(function(){
    Ext.QuickTips.init();
	
	viewport = new Ext.Viewport({
		layout: 'border'
		,items: [
		{
			region: 'north'
			,id: 'north-panel'
			,title: 'Trader Internet Thailand - Hosted services'
//			,height: 32
		},{
			region: 'south'
			,id: 'south-panel'
			,height: 'auto'
		},
		new Ext.tree.TreePanel({
			region: 'west'
			,id: 'navtree'
			,title: 'Site Navigation'
			,split: true
			,collapsible: false
			,width: 200
			,minSize: 150
			,maxSize: 300
			,iconCls: 'nav'
			,singleExpand: true
			,rootVisible: false
			,root: {
				nodeType: 'async'
				,id: 'root'
				,nodeid: 0
				,text: 'Root'
				,expanded: true
			}
			,loader: {
				id: 'menu-loader'
				,url: 'php/menu.php'
				,preloadChildren: false
				,baseParams:{
					 action:'get-nodes'
					,treeTable:'menu'
					,treeID:'billing'
				}
				,success: function(form, action) {
					alert('Success: ' + action.success);
				}
				,failure:function(form, action) {
					alert('Failure: ' + action.failure);
				}
				,listeners: {
					'beforeload': function(treeLoader, node) {
						userdata = Ext.state.Manager.get('userdata');
						
						this.baseParams.category = node.attributes.category;
						this.baseParams.userid = node.attributes.userid;
						if (userdata)
							this.baseParams.activeuser = userdata.validated;
					}
				}
			}
			,listeners: {
				dblclick: function(n, e) {
					userdata = Ext.state.Manager.get('userdata');
					switch (n.attributes.category)
					{
						case 'company-root':
							tp = Ext.getCmp('center-panel')
							tp.add({
								id:'company-grid-tab'
								,title: 'Company List'
								,closable: true
								,items: [ 
									new Ext.ux.CompanyGrid({
										id: 'company-grid-panel'
									})
								]
							});
							tp.activate('company-grid-tab');
							break;
						case 'customer-root':
							break;
						case 'customer-register':
							tp = Ext.getCmp('center-panel')
							tp.add({
								id:'customer-register-add'
								,title: 'New Customer'
								,closable: true
								,items: [ new Ext.ux.CustomerForm ]
								,layout: 'fit'
							});
							tp.activate('customer-register-add');
							break;
						case 'customer-list':
							tp = Ext.getCmp('center-panel')
							tp.add({
								id:'customer-grid-tab'
								,title: 'Customer List'
								,closable: true
								,items: [ 
									new Ext.ux.CustomerGrid({
										id: 'customer-grid-panel'
									})
								]
							});
							tp.activate('customer-grid-tab');
							break;
						case 'user-list':
							tp = Ext.getCmp('center-panel')
							tp.add({
								id:'user-grid-tab'
								,title: 'User List'
								,closable: true
								,items: [ 
									new Ext.ux.UserGrid({
										id: 'user-grid-panel'
									})
								]
							});
							tp.activate('user-grid-tab');
							break;
						case 'user-entry':
							
							break;
						case 'user-register':
							tp = Ext.getCmp('center-panel')
							tp.add({
								id:'user-register-tab'
								,title: 'Register User'
								,closable: true
								,items: [
									new Ext.ux.UserForm({
										id:'user-form-panel'
										,manager: userdata.validated
									})
								]
							});
							tp.activate('user-register-tab');
							break;
					}
				}
			}
			,tools:[{
				 id:'refresh'
				,handler:function(event, toolEl, panel) {
					Ext.getCmp('navtree').getRootNode().reload();
				}
			}]
			,bbar: [{
				id: 'login-btn'
				,xtype: 'button'
				,cls: 'x-btn-text-icon'
//				,cls:'x-toolbar-standardbutton'
				,iconCls: 'door-in'
				,text: 'Login'
				,handler: function() {
					if (this.iconCls == 'door-in')
					{
						loginwin = new Ext.Window({
							id: 'loginwindow'
							,layout: 'fit'
							,width: 410
							,height: 220
							,modal: true
							,plain: true
							,items: new Ext.ux.LoginForm({
								id: 'loginform'
							})
						});
						
						loginwin.show();
					}
					else
					{
						userdata = Ext.state.Manager.get('userdata');
						Ext.Ajax.request({
							url: 'php/login.php'
							,method: 'POST'
							,params: {
								task: 'logout'
								,user: userdata.validated
							}
							,success: function(result, request) {
								resp = Ext.util.JSON.decode(result.responseText);
								Ext.state.Manager.clear('userdata');
								
								btn = Ext.getCmp('login-btn');
								btn.setIconClass('door-in');
								btn.setText('Login');
								
								btn = Ext.getCmp('reg-btn');
						//		btn.enable();
								btn.setIconClass('user-no-user');
								btn.setText('No User');
								btn.setTooltip('');
								Ext.getCmp('navtree').getRootNode().reload();
								
								Ext.Msg.show({
									title: 'Logout'
									,msg: resp.response.text
									,buttons: Ext.Msg.OK
									,icon: Ext.MessageBox.INFO
								});
								setTimeout("Ext.Msg.hide()",2000);
							}
						});
					}
				}
			},'->',{
				id: 'reg-btn'
			//	,disabled: false
				,xtype: 'button'
				,cls: 'x-btn-text-icon'
				,cls: 'x-toolbar-standardbutton'
//				,ui: 'default-toolbar'
				,iconCls: 'user-no-user'
				,text: '[No User]'
			}]
		}),
		new Ext.TabPanel({
			region: 'center'
			,id: 'center-panel'
			,deferredRender: false
			,activeTab: 0
			,items: [{
				id: 'home-tab'
				,title: 'Home Tab'
				,autoScroll: true
			},{
				id: 'another-tab'
				,title: 'Another Tab'
				,autoScroll: true
				,closable: true
			}]
		})
		]
	});
	
	userdata = Ext.state.Manager.get('userdata');
	if (typeof(userdata) != 'undefined')
	{
		if (userdata['validated'])
		{
			btn = Ext.getCmp('login-btn');
			btn.setIconClass('door-out');
			btn.setText('Log Out');
			
			btn = Ext.getCmp('reg-btn');
		//	btn.disable();
			btn.setTooltip(userdata['level']);
			btn.setIconClass( getIcon(userdata['usergroup']));
			btn.setText(userdata['fname'] + ' ' + userdata['lname']);
		}
	}
});
