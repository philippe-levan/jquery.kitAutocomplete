/*
 * Open source under the BSD License
 * Copyright (c) 2011, Philippe Le Van, Kitpages, http://www.kitpages.fr
 */
(function(c){var a=(function(){function d(f,e){this._settings={delay:300,item:null,field:"value",cssField:"className",search:null,open:null,focus:null,select:null,close:null,change:null};if(e){c.extend(this._settings,e)}this._boundingBox=f;this._input=this._boundingBox.find("input");this._ul=this._boundingBox.find("ul");this._ul.kitAutocompleteTobody();this._boundingBox.data("kitAutocomplete",this);this._input.data("kitAutocomplete",this);this.init()}d.prototype={init:function(){var e=this;e._lastSearch="";e._item=this._settings.item;if(e._item){e._lastSearch=e._item[e._settings.field]}e._itemList=[];e._isMenuOpen=false;e._render();var g=["search","open","render","focus","select","unselect","close","change"];for(var f=0;f<g.length;f++){if(this._settings[g[f]]){this._boundingBox.bind(g[f]+"_kitAutocomplete",this._settings[g[f]])}}for(var f=0;f<g.length;f++){var h="_"+g[f]+"Callback";this._boundingBox.bind(g[f]+"_kitAutocomplete",this[h])}this._input.bind("keydown.autocomplete",this.keydownCallback);this._input.bind("blur.autocomplete",this.blurCallback)},keydownCallback:function(f){var e=c(this).data("kitAutocomplete");if(e._input.attr("readonly")){return}if(f.keyCode=="27"){e.close();return}clearTimeout(e.searching);e.searching=setTimeout(function(){if(!e._input.val()){e._item=null}if((e._input.val())&&(e._lastSearch!=e._input.val())){e.search(f)}},e._settings.delay)},blurCallback:function(f){var e=c(this).data("kitAutocomplete");clearTimeout(e.searching);e.closing=setTimeout(function(){e.close()},300)},remoteCallback:function(f){var e=this;e._itemList=f;e.open()},_menuClickCallback:function(i,g){var f=this;var e=c(g);var h=e.data("kitAutocomplete");f._boundingBox.trigger("select_kitAutocomplete",[{item:h}])},_searchCallback:function(f,g){if(f.isDefaultPrevented()){return}var e=c(this).data("kitAutocomplete");e._item=null;e._lastSearch=e._input.val();c.ajax({url:e._settings.source,type:"POST",data:{term:e._lastSearch,field:e._settings.field},dataType:"json",success:c.proxy(e.remoteCallback,e)})
},_openCallback:function(f,g){if(f.isDefaultPrevented()){return}var e=c(this).data("kitAutocomplete");e._isMenuOpen=true;e.render()},_renderCallback:function(j,g,i,f,e){if(j.isDefaultPrevented()){return}var h=c(this).data("kitAutocomplete");h._render()},_focusCallback:function(e,f){if(e.isDefaultPrevented()){return}},_selectCallback:function(f,g){if(f.isDefaultPrevented()){return}var e=c(this).data("kitAutocomplete");e._item=g.item;e._lastSearch=e._item[e._settings.field];e._itemList=[];e.close()},_unselectCallback:function(f){if(f.isDefaultPrevented()){return}var e=c(this).data("kitAutocomplete");e._item=null},_closeCallback:function(f){if(f.isDefaultPrevented()){return}var e=c(this).data("kitAutocomplete");e._isMenuOpen=false;clearTimeout(e.searching);if(e._item==null){e.unselect()}e.render()},_changeCallback:function(e,f){if(e.isDefaultPrevented()){return}},search:function(f){var e=this;e._boundingBox.trigger("search_kitAutocomplete",[{searchValue:e._lastSearch}])},_render:function(){var e=this;e._renderMenu();e._input.val(e._lastSearch)},_renderMenu:function(){var g=this;g._ul.empty();if(g._isMenuOpen&&(g._itemList.length>0)){g._ul.hide();for(var h=0;h<g._itemList.length;h++){var j=g._itemList[h];var f=c("<a></a>");f.append(j[g._settings.field]);f.click(function(i){g._menuClickCallback(i,this)});f.data("kitAutocomplete",j);var e=c("<li></li>");if(j.className){e.addClass(j.className)}e.append(f);g._ul.append(e)}g._ul.addClass("shift-autocomplete-ul");g._ul.show();g._ul.kitAutocompleteTobody("toBody")}else{g._ul.kitAutocompleteTobody("fromBody");g._ul.hide()}},close:function(){var e=this;e._boundingBox.trigger("close_kitAutocomplete")},render:function(){var e=this;e._boundingBox.trigger("render_kitAutocomplete",[e._itemList,e._item,e._lastSearch,e._isMenuOpen])},unselect:function(){var e=this;e._boundingBox.trigger("unselect_kitAutocomplete")},open:function(){var e=this;e._boundingBox.trigger("open_kitAutocomplete",[{itemList:e._itemList}])}};return d})();var b={init:function(e){var d=c(this);
return this.each(function(){var f=new a(c(this),e)})},close:function(){return this.each(function(){var d=c(this).data("kitAutocomplete");d.close()})},open:function(){return this.each(function(){var d=c(this).data("kitAutocomplete");d.open()})},render:function(){return this.each(function(){var d=c(this).data("kitAutocomplete");d.render()})},search:function(){return this.each(function(){var d=c(this).data("kitAutocomplete");d.search()})},unselect:function(){return this.each(function(){var d=c(this).data("kitAutocomplete");d.unselect()})},destroy:function(){}};c.fn.kitAutocomplete=function(d){if(b[d]){return b[d].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof d==="object"||!d){return b.init.apply(this,arguments)}else{c.error("Method "+d+" does not exist on jQuery.kitAutocomplete")}}}})(jQuery);(function(c){var b={};var a={init:function(d){b=c.extend(b,d);var e=c(this);e.data("kitAutocompleteTobody","standard")},toBody:function(){var e=c(this);if(e.data("kitAutocompleteTobody")!=="standard"){return}var d=e.position();var h=e.offset();var f=e.parent();e.data("kitAutocompleteTobody",{top:d.top,left:d.left,parent:f,position:e.css("position"),zindex:e.css("z-index")});var g=e.data("kitAutocompleteTobody");e.appendTo("body").addClass("shift-autocomplete-ul").css({position:"absolute","z-index":400000,top:h.top,left:h.left})},fromBody:function(){var d=c(this);var e=d.data("kitAutocompleteTobody");if(e==="standard"){return}d.appendTo(e.parent).css({position:e.position,"z-index":e.zindex,top:e.top,left:e.left});d.data("kitAutocompleteTobody","standard")}};c.fn.kitAutocompleteTobody=function(d){if(a[d]){return a[d].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof d==="object"||!d){return a.init.apply(this,arguments)}else{c.error("Method "+d+" does not exist on jQuery.kitAutocomplete")}}}})(jQuery);