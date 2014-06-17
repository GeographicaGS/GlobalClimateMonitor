var imgPath  = "./icons/";
var imgPath2 = "./images/";
var theArr = [];
var GoogleCount=0;

function initVendor()
{
    var OLLyrs = map.layers;

    for(var i=0;i<OLLyrs.length;i++)
    {
        var OLLyr = OLLyrs[i];
        var OLLyrType = OLLyr.CLASS_NAME.replace(/OpenLayers.Layer./,"");

        if(OLLyrType == "WMS")
            OLLyr["vendor"] = vendorWMS(OLLyr);

        else if(OLLyrType == "WFS")
            OLLyr["vendor"] = vendorWFS(OLLyr);

        else if(OLLyrType == "GML")
            OLLyr["vendor"] = vendorGML(OLLyr);

        else if(OLLyrType == "Google" && GoogleCount++==0)
            OLLyr["vendor"] = vendorGoogle(OLLyr);
        else if(OLLyrType == "Google")
            theArr[theArr.length] = i;

        else if(OLLyrType == "Vector")
            OLLyr["vendor"] = vendorVector(OLLyr);

        else if(OLLyrType == "OpenLayers.Layer")
            OLLyr["vendor"] = vendorLayer(OLLyr);

    }

    for(var i=theArr.length;i>0;i--)
        map.removeLayer(map.layers[theArr[i-1]]);

    refreshOLLayers();
    map.aktLayer=0;
}

function setAktGoogleLyr(i, idx)
{
    var tmp = ["SATELLITE", "NORMAL", "HYBRID", "TERRAIN"];

    if(tmp[idx]=="NORMAL")
    {   var obj = findServer("100000");
        obj.options.type = G_NORMAL_MAP;
        obj.vendor.aktlayers = "NORMAL";
        obj.vendor.lyrVisible = [0,1,0,0];

        addLayer(obj);
        map.removeLayer(map.layers[i]);
        map.setLayerIndex(map.layers[map.layers.length-1],0);
    }
    else if(tmp[idx]=="HYBRID")
    {   var obj = findServer("100000");
        obj.options.type = G_HYBRID_MAP;
        obj.vendor.aktlayers = "HYBRID";
        obj.vendor.lyrVisible = [0,0,1,0];

        addLayer(obj);
        map.removeLayer(map.layers[i]);
        map.setLayerIndex(map.layers[map.layers.length-1],0);

    }
    else if(tmp[idx]=="SATELLITE")
    {   var obj = findServer("100000");
        obj.options.type = G_SATELLITE_MAP;
        obj.vendor.aktlayers = "SATELLITE";
        obj.vendor.lyrVisible = [1,0,0,0];

        addLayer(obj);
        map.removeLayer(map.layers[i]);
        map.setLayerIndex(map.layers[map.layers.length-1],0);

    }
    else if(tmp[idx]=="TERRAIN")
    {   var obj = findServer("100000");
        obj.options.type = G_PHYSICAL_MAP;
        obj.vendor.aktlayers = "TERRAIN";
        obj.vendor.lyrVisible = [0,0,0,1];

        addLayer(obj);
        map.removeLayer(map.layers[i]);
        map.setLayerIndex(map.layers[map.layers.length-1],0);

    }
    try{
        Wunderbar();
    }catch(err){};

}

var counter = 0;
function refreshTiles()
{
    if(map.layers[map.aktLayer].vendor.service=="WMS" || map.layers[map.aktLayer].vendor.service=="MAPSERVER")
        map.layers[map.aktLayer].mergeNewParams({ counter : counter++ });
    else if(map.layers[map.aktLayer].vendor.service=="WFS")
        map.layers[map.aktLayer].refresh();
    else if(map.layers[map.aktLayer].vendor.service=="GOOGLE")
        downandup();

}

function removeAktLayer()
{
    if(map.layers[map.aktLayer].isBaseLayer)
    {   alert("deleting the baselayer is not allowed");
        return;
    }
    var ret = confirm("Layer " + map.layers[map.aktLayer].name + " löschen?");
    if(ret)
        map.removeLayer(map.layers[map.aktLayer]);
    else
        return;
    map.aktLayer=0;
    document.getElementsByName('irbtnAktLyr')[map.aktLayer].checked=true;
    ctrlLyrId.redraw();
}

function downandup()
{
    map.setCenter(map.getCenter(), map.getZoom()-1);
    map.setCenter(map.getCenter(), map.getZoom()+1);
    downandupFlag=true;
}

//Wenn der vorige Layer ein Vektorlayer ist, ev. Selektionen aufgeheben!
function setAktLyr(ctrlLyrId,idx)
{
    map.aktLayer = idx;
    for(var i=0;i<map.controls.length;i++)
        if(map.controls[i].id==ctrlLyrId)
            break;
    map.controls[i].redraw();
}

function addActiveLayerAtEnd()
{
    if(map.layers[map.aktLayer].vendor.service == "GOOGLE")
    {   alert("not allowed");
        return;
    }

    if(map.layers[map.aktLayer].isBaseLayer)
    {   alert("adding baselayer at end is not allowed");
        return;
    }

    var OLLyr = map.layers[map.aktLayer].clone();
    var OLLyrType = OLLyr.CLASS_NAME.replace(/OpenLayers.Layer./,"");

    if(OLLyrType == "WMS")
        OLLyr["vendor"] = vendorWMS(OLLyr);

    else if(OLLyrType == "WFS")
        OLLyr["vendor"] = vendorWFS(OLLyr);

    else if(OLLyrType == "GML")
        OLLyr["vendor"] = vendorGML(OLLyr);

    else if(OLLyrType == "Google" && GoogleCount++==0)
        OLLyr["vendor"] = vendorGoogle(OLLyr);
    else if(OLLyrType == "Google")
        theArr[theArr.length] = i;

    else if(OLLyrType == "Vector")
        OLLyr["vendor"] = vendorVector(OLLyr);

    else if(OLLyrType == "OpenLayers.Layer")
        OLLyr["vendor"] = vendorLayer(OLLyr);

    if(OLLyrType != "Google")
        map.addLayer(OLLyr);

    refreshOLLayers();
    map.aktLayer=0;
    document.getElementsByName('irbtnAktLyr')[map.aktLayer].checked=true;
    ctrlLyrId.redraw();
}

function addWMSAtEnd()
{
    alert("Add function for WMS request");
}

function toggle_Query()
{
    if(map.queryMode == true)
    {   map.queryMode = false;
        document.getElementById("modebutton").src = "etc/icons/information_blue.png"
    }
    else
    {   map.queryMode = true;
        document.getElementById("modebutton").src = "etc/icons/information_red.png";
    }
}

function newOpacityB(flag)
{
    var tmpOpacity = (typeof map.layers[map.aktLayer].opacity != "number") ? 1 : map.layers[map.aktLayer].opacity;
    if(flag==-1)
        var newOpacity = tmpOpacity - 0.1 >= 0 ? tmpOpacity - 0.1 : 0;
    else if(flag==1)
        var newOpacity = tmpOpacity + 0.1 <= 1 ? tmpOpacity + 0.1 : 1;

    map.layers[map.aktLayer].setOpacity(newOpacity);
    map.layers[map.aktLayer].opacity = newOpacity;
}

function moveLayer(moveFlag, idx)
{
    if(map.layers[map.aktLayer].isBaseLayer)
    {   alert("moving baselayer is not allowed");
        return;
    }

    //Achtung : Anpassung bei Verwendung eines BaseLayers!!!
    if(moveFlag==-1 && idx!=map.layers.length-1)
    {   map.setLayerIndex(map.layers[map.aktLayer],idx+1);
        idx = idx+1;
    }
    else if(moveFlag==1 && idx!=0)
    {   map.setLayerIndex(map.layers[map.aktLayer],idx-1);
        idx = idx-1;
    }

    map.aktLayer=idx;
    document.getElementsByName('irbtnAktLyr')[map.aktLayer].checked=true;

}

function setVisi(idx, flag)
{
    //mapObj.OL[idx].Visibility = flag;
    map.layers[idx].setVisibility(flag);
}

function zappa(ctrlLyrId, objID, flag)
{
    document.getElementById(objID).checked=flag;

    var i=parseInt(objID.split("_")[0].substr(2));
    var j=parseInt(objID.split("_")[1].substr(3));

    map.layers[i].vendor.lyrVisible[j] = (flag==false)?0:1;

    for(var ik=0;ik<map.controls.length;ik++)
        if(map.controls[ik].id==ctrlLyrId)
            break;
    map.controls[ik].redraw(i);
}

function onclickQueryCheckbox(obj)
{
    var tmp2 = obj.id.replace(/QOL/g,"").replace(/LYR/g,"").split("_");
    if(obj.checked)
        map.layers[tmp2[0]].vendor.lyrQChecked[tmp2[1]] = 1;
    else
        map.layers[tmp2[0]].vendor.lyrQChecked[tmp2[1]] = 0;

    var aktqlayers = "";

    for(var j=0;j<map.layers[tmp2[0]].vendor.lyrQChecked.length;j++)
    {   if(map.layers[tmp2[0]].vendor.lyrQChecked[j]==1)
            aktqlayers += map.layers[tmp2[0]].vendor.lyrNames[j] + ",";
    }
    aktqlayers  = aktqlayers.replace(/,$/,"");
    map.layers[tmp2[0]].vendor.aktqlayers = aktqlayers;
}


function refreshOLLayers()  //only WMS layers and GOOGLE
{
    aw_GetXLayers();

    for(i=0;i<map.layers.length;i++)
    {
        var tmp  = map.layers[i].vendor.aktlayers;

        var aktlayers = "";

        for(var j=0;j<map.layers[i].vendor.lyrVisible.length;j++)
        {   if(map.layers[i].vendor.lyrVisible[j]==1)
                aktlayers += map.layers[i].vendor.lyrNames[j] + ",";
        }
        aktlayers  = aktlayers.replace(/,$/,"");

        if(tmp != aktlayers)
        {
            map.layers[i].vendor.aktlayers = aktlayers;
            if(map.layers[i].vendor.service=="WMS" || map.layers[i].vendor.service=="MAPSERVER")
                map.layers[i].mergeNewParams({"layers":aktlayers});

            else if(map.layers[i].vendor.service=="WFS")
                map.layers[i].mergeNewParams({"typename":aktlayers});

            else if(map.layers[i].vendor.service=="GOOGLE")
            {
                tmp = aktlayers.split(",");

                if(tmp[0]=="NORMAL")
                {   //var obj = findServer(map.layers[i].vendor.sid);
                    var obj = new OpenLayers.Layer.Google("Streets",  {type: G_NORMAL_MAP,  'maxZoomLevel':22, 'sphericalMercator': true});
                    obj.options.type = G_NORMAL_MAP;
                    obj.vendor = vendorGoogle(map.layers[i]);
                    obj.vendor.aktlayers = "NORMAL";
                    obj.vendor.lyrVisible = [0,1,0,0];

                    map.addLayer(obj);
                    map.removeLayer(map.layers[i]);
                    map.setLayerIndex(map.layers[map.layers.length-1],0);
                }
                else if(tmp[0]=="HYBRID")
                {   //var obj = findServer(map.layers[i].vendor.sid);
                    var obj = new OpenLayers.Layer.Google("Hybrid",  {type: G_HYBRID_MAP,  'maxZoomLevel':22, 'sphericalMercator': true});
                    obj.options.type = G_HYBRID_MAP;
                    obj.vendor = vendorGoogle(map.layers[i]);
                    obj.vendor.aktlayers = "HYBRID";
                    obj.vendor.lyrVisible = [0,0,1,0];

                    map.addLayer(obj);
                    map.removeLayer(map.layers[i]);
                    map.setLayerIndex(map.layers[map.layers.length-1],0);

                }
                else if(tmp[0]=="SATELLITE")
                {   //var obj = findServer(map.layers[i].vendor.sid);
                    var obj = new OpenLayers.Layer.Google("Satellite",  {type: G_SATELLITE_MAP,  'maxZoomLevel':22, 'sphericalMercator': true});
                    obj.options.type = G_SATELLITE_MAP;
                    obj.vendor = vendorGoogle(map.layers[i]);
                    obj.vendor.aktlayers = "SATELLITE";
                    obj.vendor.lyrVisible = [1,0,0,0];

                    map.addLayer(obj);
                    map.removeLayer(map.layers[i]);
                    map.setLayerIndex(map.layers[map.layers.length-1],0);

                }
                else if(tmp[0]=="TERRAIN")
                {   //var obj = findServer(map.layers[i].vendor.sid);
                    var obj = new OpenLayers.Layer.Google("Terrrain",  {type: G_PHYSICAL_MAP,  'maxZoomLevel':22, 'sphericalMercator': true});
                    obj.vendor = vendorGoogle(map.layers[i]);
                    obj.options.type = G_PHYSICAL_MAP;
                    obj.vendor.aktlayers = "TERRAIN";
                    obj.vendor.lyrVisible = [0,0,0,1];

                    map.addLayer(obj);
                    map.removeLayer(map.layers[i]);
                    map.setLayerIndex(map.layers[map.layers.length-1],0);

                }
            }


            //else //Mapserver
            //    map.layers[i].mergeNewParams({"layers":mapObj.OL[i].XLayersString.replace(/,/g,"+")});
        }
    }
}

function aw_GetXLayers()
{
    var dieLayerColl = document.getElementsByName("iNcbox");

    if(dieLayerColl!=null)
    {
        if(typeof dieLayerColl.length == 'number')
        {
            for(var i=0;i<dieLayerColl.length;i++)
            {   var tmp2 = dieLayerColl[i].id.replace(/OL/g,"").replace(/LYR/g,"").split("_");
                if(dieLayerColl[i].checked)
                    map.layers[tmp2[0]].vendor.lyrVisible[tmp2[1]] = 1;
                else
                    map.layers[tmp2[0]].vendor.lyrVisible[tmp2[1]] = 0;
            }
        }
        else if(typeof dieLayerColl.length == 'undefined') //nur 1 Layer !!!
        {   var tmp2 = dieLayerColl.id.replace(/OL/g,"").replace(/LYR/g,"").split("_");
            if(dieLayerColl.checked)
                map.layers[tmp2[0]].vendor.lyrVisible[tmp2[1]] = 1;
            else
                map.layers[tmp2[0]].vendor.lyrVisible[tmp2[1]] = 0;
        }
    }
}

var oldname = "";
var oldObj  = "";

function showHide(obj, name)
{
    var flag = 0;

    if(oldname != "" && oldname != name)
    {
        var a = name.substr(1,1);
        var b = oldname.substr(1,1);

        if( a <= b )
        {   var aha  = document.getElementById(oldname);
            aha.className = "hide";
            for(var i = 0; (aha = aha.parentElement) != null && a < b - i; i++)
                aha.className = "hide";

            flag=1;
        }
        else
        {
            var aha  = document.getElementById(oldname);
            for(var i = 0; (aha = aha.parentElement) != null && flag==0; i++)
            {   //alert(aha.id + " " + oldname);
                if( aha.id == oldname)
                    flag = 1;
            }
        }

        var aha  = document.getElementById(oldname);
        if(flag==0)
        {
            for(var i = 0; (aha = aha.parentElement) != null; i++)
            {   //alert(aha.id + " " + oldname);
                if( aha.className == "show" && aha.id != "sense")
                    aha.className = "hide";
            }
        }
    }
    cont = document.getElementById(name);

    if (cont.className != "show")
    {
        cont.className = "show";
        if (cont.hfs == "true")
        {
            cont.style.borderLeft = "solid 1px silver"
        }
        var imgs = obj.getElementsByTagName("img");
        imgs[0].src = imgPath2 + "foldero.gif";
        if(typeof oldObj == "object")
        {   var imgsa = oldObj.getElementsByTagName("img");
            imgsa[0].src = imgPath2 + "folderc.gif";
        }
    }
    else
    {
        cont.className = "hide";
        var imgs = obj.getElementsByTagName("img");
        imgs[0].src = imgPath2 + "folderc.gif";
    }
    oldname = name;
    oldObj = obj;
}

function vendorWMS(lyr)
{
    var vendor = {};

    vendor["sid"]           = lyr.id;
    vendor["aktlayers"]     = lyr.params["LAYERS"];
    vendor["aktqlayers"]    = "";

    vendor["center"]        = [0,0];
    vendor["service"]       = "WMS";

    var tmpArr = [];

    if(lyr["vendor"] && lyr["vendor"]["lyrNames"])
    {   vendor["lyrNames"]      = lyr["vendor"]["lyrNames"];
        for(var i=0;i<vendor["lyrNames"].length;i++)
        {
            tmpArr[tmpArr.length] = (vendor["aktlayers"].search(vendor["lyrNames"][i])!=-1) ? 1 : 0;
        }
    }
    else
    {   vendor["lyrNames"]      = lyr.params["LAYERS"].split(",");
        for(var i=0;i<vendor["lyrNames"].length;i++)
            tmpArr[tmpArr.length] = 1;//(i==0) ? 1 : 0;
    }
    vendor["lyrVisible"]    = tmpArr;

    var tmpArr2 = [];
    for(var i=0;i<vendor["lyrNames"].length;i++)
        tmpArr2[i] = 0;

    vendor["lyrQueryable"]  = tmpArr2;
    vendor["lyrQChecked"]   = tmpArr2;
    vendor["lyrTitles"]     = vendor["lyrNames"];

    return(vendor);
}

function vendorWFS(lyr)
{
    var vendor = {};

    vendor["sid"]           = lyr.id;
    vendor["aktlayers"]     = lyr.params["typename"].split(",")[0];
    vendor["aktqlayers"]    = "";
    vendor["lyrNames"]      = lyr.params["typename"].split(",");
    vendor["center"]        = [0,0];
    vendor["service"]       = "WFS";

    var tmpArr = [];
    for(var i=0;i<vendor["lyrNames"].length;i++)
        tmpArr[tmpArr.length] = (i==0) ? 1 : 0;

    vendor["lyrVisible"]    = tmpArr;

    for(var i=0;i<vendor["lyrNames"].length;i++)
        tmpArr[i] = 0;

    vendor["lyrQueryable"]  = tmpArr;
    vendor["lyrQChecked"]   = tmpArr;
    vendor["lyrTitles"]     = vendor["lyrNames"];

    return(vendor);
}

function vendorGoogle(lyr)
{
    var vendor = {};

    vendor["sid"]           = lyr.id;
    vendor["aktlayers"]     = "SATELLITE";
    vendor["aktqlayers"]    = "";
    vendor["lyrNames"]      = ["SATELLITE", "NORMAL", "HYBRID", "TERRAIN"];
    vendor["center"]        = [0,0];
    vendor["service"]       = "GOOGLE";
    vendor["lyrVisible"]    = [1, 0, 0, 0];
    vendor["lyrQueryable"]  = [0, 0, 0, 0];
    vendor["lyrQChecked"]   = [0, 0, 0, 0];
    vendor["lyrTitles"]     = ["Satellite", "Streets", "Hybrid", "Terrain"];

    return(vendor);
}

function vendorGML(lyr)
{
    var vendor = {};

    vendor["sid"]           = lyr.id;
    vendor["service"]       = lyr.format.prototype.CLASS_NAME.replace(/OpenLayers.Format./,"");
    vendor["ftype"]         = vendor["service"].toLowerCase();

    vendor["aktlayers"]     = vendor["service"] + " Layer";
    vendor["aktqlayers"]    = "";
    vendor["lyrNames"]      = [vendor["service"] + " Layer"];
    vendor["center"]        = [0,0];
    vendor["lyrVisible"]    = [1];
    vendor["lyrQueryable"]  = [0];
    vendor["lyrQChecked"]   = [0];
    vendor["lyrTitles"]     = [vendor["service"] + " Layer"];

    return(vendor);
}

function vendorLayer(lyr)
{
    var vendor = {};

    vendor["sid"]           = lyr.id;
    vendor["service"]       = "LAYER";

    vendor["aktlayers"]     = "empty Layer";
    vendor["aktqlayers"]    = "";
    vendor["lyrNames"]      = ["empty Layer"];
    vendor["center"]        = [0,0];
    vendor["lyrVisible"]    = [1];
    vendor["lyrQueryable"]  = [0];
    vendor["lyrQChecked"]   = [0];
    vendor["lyrTitles"]     = ["empty Layer"];

    return(vendor);
}

function vendorVector(lyr)
{
    var vendor = {};

    vendor["sid"]           = lyr.id;
    vendor["service"]       = "VECTOR";

    vendor["aktlayers"]     = "Vector Layer";
    vendor["aktqlayers"]    = "";
    vendor["lyrNames"]      = ["Vector Layer"];
    vendor["center"]        = [0,0];
    vendor["lyrVisible"]    = [1];
    vendor["lyrQueryable"]  = [0];
    vendor["lyrQChecked"]   = [0];
    vendor["lyrTitles"]     = ["Vector Layer"];

    return(vendor);
}
