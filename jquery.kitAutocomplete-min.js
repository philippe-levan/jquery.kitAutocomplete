/*
 * Open source under the BSD License
 * Copyright (c) 2011, Philippe Le Van, Kitpages, http://www.kitpages.fr
 */
(function(d){var c={delay:300,item:null,field:"value",cssField:"className",search:null,open:null,focus:null,select:null,close:null,change:null};var a=(function(){function e(f,g){this._settings=g;this._boundingBox=f;this._input=this._boundingBox.find("input");this._ul=this._boundingBox.find("ul");this._ul.kitAutocompleteTobody();this._boundingBox.data("kitAutocomplete",this);this._input.data("kitAutocomplete",this);this.init()}e.prototype={init:function(){var f=this;f._lastSearch="";f._item=this._settings.item;if(f._item){f._lastSearch=f._item[f._settings.field]}f._itemList=[];f._isMenuOpen=false;f._render();var h=["search","open","render","focus","select","unselect","close","change"];for(var g=0;g<h.length;g++){if(this._settings[h[g]]){this._boundingBox.bind(h[g]+"_kitAutocomplete",this._settings[h[g]])}}for(var g=0;g<h.length;g++){var j="_"+h[g]+"Callback";this._boundingBox.bind(h[g]+"_kitAutocomplete",this[j])}this._input.bind("keydown.autocomplete",this.keydownCallback);this._input.bind("blur.autocomplete",this.blurCallback)},keydownCallback:function(g){var f=d(this).data("kitAutocomplete");if(f._input.attr("readonly")){return}if(g.keyCode=="27"){f.close();return}clearTimeout(f.searching);f.searching=setTimeout(function(){if(!f._input.val()){f._item=null}if((f._input.val())&&(f._lastSearch!=f._input.val())){f.search(g)}},f._settings.delay)},blurCallback:function(g){var f=d(this).data("kitAutocomplete");clearTimeout(f.searching);f.closing=setTimeout(function(){f.close()},300)},remoteCallback:function(g){var f=this;f._itemList=g;f.open()},_menuClickCallback:function(j,h){var g=this;var f=d(h);var i=f.data("kitAutocomplete");g._boundingBox.trigger("select_kitAutocomplete",[{item:i}])},_searchCallback:function(g,h){if(g.isDefaultPrevented()){return}var f=d(this).data("kitAutocomplete");f._item=null;f._lastSearch=f._input.val();d.ajax({url:f._settings.source,type:"POST",data:{term:f._lastSearch,field:f._settings.field},dataType:"json",success:d.proxy(f.remoteCallback,f)})
},_openCallback:function(g,h){if(g.isDefaultPrevented()){return}var f=d(this).data("kitAutocomplete");f._isMenuOpen=true;f.render()},_renderCallback:function(k,h,j,g,f){if(k.isDefaultPrevented()){return}var i=d(this).data("kitAutocomplete");i._render()},_focusCallback:function(f,g){if(f.isDefaultPrevented()){return}},_selectCallback:function(g,h){if(g.isDefaultPrevented()){return}var f=d(this).data("kitAutocomplete");f._item=h.item;f._lastSearch=f._item[f._settings.field];f._itemList=[];f.close()},_unselectCallback:function(g){if(g.isDefaultPrevented()){return}var f=d(this).data("kitAutocomplete");f._item=null},_closeCallback:function(g){if(g.isDefaultPrevented()){return}var f=d(this).data("kitAutocomplete");f._isMenuOpen=false;clearTimeout(f.searching);if(f._item==null){f.unselect()}f.render()},_changeCallback:function(f,g){if(f.isDefaultPrevented()){return}},search:function(g){var f=this;f._boundingBox.trigger("search_kitAutocomplete",[{searchValue:f._lastSearch}])},_render:function(){var f=this;f._renderMenu();f._input.val(f._lastSearch)},_renderMenu:function(){var h=this;h._ul.empty();if(h._isMenuOpen&&(h._itemList.length>0)){h._ul.hide();for(var j=0;j<h._itemList.length;j++){var k=h._itemList[j];var g=d("<a></a>");g.append(k[h._settings.field]);g.click(function(i){h._menuClickCallback(i,this)});g.data("kitAutocomplete",k);var f=d("<li></li>");if(k.className){f.addClass(k.className)}f.append(g);h._ul.append(f)}h._ul.addClass("shift-autocomplete-ul");h._ul.show();h._ul.kitAutocompleteTobody("toBody")}else{h._ul.kitAutocompleteTobody("fromBody");h._ul.hide()}},close:function(){var f=this;f._boundingBox.trigger("close_kitAutocomplete")},render:function(){var f=this;f._boundingBox.trigger("render_kitAutocomplete",[f._itemList,f._item,f._lastSearch,f._isMenuOpen])},unselect:function(){var f=this;f._boundingBox.trigger("unselect_kitAutocomplete")},open:function(){var f=this;f._boundingBox.trigger("open_kitAutocomplete",[{itemList:f._itemList}])}};return e})();var b={init:function(f){var e=d(this);
if(f){d.extend(c,f)}return this.each(function(){var g=new a(d(this),c)})},close:function(){return this.each(function(){var e=d(this).data("kitAutocomplete");e.close()})},open:function(){return this.each(function(){var e=d(this).data("kitAutocomplete");e.open()})},render:function(){return this.each(function(){var e=d(this).data("kitAutocomplete");e.render()})},search:function(){return this.each(function(){var e=d(this).data("kitAutocomplete");e.search()})},unselect:function(){return this.each(function(){var e=d(this).data("kitAutocomplete");e.unselect()})},destroy:function(){}};d.fn.kitAutocomplete=function(e){if(b[e]){return b[e].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof e==="object"||!e){return b.init.apply(this,arguments)}else{d.error("Method "+e+" does not exist on jQuery.kitAutocomplete")}}}})(jQuery);(function(c){var b={};var a={init:function(d){b=c.extend(b,d);var e=c(this);e.data("kitAutocompleteTobody","standard")},toBody:function(){var e=c(this);if(e.data("kitAutocompleteTobody")!=="standard"){return}var d=e.position();var h=e.offset();var f=e.parent();e.data("kitAutocompleteTobody",{top:d.top,left:d.left,parent:f,position:e.css("position"),zindex:e.css("z-index")});var g=e.data("kitAutocompleteTobody");e.appendTo("body").addClass("shift-autocomplete-ul").css({position:"absolute","z-index":400000,top:h.top,left:h.left})},fromBody:function(){var d=c(this);var e=d.data("kitAutocompleteTobody");if(e==="standard"){return}d.appendTo(e.parent).css({position:e.position,"z-index":e.zindex,top:e.top,left:e.left});d.data("kitAutocompleteTobody","standard")}};c.fn.kitAutocompleteTobody=function(d){if(a[d]){return a[d].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof d==="object"||!d){return a.init.apply(this,arguments)}else{c.error("Method "+d+" does not exist on jQuery.kitAutocomplete")}}}})(jQuery);