/**
 * author : Van de Casteele Arnaud
 * Date : 2009/04/29
 * Purpose : Combobox with WMS data
 * Version : 0.2
 * -> 1/06/2009 : Use of GeoExt.data.WMSCapabilitiesReader
 * Another example : http://dev.geoext.org/trunk/geoext/examples/wms-capabilities.html
 **/

/* 
 * Note :
 * If you want the data are loading after the creation of the 
 * ComboBoxWMS => set autoload = true 
 * and this.mode = local
 */ 
 
Ext.namespace('GeoExt', 'GeoExt.form.ComboBoxWMS');

GeoExt.form.ComboBoxWMS = function(config) {
	Ext.apply(this, config);
    GeoExt.form.ComboBoxWMS.superclass.constructor.call(this);
};

//To display the tool tips
Ext.QuickTips.init();

Ext.extend(GeoExt.form.ComboBoxWMS, Ext.form.ComboBox, {

	/**
     * Property: WMSurl
     * {String} URL of the WMS ressource
     */
	WMSurl : '',	
	
	/**
     * Property: ProxyHost
     * {String} The Proxy to use
     */
	ProxyHost : '',
	
	/**
     * Method: initComponent
     * creates an Ext ComboBox with a WMS GetCapabilities querie
     * 
     * Parameters:
     * Ext (see API) and GeoExt paramaters (WMSurl, optionnal : ProxyHost)
     * 
     * Returns:
     * {Object} Combo box
     */
	initComponent: function(){
		/* [TODO]The string params should not be hard coded
			Maybe if someone know a simple and better way */
		if(this.ProxyHost != ''){
			url = this.ProxyHost+this.WMSurl+"REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.1.1"
		}else{
			url = this.WMSurl+"REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.1.1"
		}
		
		this.store = new Ext.data.Store({ 
			reader : new GeoExt.data.WMSCapabilitiesReader(),
			url : url
			//autoLoad : true
		});
		//this.mode = 'local';	
		this.emptyText = 'Seleccionar capas';
		this.valueField = 'title';
		this.displayField='title';
		this. triggerAction = "all";		
		this.tpl = '<tpl for="."><div ext:qtip="<b>{title}</b> <br /> {abstract}" class="x-combo-list-item">{title}</div></tpl>'
    	GeoExt.form.ComboBoxWMS.superclass.initComponent.call(this);
	}	
});

