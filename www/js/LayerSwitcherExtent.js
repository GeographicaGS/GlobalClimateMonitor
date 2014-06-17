/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.LayerSwitcherExtent
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.LayerSwitcherExtent =
  OpenLayers.Class(OpenLayers.Control, {

    imgPath  : "./etc/icons/",
    imgPath2 : "./etc/images/",

    /**
     * Property: activeColor
     * {String}
     */
    activeColor: '#C8C8FF',

    controlHeight : '240px',

    /**
     * Property: layerStates
     * {Array(Object)} Basically a copy of the "state" of the map's layers
     *     the last time the control was drawn. We have this in order to avoid
     *     unnecessarily redrawing the control.
     */
    layerStates: null,


  // DOM Elements

    /**
     * Property: layersDiv
     * {DOMElement}
     */
    layersDiv: null,

    /**
     * Property: minimizeDiv
     * {DOMElement}
     */
    minimizeDiv: null,

    /**
     * Property: maximizeDiv
     * {DOMElement}
     */
    maximizeDiv: null,

    /**
     * Constructor: OpenLayers.Control.LayerSwitcher
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.layerStates = [];
        initVendor();
    },

    /**
     * APIMethod: destroy
     */
    destroy: function() {

        OpenLayers.Event.stopObservingElement(this.div);

        OpenLayers.Event.stopObservingElement(this.minimizeDiv);
        OpenLayers.Event.stopObservingElement(this.maximizeDiv);

        this.map.events.un({
            "addlayer": this.redraw,
            "changelayer": this.redraw,
            "removelayer": this.redraw,
            "changebaselayer": this.redraw,
            scope: this
        });

        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /**
     * Method: setMap
     *
     * Properties:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            "addlayer": this.redraw,
            "changelayer": this.redraw,
            "removelayer": this.redraw,
            "changebaselayer": this.redraw,
            scope: this
        });
    },

    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the
     *     switcher tabs.
     */
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this);

        // create layout divs
        this.loadContents();

        // set mode to minimize
        if(!this.outsideViewport) {
            this.minimizeControl();
        }

        // populate div with current info
        this.redraw();

        return this.div;
    },

    /**
     * Method: clearLayersArray
     * User specifies either "base" or "data". we then clear all the
     *     corresponding listeners, the div, and reinitialize a new array.
     *
     * Parameters:
     * layersType - {String}
     */
    clearLayersArray: function(layersType) {
        var layers = this[layersType + "Layers"];
        if (layers) {
            for(var i=0; i < layers.length; i++) {
                var layer = layers[i];
                OpenLayers.Event.stopObservingElement(layer.inputElem);
                OpenLayers.Event.stopObservingElement(layer.labelSpan);
            }
        }
        this[layersType + "LayersDiv"].innerHTML = "";
        this[layersType + "Layers"] = [];
    },


    /**
     * Method: checkRedraw
     * Checks if the layer state has changed since the last redraw() call.
     *
     * Returns:
     * {Boolean} The layer state changed since the last redraw() call.
     */
    checkRedraw: function() {
        var redraw = false;
        if ( !this.layerStates.length ||
             (this.map.layers.length != this.layerStates.length) ) {
            redraw = true;
        } else {
            for (var i=0; i < this.layerStates.length; i++) {
                var layerState = this.layerStates[i];
                var layer = this.map.layers[i];
                if ( (layerState.name != layer.name) ||
                     (layerState.inRange != layer.inRange) ||
                     (layerState.id != layer.id) ||
                     (layerState.visibility != layer.visibility) ) {
                    redraw = true;
                    break;
                }
            }
        }
        return redraw;
    },

    /**
     * Method: redraw
     * Goes through and takes the current state of the Map and rebuilds the
     *     control to display that state. Groups base layers into a
     *     radio-button group and lists each data layer with a checkbox.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    redraw: function(iShow) {
        //if the state hasn't changed since last redraw, no need
        // to do anything. Just return the existing div.
        //if (!this.checkRedraw()) {
        //    return this.div;
        //}

        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        this.layerStates = new Array(this.map.layers.length);
        for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name,
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }
        oldname ="";
        var theHTML = "";

        var arrButtons = [];
        arrButtons[arrButtons.length] = ["Neuzeichnen", "arrow_refresh.png",       "refreshTiles()",              "refresh active layer"];
        arrButtons[arrButtons.length] = ["Opacity-",    "contrast_low.png",        "newOpacityB(-1);",            "Opacity verringern"];
        arrButtons[arrButtons.length] = ["Opacity+",    "contrast_high.png",       "newOpacityB(1);",             "Opacity erh&ouml;hen"];
        arrButtons[arrButtons.length] = ["LayerUp",     "dark_arrow1_n.gif",       "moveLayer( 1, map.aktLayer)", "active layer one up"];
        arrButtons[arrButtons.length] = ["LayerDown",   "dark_arrow1_s.gif",       "moveLayer(-1, map.aktLayer)", "active layer one down"];
        arrButtons[arrButtons.length] = ["AddActLayer", "world_add.png",           "addActiveLayerAtEnd();",      "add active layer"];
        arrButtons[arrButtons.length] = ["AddWMSLayer", "world_link.png",          "addWMSAtEnd();",              "add wms layer"];
        arrButtons[arrButtons.length] = ["RemoveLayer", "world_delete.png",        "removeAktLayer()",            "remove active layer"];

        theHTML += '<div id="mybuttons" style="background-color:#BBBBBB;border-bottom:0px solid gray;padding: 3px; position: relative; top: 0px; left: 0px; width: 100%;">\r\n';
        theHTML += '<TABLE><TR>\r\n';
        for(var i=0;i<arrButtons.length;i++)
        {   var item = arrButtons[i];
            theHTML += '<td><img id="' + item[0] + '"  class="ico" src="' + this.imgPath + item[1]   + '" width="16" onclick="' + item[2] + '" title="' + item[3] + '"></td>';
        }
        theHTML += '</TR></TABLE>\r\n';
        theHTML += '</DIV>\r\n';

        theHTML += '<TABLE bgcolor="' + this.activeColor + '" BORDER="0" CELLSPACING="0" CELLPADDING="0" style="padding-top:0px" width="100%">\r\n';
        theHTML += '<TR>\r\n';
        theHTML += '<TD>\r\n';
        theHTML += '<text>\r\n';
        theHTML += '<div class="show" id="sense" style="height:' + this.controlHeight + '">\r\n';
        theHTML += '<div class="WMSTitle" style="font-size:12;margin-left:7px;margin-bottom:5px;">&#160;</div>\r\n';

        for(var i=0;i<map.layers.length;i++)
        {
            var theUnique = "c0_" + Math.random().toString().substr(0,10);
            var isVisible = map.layers[i].getVisibility();

            theHTML += '<div class="fnameH">\r\n';
            theHTML += '\r\n';

            if(map.aktLayer == i)
                theHTML += '<input type=radio name="irbtnAktLyr" value="' + i + '" onclick="setAktLyr(\'' + this.id + '\',' + i + ');" checked>';
            else
                theHTML += '<input type=radio name="irbtnAktLyr" value="' + i + '" onclick="setAktLyr(\'' + this.id + '\',' + i + ');">';

            if(isVisible)
                theHTML += '<input type="checkbox" name="iOLVisi" onclick="setVisi(' + i + ', this.checked);" checked/><span onclick="showHide(this, &#039;' + theUnique + '&#039;);" xmlns=""><img src="' + this.imgPath2 + 'folderc.gif">\r\n';
            else
                theHTML += '<input type="checkbox" name="iOLVisi" onclick="setVisi(' + i + ', this.checked);" /><span onclick="showHide(this, &#039;' + theUnique + '&#039;);" xmlns=""><img src="' + this.imgPath2 + 'folderc.gif">\r\n';

            theHTML += '</img>\r\n';
            theHTML += '<span class="ty">' + map.layers[i].name + '</span>\r\n';
            theHTML += '</span></div>\r\n';
            if(iShow && iShow==i)
                theHTML += '<div class="show" id="' + theUnique + '" hfs="true">\r\n';
            else
                theHTML += '<div class="hide" id="' + theUnique + '" hfs="true">\r\n';


            if(map.layers[i]["vendor"])
            {
                for(j=0;j<map.layers[i]["vendor"].lyrNames.length;j++)
                {
                    var LayerChecked  = map.layers[i]["vendor"].lyrVisible[j]  == 0 ? "" : "checked";
                    var QLayerChecked = map.layers[i]["vendor"].lyrQChecked[j] == 0 ? "" : "checked";

                    theHTML += '<div class="fname">\r\n';
                    theHTML += '\r\n';

ON = "onclick='zappa(\"" + this.id + "\",\"OL" + i + "_LYR"  + j + "\", this.checked);'";

                    //theHTML += '<span style="margin-left:36px;"><input type="checkbox" ' + ON + ' name="iNcbox"  id="OL' + i + '_LYR'  + j + '" ' + LayerChecked + ' /></span>';

                    if(map.layers[i]["vendor"].service=="GOOGLE")
                        theHTML += '<span style="margin-left:36px;"><input type="radio" name="iNcradioA"  id="OL' + i + '_LYR'  + j + '" onclick="setAktGoogleLyr(' + i + ', ' + j +');" ' + LayerChecked + '/></span>';
                    else
                        theHTML += '<span style="margin-left:36px;"><input type="checkbox" ' + ON + ' name="iNcbox"  id="OL' + i + '_LYR'  + j + '" ' + LayerChecked + '/></span>';


                    if(map.layers[i]["vendor"].lyrQueryable[j]==1)
                        theHTML += '<input type="checkbox" name="iNcboxQ" id="QOL' + i + '_LYR' + j + '" ' + QLayerChecked + ' onclick="onclickQueryCheckbox(this);"/><span style="font-size:10">' + map.layers[i]["vendor"].lyrTitles[j].replace(/%2E%/g,",") + '</span>\r\n';
                    else
                        theHTML += '<span style="margin-left:20px;font-size:10px">' + map.layers[i]["vendor"].lyrTitles[j].replace(/%2E%/g,",") + '</span>\r\n';
                    theHTML += '</div>\r\n';
                }
            }
            theHTML += '</div>\r\n';

        }
        theHTML += '</div>\r\n';
        theHTML += '</div>\r\n';
        theHTML += '</text>\r\n';
        theHTML += '</TD>\r\n';
        theHTML += '</TR>\r\n';
        theHTML += '</TABLE>\r\n';

        theHTML += '<div style="background-color:' + this.activeColor + '">\r\n';
        theHTML += '<input type="button"  style="font-size:11;margin:14;;" onclick="refreshOLLayers()" value="Refresh">\r\n';
        theHTML += '</div>\r\n';

        this.layersDiv.innerHTML = theHTML;

        //return this.div;
    },

    /**
     * Method:
     * A label has been clicked, check or uncheck its corresponding input
     *
     * Parameters:
     * e - {Event}
     *
     * Context:
     *  - {DOMElement} inputElem
     *  - {<OpenLayers.Control.LayerSwitcher>} layerSwitcher
     *  - {<OpenLayers.Layer>} layer
     */

    onInputClick: function(e) {

        if (!this.inputElem.disabled) {
            if (this.inputElem.type == "radio") {
                this.inputElem.checked = true;
                this.layer.map.setBaseLayer(this.layer);
            } else {
                this.inputElem.checked = !this.inputElem.checked;
                this.layerSwitcher.updateMap();
            }
        }
        OpenLayers.Event.stop(e);
    },

    /**
     * Method: onLayerClick
     * Need to update the map accordingly whenever user clicks in either of
     *     the layers.
     *
     * Parameters:
     * e - {Event}
     */
    onLayerClick: function(e) {
        this.updateMap();
    },


    /**
     * Method: updateMap
     * Cycles through the loaded data and base layer input arrays and makes
     *     the necessary calls to the Map object such that that the map's
     *     visual state corresponds to what the user has selected in
     *     the control.
     */
    updateMap: function() {

        // set the newly selected base layer
        for(var i=0; i < this.baseLayers.length; i++) {
            var layerEntry = this.baseLayers[i];
            if (layerEntry.inputElem.checked) {
                this.map.setBaseLayer(layerEntry.layer, false);
            }
        }

        // set the correct visibilities for the overlays
        for(var i=0; i < this.dataLayers.length; i++) {
            var layerEntry = this.dataLayers[i];
            layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
        }

    },

    /**
     * Method: maximizeControl
     * Set up the labels and divs for the control
     *
     * Parameters:
     * e - {Event}
     */
    maximizeControl: function(e) {

        //HACK HACK HACK - find a way to auto-size this layerswitcher
        this.div.style.width = "21em";
        this.div.style.height = "";

        this.showControls(false);

        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: minimizeControl
     * Hide all the contents of the control, shrink the size,
     *     add the maximize icon
     *
     * Parameters:
     * e - {Event}
     */
    minimizeControl: function(e) {

        this.div.style.width = "0px";
        this.div.style.height = "0px";

        this.showControls(true);

        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: showControls
     * Hide/Show all LayerSwitcher controls depending on whether we are
     *     minimized or not
     *
     * Parameters:
     * minimize - {Boolean}
     */
    showControls: function(minimize) {

        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";

        this.layersDiv.style.display = minimize ? "none" : "";
    },

    /**
     * Method: loadContents
     * Set up the labels and divs for the control
     */
    loadContents: function() {

        //configure main div
        this.div.style.position = "absolute";
        this.div.style.top = "25px";
        this.div.style.right = "0px";
        this.div.style.left = "";
        this.div.style.fontFamily = "sans-serif";
        this.div.style.fontWeight = "bold";
        this.div.style.marginTop = "3px";
        this.div.style.marginLeft = "3px";
        this.div.style.marginBottom = "3px";
        this.div.style.fontSize = "smaller";
        this.div.style.color = "white";
        this.div.style.backgroundColor = "transparent";

        OpenLayers.Event.observe(this.div, "mouseup", OpenLayers.Function.bindAsEventListener(this.mouseUp, this));
        OpenLayers.Event.observe(this.div, "click", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "mousedown", OpenLayers.Function.bindAsEventListener(this.mouseDown, this));
        OpenLayers.Event.observe(this.div, "dblclick", this.ignoreEvent);

//###################################################################################

        var theHTML = "";

        var arrButtons = [];
        arrButtons[arrButtons.length] = ["Neuzeichnen", "arrow_refresh.png",       "refreshTiles()",              "refresh active layer"];
        arrButtons[arrButtons.length] = ["Opacity-",    "contrast_low.png",       "newOpacityB(-1);",            "Opacity verringern"];
        arrButtons[arrButtons.length] = ["Opacity+",    "contrast_high.png",        "newOpacityB(1);",             "Opacity erh&ouml;hen"];
        arrButtons[arrButtons.length] = ["debugWin",    "table_refresh.png",       "PopupWindow(200, 600, 600, 200, 'http://localhost/g-info/apps/OL26Client/PopupWindows/OLC_debug.html')",                 "debugWin"];
        arrButtons[arrButtons.length] = ["LayerUp",     "dark_arrow1_n.gif",       "moveLayer( 1, map.aktLayer)", "active layer one up"];
        arrButtons[arrButtons.length] = ["LayerDown",   "dark_arrow1_s.gif",       "moveLayer(-1, map.aktLayer)", "active layer one down"];
        arrButtons[arrButtons.length] = ["AddActLayer", "world_add.png",           "addActiveLayerAtEnd();",      "add active layer"];
        arrButtons[arrButtons.length] = ["AddWMSLayer", "world_link.png",          "addWMSAtEnd();",              "add wms layer"];
        arrButtons[arrButtons.length] = ["RemoveLayer", "world_delete.png",        "removeAktLayer()",            "remove active layer"];

        theHTML += '<div id="mybuttons" style="background-color:#BBBBBB;border-bottom:0px solid gray;padding: 3px; position: relative; top: 0px; left: 0px; width: 100%;">\r\n';
        theHTML += '<TABLE><TR>\r\n';
        for(var i=0;i<arrButtons.length;i++)
        {   var item = arrButtons[i];
            theHTML += '<td><img id="' + item[0] + '"  class="ico" src="' + this.imgPath + item[1]   + '" width="16" onclick="' + item[2] + '" title="' + item[3] + '"></td>';
        }
        theHTML += '</TR></TABLE>\r\n';
        theHTML += '</DIV>\r\n';

        theHTML += '<TABLE bgcolor="' + this.activeColor + '" BORDER="0" CELLSPACING="0" CELLPADDING="0" style="padding-top:0px" width="100%">\r\n';
        theHTML += '<TR>\r\n';
        theHTML += '<TD>\r\n';
        theHTML += '<text>\r\n';
        theHTML += '<div class="show" id="sense" style="height:' + this.controlHeight + '">\r\n';
        theHTML += '<div class="WMSTitle" style="font-size:12;margin-left:7px;margin-bottom:5px;">&#160;</div>\r\n';

        for(var i=0;i<map.layers.length;i++)
        {
            var theUnique = "c0_" + Math.random().toString().substr(0,10);
            var isVisible = map.layers[i].getVisibility();

            theHTML += '<div class="fnameH">\r\n';
            theHTML += '\r\n';

            if(map.aktLayer == i)
                theHTML += '<input type=radio name="irbtnAktLyr" value="' + i + '" onclick="setAktLyr(' + i + ');" checked>';
            else
                theHTML += '<input type=radio name="irbtnAktLyr" value="' + i + '" onclick="setAktLyr(' + i + ');">';

            if(isVisible)
                theHTML += '<input type="checkbox" name="iOLVisi" onclick="setVisi(' + i + ', this.checked);" checked/><span onclick="showHide(this, &#039;' + theUnique + '&#039;);" xmlns=""><img src="' + this.imgPath2 + 'folderc.gif">\r\n';
            else
                theHTML += '<input type="checkbox" name="iOLVisi" onclick="setVisi(' + i + ', this.checked);" /><span onclick="showHide(this, &#039;' + theUnique + '&#039;);" xmlns=""><img src="' + this.imgPath2 + 'folderc.gif">\r\n';

            theHTML += '</img>\r\n';
            theHTML += '<span class="ty">' + map.layers[i].name + '</span>\r\n';
            theHTML += '</span></div>\r\n';
            theHTML += '<div class="hide" id="' + theUnique + '" hfs="true">\r\n';


            if(map.layers[i]["vendor"])
            {
                for(j=0;j<map.layers[i]["vendor"].lyrNames.length;j++)
                {
                    var LayerChecked  = map.layers[i]["vendor"].lyrVisible[j]  == 0 ? "" : "checked";
                    var QLayerChecked = map.layers[i]["vendor"].lyrQChecked[j] == 0 ? "" : "checked";

                    theHTML += '<div class="fname">\r\n';
                    theHTML += '\r\n';
                    theHTML += '<span style="margin-left:36px;"><input type="checkbox" onclick="alert(0)" name="iNcbox"  id="OL' + i + '_LYR'  + j + '" ' + LayerChecked + '/></span>';
                    if(map.layers[i]["vendor"].lyrQueryable[j]==1)
                        theHTML += '<input type="checkbox" name="iNcboxQ" id="QOL' + i + '_LYR' + j + '" ' + QLayerChecked + ' onclick="onclickQueryCheckbox(this);"/><span style="font-size:10">' + map.layers[i]["vendor"].lyrTitles[j].replace(/%2E%/g,",") + '</span>\r\n';
                    else
                        theHTML += '<span style="margin-left:20px;font-size:10px">' + map.layers[i]["vendor"].lyrTitles[j].replace(/%2E%/g,",") + '</span>\r\n';
                    theHTML += '</div>\r\n';
                }
            }
            theHTML += '</div>\r\n';

        }
        theHTML += '</div>\r\n';
        theHTML += '</div>\r\n';
        theHTML += '</text>\r\n';
        theHTML += '</TD>\r\n';
        theHTML += '</TR>\r\n';
        theHTML += '</TABLE>\r\n';

        theHTML += '<div style="background-color:' + this.activeColor + '">\r\n';
        theHTML += '<input type="button"  style="font-size:11;margin:14;;" onclick="refreshOLLayers()" value="Refresh">\r\n';
        theHTML += '</div>\r\n';

        this.layersDiv = document.createElement("div");
        this.layersDiv.innerHTML = theHTML;
        this.div.appendChild(this.layersDiv);

        //document.getElementsByName("irbtnAktLyr")[map.aktLayer].checked=true;

//###################################################################################


        var imgLocation = OpenLayers.Util.getImagesLocation();
        var sz = new OpenLayers.Size(18,18);

        // maximize button div
        var img = imgLocation + 'layer-switcher-maximize.png';
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MaximizeDiv",
                                    null,
                                    sz,
                                    img,
                                    "absolute");
        this.maximizeDiv.style.top = "10px";
        this.maximizeDiv.style.right = "0px";
        this.maximizeDiv.style.left = "";
        this.maximizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.maximizeDiv, "click",
            OpenLayers.Function.bindAsEventListener(this.maximizeControl, this)
        );

        this.div.appendChild(this.maximizeDiv);

        // minimize button div
        var img = imgLocation + 'layer-switcher-minimize.png';
        var sz = new OpenLayers.Size(18,18);
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                                    "OpenLayers_Control_MinimizeDiv",
                                    null,
                                    sz,
                                    img,
                                    "absolute");
        this.minimizeDiv.style.top = "10px";
        this.minimizeDiv.style.right = "0px";
        this.minimizeDiv.style.left = "";
        this.minimizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.minimizeDiv, "click",
            OpenLayers.Function.bindAsEventListener(this.minimizeControl, this)
        );

        this.div.appendChild(this.minimizeDiv);
    },

    /**
     * Method: ignoreEvent
     *
     * Parameters:
     * evt - {Event}
     */
    ignoreEvent: function(evt) {
        OpenLayers.Event.stop(evt);
    },

    /**
     * Method: mouseDown
     * Register a local 'mouseDown' flag so that we'll know whether or not
     *     to ignore a mouseUp event
     *
     * Parameters:
     * evt - {Event}
     */
    mouseDown: function(evt) {
        this.isMouseDown = true;
        this.ignoreEvent(evt);
    },

    /**
     * Method: mouseUp
     * If the 'isMouseDown' flag has been set, that means that the drag was
     *     started from within the LayerSwitcher control, and thus we can
     *     ignore the mouseup. Otherwise, let the Event continue.
     *
     * Parameters:
     * evt - {Event}
     */
    mouseUp: function(evt) {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            this.ignoreEvent(evt);
        }
    },

    CLASS_NAME: "OpenLayers.Control.LayerSwitcherExtent"
});
