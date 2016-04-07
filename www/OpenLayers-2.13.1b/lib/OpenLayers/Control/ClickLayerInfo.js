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
        var lonLat = map.getLonLatFromViewPortPx(e.xy);
     
        // you cant transform you lat and lon
        // you can def a pixel buffer with the map resolution
        // you can do a asyn call
    },
	 CLASS_NAME: "OpenLayers.Control.ClickLayerInfo"
});
