/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.ClickLayerInfo
 * The ClickLayerInfo control 
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
 
OpenLayers.Control.ClickLayerInfo = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0, //tolarance
        'stopSingle': false,
        'stopDouble': false
    },
    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );
    },
    trigger: function(e) {
	//toma coordenadas en Web Mercator y las transforma en wgs84
	var lonLat = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
	
	var latitud = lonLat.lat;
		var longitud = lonLat.lon;
         // you can do a asyn call
/*		$.get("http://www.cru.uea.ac.uk/cru/data/hrg/cru_ts_3.22/ge/grid05/cells/N37.5W7.5/pre/N37.25W6.25.pre.lg.png", function (html) {
        $.fancybox({
            'content': html, 
            'height' : 700,
            'autoDimensions':false,
            'autoSize':false
        })
		});*/
		window.open('http://www.cru.uea.ac.uk/cru/data/hrg/cru_ts_3.22/ge/grid05/cells/N37.5W7.5/pre/N37.25W6.25.pre.lg.png');
    },
	 CLASS_NAME: "OpenLayers.Control.ClickLayerInfo"
});
