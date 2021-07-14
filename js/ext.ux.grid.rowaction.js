    
Ext.ns('Ext.ux.grid');

Ext.ux.grid.RowAction = function(config) {
	
	Ext.apply(this, config);
	this.addEvents({
		beforeaction: true
		,action: true
	});
	
	Ext.ux.grid.RowAction.superclass.constructor.call(this);
	
}; // EndConfig

Ext.extend(Ext.ux.grid.RowAction, Ext.util.Observable, {
	header: 'Action'
	,dataIndex: ''
	,sortable: false
	,width: 75
	,align: 'center'
	,fixed: false
	,iconCls: ''
	,toolTip: 'Mark Attended'
	// private - plugin initialization
	,init: function(grid) {
		this.grid = grid;
		var view = grid.getView();
		grid.on({
			render: { 
				scope: this, fn: function() {
					view.mainBody.on({
						click: { 
							scope: this,
							fn: this.onclick
						}
					});
				}
			}
		});
		
		if (!this.renderer) {
			this.renderer = function(value, cell, record, row, col, store) {
				cell.css += (cell.css ? ' ' : '') + 'ux-grid3-row-action-cell';
				var retval = '<div class="' + this.getIconCls(record, row, col) + '"';
				retval += this.style ? ' style="' + this.style + '"' : '';
				retval += '> </div>';
				return retval;
			} .createDelegate(this);
		}
	} // eo function init
	// override for custom processing
	,getIconCls: function(record, row, col) {
		returnthis.boundIndex ? record.get(this.boundIndex) : this.iconCls;
	} // eo function getIconCls
	// private - icon click handler
	,onclick: function(e, target) {
		var record, iconCls;
		var row = e.getTarget('.x-grid3-row');
		var col = this.grid.getView().getCellIndex(e.getTarget('.ux-grid3-row-action-cell'));
		
		if (false !== row && false !== col) {
			record = this.grid.store.getAt(row.rowIndex);
			iconCls = this.getIconCls(record, row.rowIndex, col);
			if (Ext.fly(target).hasClass(iconCls)) {
				if (false !== this.fireEvent('beforeaction', this.grid, record, row.rowIndex)) {
					this.fireEvent('action', this.grid, record, row.rowIndex, e);
				}
			}
		}
	} // eo function onClick
});
