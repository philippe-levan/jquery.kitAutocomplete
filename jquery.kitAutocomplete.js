/*!
 * Open source under the BSD License
 * Copyright (c) 2011, Philippe Le Van, Kitpages, http://www.kitpages.fr
 */
(function( $ ){

    var WidgetAutocomplete = (function() {
        // constructor
        function WidgetAutocomplete(boundingBox, options) {
            this._settings = {
                delay: 300, // delay in ms after a keystroke to activate itself
                item: null, // item selected and displayed at initialization
                field: 'value', // field to display in the line
                cssField: 'className', // field to use to set a class to the li in the menu

                // events
                search: null, // before remote call
                open: null, // before menu opens
                focus : null, // before highlight change
                select: null, // before item selection
                close: null, // when the list is closed (selected or canceled)
                change: null // after an item was selected and line value changed
            };
            // settings
            if (options) {
                $.extend(this._settings, options);
            }

            // DOM Nodes
            this._boundingBox = boundingBox;
            this._input = this._boundingBox.find("input");
            this._ul = this._boundingBox.find("ul");
            this._ul.kitAutocompleteTobody();

            // memory
            this._boundingBox.data( "kitAutocomplete", this );
            this._input.data( "kitAutocomplete", this );

            this.init();
        };

        // methods
        WidgetAutocomplete.prototype = {
            init: function() {
                //console.debug("autocomplete init");
                var self = this;
                // init widget state
                self._lastSearch = "";
                self._item = this._settings.item;
                if (self._item) {
                    self._lastSearch = self._item[self._settings.field];
                }
                self._itemList = [];
                self._isMenuOpen = false;
                self._render();

                var eventList = ['search', 'open', 'render', 'focus', 'select', 'unselect', 'close', 'change'];
                // init custom events according to settings callback values
                for (var i = 0 ; i < eventList.length ; i++ ) {
                    if (this._settings[eventList[i]]) {
                        this._boundingBox.bind(eventList[i]+"_kitAutocomplete", {self:self}, this._settings[eventList[i]]);
                    }
                }

                // init custom events according to settings callback values
                for (var i = 0 ; i < eventList.length ; i++ ) {
                    var callbackName = "_"+eventList[i]+"Callback";
                    this._boundingBox.bind(eventList[i]+"_kitAutocomplete", {self:self}, this[callbackName]);
                }

                // register events
                this._input.bind("keydown.autocomplete", this.keydownCallback);

                this._input.bind( "blur.autocomplete", this.blurCallback);
            },


            ////
            // callbacks
            ////
            keydownCallback: function (event) {
                var self = $(this).data("kitAutocomplete");
                if (self._input.attr("readonly")) {
                    return;
                }
                // escape
                if (event.keyCode == '27') {
                    self.close();
                    return;
                }

                // keypress is triggered before the input value is changed
                clearTimeout( self.searching );
                self.searching = setTimeout(function() {
                    if (!self._input.val()) {
                        self._item = null;
                    }
                    // only search if the value not empty
                    if ( (self._input.val()) && ( self._lastSearch != self._input.val() ) ) {
                        self.search( event );
                    }
                }, self._settings.delay );
            },

            blurCallback: function( event ) {
                var self = $(this).data("kitAutocomplete");
                clearTimeout( self.searching );
                // clicks on the menu (or a button to trigger a search) will cause a blur event
                self.closing = setTimeout(function() {
                    self.close();
                }, 300 );
            },


            remoteCallback: function (data) {
                ////console.log.log("remote callback, line count="+data.length);
                var self = this;
                self._itemList = data;
                self.open();
            },

            _menuClickCallback: function(event, clickedElement) {
                var self = this;
                var a = $(clickedElement);
                var item = a.data("kitAutocomplete");
                self._boundingBox.trigger("select_kitAutocomplete", [{item: item}]);
            },

            _searchCallback: function(event, data) {
                if (event.isDefaultPrevented()) {
                    return;
                }
                var self = $(this).data("kitAutocomplete");
                self._item = null;
                self._lastSearch = self._input.val();
                $.ajax({
                    url: self._settings.source,
                    type: "POST",
                    data: {term: self._lastSearch, field: self._settings.field},
                    dataType: "json",
                    success: $.proxy(self.remoteCallback, self)
                });
            },
            _openCallback: function(event, data) {
                if (event.isDefaultPrevented()) {
                    return;
                }
                //console.log("open event callback");
                var self = $(this).data("kitAutocomplete");
                self._isMenuOpen = true;
                self.render();
            },
            _renderCallback: function(event, itemList, item, lastSearch, isMenuOpen) {
                if (event.isDefaultPrevented()) {
                    return;
                }

                var self = $(this).data("kitAutocomplete");
                self._render();
            },
            _focusCallback: function(event, data) {
                if (event.isDefaultPrevented()) {
                    return;
                }
            },
            _selectCallback: function(event, data) {
                if (event.isDefaultPrevented()) {
                    return;
                }
                //console.log("select event callback");
                var self = $(this).data("kitAutocomplete");
                self._item = data.item;
                self._lastSearch = self._item[self._settings.field];
                self._itemList = [];
                self.close();
                self._boundingBox.trigger("change_kitAutocomplete", [
                    self._item,
                    self._lastSearch
                ]);
            },
            _unselectCallback: function(event) {
                if (event.isDefaultPrevented()) {
                    return;
                }
                //console.log("select event callback");
                var self = $(this).data("kitAutocomplete");
                self._item = null;
            },

            _closeCallback: function(event) {
                if (event.isDefaultPrevented()) {
                    return;
                }
                var self = $(this).data("kitAutocomplete");
                self._isMenuOpen = false;
                clearTimeout( self.searching );
                if (self._item == null) {
                    self.unselect();
                }
                self.render();
            },

            _changeCallback: function(event, data) {
                if (event.isDefaultPrevented()) {
                    return;
                }
            },

            ////
            // methods
            ////
            search: function(event) {
                var self = this;
                self._boundingBox.trigger("search_kitAutocomplete", [{searchValue: self._lastSearch}]);
            },
            _render: function() {
                var self = this;
                self._renderMenu();
                self._input.val(self._lastSearch);
            },
            _renderMenu: function() {
                var self = this;
                //console.log("renderMenu");
                self._ul.empty();
                if (self._isMenuOpen && (self._itemList.length > 0)) {
                    self._ul.hide(); // hack, avoid reflow
                    for (var i = 0 ; i < self._itemList.length ; i++) {
                        // create link into menu
                        var item = self._itemList[i];
                        var a = $('<a></a>');
                        // add value to field
                        a.append(item[self._settings.field]);
                        a.click(function(event) {
                            self._menuClickCallback(event, this);
                        });
                        a.data("kitAutocomplete", item);

                        // create li
                        var li = $('<li></li>');
                        if (item.className) {
                            li.addClass(item.className);
                        }

                        // add a and li to ul
                        li.append(a);
                        self._ul.append(li);
                    }
                    self._ul.addClass('shift-autocomplete-ul');
                    self._ul.show(); // end of hack, avoid reflow
                    self._ul.kitAutocompleteTobody('toBody');
                } else {
                    self._ul.kitAutocompleteTobody('fromBody');
                    self._ul.hide(); // hack, avoid reflow
                }
            },
            close: function() {
                var self = this;
                self._boundingBox.trigger("close_kitAutocomplete");
            },
            render: function() {
                var self = this;
                self._boundingBox.trigger("render_kitAutocomplete", [
                    self._itemList,
                    self._item,
                    self._lastSearch,
                    self._isMenuOpen
                ]);
            },
            unselect: function() {
                var self = this;
                self._boundingBox.trigger("unselect_kitAutocomplete");
            },
            open: function() {
                var self = this;
                self._boundingBox.trigger("open_kitAutocomplete", [{itemList: self._itemList}]);
            }
        };
        return WidgetAutocomplete;
    })();

    var methods = {
        /**
         * add events to a dl instance
         * @this the dl instance (jquery object)
         */
        init : function ( options ) {
            var self = $(this);
            // chainability => foreach
            return this.each(function() {
                var widget = new WidgetAutocomplete($(this), options);
            });
        },

        close: function() {
            return this.each(function() {
                var widget = $(this).data("kitAutocomplete");
                widget.close();
            });
        },
        open: function() {
            return this.each(function() {
                var widget = $(this).data("kitAutocomplete");
                widget.open();
            });
        },
        render: function() {
            return this.each(function() {
                var widget = $(this).data("kitAutocomplete");
                widget.render();
            });
        },
        search: function() {
            return this.each(function() {
                var widget = $(this).data("kitAutocomplete");
                widget.search();
            });
        },
        unselect: function() {
            return this.each(function() {
                var widget = $(this).data("kitAutocomplete");
                widget.unselect();
            });
        },

        /**
         * unbind all kitAutocomplete events
         */
        destroy : function( ) {
        }

    };

    $.fn.kitAutocomplete = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.kitAutocomplete' );
        }
    };
})( jQuery );

/**
 * used to send autocomplete menu to the body.
 * It is used to force menu to stay in front of other
 * dom elements.
 */
(function($){

    var settings = {};
    var methods = {
        init: function(options) {
            settings = $.extend(settings, options);
            var ul = $(this);
            ul.data("kitAutocompleteTobody", "standard");
        },
        toBody: function() {
            var ul = $(this);
            if (ul.data("kitAutocompleteTobody") !== "standard") {
                return;
            }
            var position = ul.position();
            var offset = ul.offset();
            var parent = ul.parent();
            ul.data("kitAutocompleteTobody", {
                top: position.top,
                left: position.left,
                parent: parent,
                position: ul.css("position"),
                zindex: ul.css("z-index")
            });
            var data = ul.data("kitAutocompleteTobody");
            //console.log("toBody : top:"+data.top+" left:"+data.left);
            ul.appendTo('body').addClass("shift-autocomplete-ul").css({
                'position': 'absolute',
                'z-index': 400000,
                'top': offset.top,
                'left': offset.left
            });
        },
        fromBody: function() {
            var ul = $(this);
            var data = ul.data("kitAutocompleteTobody");
            if (data === "standard") {
                return;
            }
            //console.log("fromBody : top:"+data.top+" left:"+data.left);
            ul.appendTo(data.parent).css({
                'position': data.position,
                'z-index': data.zindex,
                'top': data.top,
                'left': data.left
            });
            ul.data("kitAutocompleteTobody", "standard");
        }
    };

    $.fn.kitAutocompleteTobody = function(method) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.kitAutocomplete' );
        }
    };

})(jQuery);
