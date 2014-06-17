/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.leg2
 * The leg2 control adds leg2 from layers to the map display. 
 * It uses 'leg2' property of each layer.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.leg2 = 
  OpenLayers.Class(OpenLayers.Control, {
    
    /**
     * APIProperty: separator
     * {String} String used to separate layers.
     */
    separator: ", ",
    
    /**
     * APIProperty: template
     * {String} Template for the leg2. This has to include the substring
     *     "${layers}", which will be replaced by the layer specific
     *     leg2s, separated by <separator>. The default is "${layers}".
     */
    template: "${layers}",
    
    /**
     * Constructor: OpenLayers.Control.leg2 
     * 
     * Parameters:
     * options - {Object} Options for control.
     */

    /** 
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {
        this.map.events.un({
            "removelayer": this.updateleg2,
            "addlayer": this.updateleg2,
            "changelayer": this.updateleg2,
            "changebaselayer": this.updateleg2,
            scope: this
        });
        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },    
    
    /**
     * Method: draw
     * Initialize control.
     * 
     * Returns: 
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        
        this.map.events.on({
            'changebaselayer': this.updateleg2,
            'changelayer': this.updateleg2,
            'addlayer': this.updateleg2,
            'removelayer': this.updateleg2,
            scope: this
        });
        this.updateleg2();
        
        return this.div;    
    },

    /**
     * Method: updateleg2
     * Update leg2 string.
     */
    updateleg2: function() {
        var leg2s = [];
        if (this.map && this.map.layers) {
            for(var i=0, len=this.map.layers.length; i<len; i++) {
                var layer = this.map.layers[i];
                if (layer.leg2 && layer.getVisibility()) {
                    // add leg2 only if leg2 text is unique
                    if (OpenLayers.Util.indexOf(
                                    leg2s, layer.leg2) === -1) {
                        leg2s.push( layer.leg2 );
                    }
                }
            } 
            this.div.innerHTML = OpenLayers.String.format(this.template, {
                layers: leg2s.join(this.separator)
            });
        }
    },

    CLASS_NAME: "OpenLayers.Control.leg2"
});
