Ext.ux.CustomerForm = Ext.extend( Ext.FormPanel, {
	
	constructor: function(config){
		
		Ext.ux.CustomerForm.superclass.constructor.call(this, Ext.apply({
			url:'php/customerform.php'
			,frame:true
			,title:'Please enter Customer Data'
			,defaultType:'textfield'
			,buttonAlign: 'left'
			,monitorValid:true
			,labelWidth:80
			,defaults: {
				width: 200
			}
			,items:[{
				id:'customer-id'
				,xtype:'numberfield'
				,name:'data[kundeid]'
				,hidden:true
				,readOnly:true
				,allowBlank:true
			},{
				id:'customer-fname'
				,fieldLabel:'Fornavn'
				,name:'data[fornavn]'
				,allowBlank:false
				,autoCreate : {
					tag: 'input'
					,type: 'text'
					,maxlength: '50'
					,autocomplete: 'off'
				}
//				,value: 'Mogens'
			},{
				id:'customer-lname'
				,fieldLabel:'Efternavn'
				,name:'data[efternavn]'
				,allowBlank:false
				,autoCreate : {
					tag: 'input'
					,type: 'text'
					,maxlength: '50'
					,autocomplete: 'off'
				}
//				,value: 'Melander'
			},{
				id:'customer-addr'
				,fieldLabel:'Adresse'
				,name:'data[adresse]'
				,allowBlank:false
//				,value: '499/21 Kophai, Soi 9'
			},{
				id: 'customer-pnr'
				,fieldLabel: 'Postnummer'
				,hiddenId: 'customer-pnr-hidden'
				,hiddenName: 'data[postnr]'
				,xtype: 'combo'
				,typeAhead: true
				,minChars: 1
				,emptyText: 'Select a City...'
				,loadingText: 'Loading...'
				,triggerAction: 'all'
				,lazyRender: true
				,mode: 'remote'
				,allowBlank: false
				,valueField: 'postnr' 
				,displayField: 'bynavn'
				,store: new Ext.data.JsonStore({
					autoDestroy: true
					,autoLoad: false
					,url: 'php/customerform.php'
					,baseParams: {
						task: 'get-postnr'
						,debug: 0
					}
					,root: 'rows'
					,totalProperty: 'results'
					,id: 'postnr'
					,idProperty: 'postnr'
					,fields: ['postnr','bynavn']
				})
			},{
				id: 'customer-telefon'
				,fieldLabel: 'Telefon'
				,name: 'data[telefon]'
				,allowBlank: true
				,value: ''
			},{
				id: 'customer-mobile'
				,fieldLabel: 'Mobil'
				,name: 'data[mobil]'
				,allowBlank: true
//				,value: '+66 8701 33224'
			},{
				id: 'customer-email'
				,fieldLabel: 'E-Mail'
				,name: 'data[email]'
				,allowBlank: true
//				,value: 'mogens@fumlersoft.dk'
			},{
				id: 'customer-notes'
				,fieldLabel: 'Notes'
				,name: 'data[bestilling]'
				,xtype: 'textarea'
				,width: 300
				,height: 200
				,allowBlank: true
				,value: ''
			}]
			,buttons:[{
				id:'submit-btn'
				,text:'Save'
				,handler:function(b,e) {
					var f = b.ownerCt.ownerCt.getForm();
						f.submit({
							method:'POST'
							,params: {
								task : 'customer-save'
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
				} // handler:function()
			}] // buttons:[]
		}, config ));
	}

});

Ext.reg('customerform', Ext.ux.CustomerForm);
