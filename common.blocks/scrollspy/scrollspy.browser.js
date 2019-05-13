/* global modules:false */

modules.define('scrollspy', ['i-bem-dom', 'jquery', 'functions__throttle'], function(provide, bemDom, $, throttle) {

  provide(bemDom.declBlock(this.name, {
    onSetMod: {
      'js': {
        'inited': function() {
          this.__self.add(this);
          this._offset = this.params.offset || '10%';
          this._scrollin = false;

          this._nextTick(function(){
            this.calcOffsets();
            this._onScroll(); // check for elements in focus
          });

          this._domEvents(bemDom.win).on('resize', throttle(this.calcOffsets, 1500, this));
        },

        '' : function() {
          this.__self.del(this._uniqId);
        }
      }
    },

    /**
     * Set block offset
     * @public
     * @param {int| string} offset new block offset in px or percents
     */
    setOffset: function(offset) {
      this._offset = offset;
      this.calcOffsets();

      return this;
    },

    /**
     * Calc scroll block in/out position
     * @returns BEM
     */
    calcOffsets:function() {
      var domElem = this.domElem;

      this.position = domElem.offset();
      this.height = domElem.height();
      this._offset = this.__self.getOffset(this._offset);

      this.top = this.position.top ; //верхняя граница
      this.bottom = this.position.top + this.height; //нижняя граница

      this._oftop = this.top + this._offset;
      this._ofbottom = this.bottom - this._offset;

      return this;
    },


    /**
     * Runs everytime on every block
     * @returns {bool}
     */
    _onScroll: function() {
      var self = this.__self;

      // scrolled down
      if(self.isForward) {
        if (this._oftop <= self.posBottom && this.bottom >= self.scroll) {
          return this.activate();
        }

        return this.deactivate();
      }

      // scrolled up
      if (this._ofbottom >= self.scroll && this.top <= self.posBottom) {
        return this.activate();
      }

      return this.deactivate();
    },


    /**
     * Activate block in view zone.
     * @returns {bool} result
     */
    activate: function() {

      if (this._scrollin) {
        return false;
      }

      this._emit('scrollin', this.__self.direction);
      this._scrollin = true;
      return true;
    },

    /**
     * Dectivate block outside view zone.
     * @returns {bool} result
     */
    deactivate: function() {

      if (!this._scrollin) {
        return false;
      }

      this._emit('scrollout', this.__self.direction);
      this._scrollin = false;
      return true;
    },

    /**
     * Returns scroll direction
     * @returns {string} direction
     */
    getDir: function() {
      return this.__self.getDir();
    },

    /**
     * Is block in view zone
     * @returns {bool} active block
     */
    isActive: function() {
      return this._scrollin;
    }

  }, { /* static methods */

    /**
     * Register new block
     */
    add: function(block) {
      this._listeners[block._uniqId] = block;
    },

    del: function(uniqId) {
      delete this._listeners[uniqId];
    },

    _listeners: {},

    pause: 50,

    idleTimeout : 400,

    /**
     * Forward direction name
     */
    forward: 'down',

    /**
     * Backward direction name
     */
    backward: 'up',

    /**
     * viewport scroll
     */
    scroll: 0,
    oldScroll: 0,
    direction: this.forward,
    isForward: true,

    /**
     * viewport Height
     */
    screenH: bemDom.win.height(),

    _to : null,

    /**
     * This callback calls once on every scroll
     *
     * @callback _onScroll
     * @param {object} event
     */
    _onScroll: function(e) {
      this.scroll = bemDom.win.scrollTop();
      this._setDirection();
      this.posBottom = this.scroll + this.screenH;

      if(this._to) {
          clearTimeout(this._to);
      }

      for (var i in this._listeners) {
        this._listeners[i]._onScroll();
      }

      this.oldScroll = this.scroll;

      if(e) {
          this._to = setTimeout(this._onScroll.bind(this), this.idleTimeout);
      }
    },

    /**
     * Returns scroll direction
     * @returns {string} direction
     */
    getDir: function() {
      return this.direction;
    },

    /**
     * Calc scroll direction.
     * @returns void
     */
    _setDirection:function() {
      this.isForward = this.oldScroll < this.scroll;
      this.direction = this.isForward ? this.forward : this.backward;
    },

    /**
     * Calc offset in px. Convert strings to `float`,
     * percents to px
     *
     * @param {int|string} offset
     * @returns {int} offset in px
     */
    getOffset: function(offset) {
      if (typeof offset !== 'string') return offset;

      var off = parseFloat(offset);

      if (offset.indexOf('%') > -1) {
        return Math.ceil(this.screenH * off / 100);
      }
      return off;
    },

    onInit: function() {
      var win = bemDom.win;
      win.bind('scroll', $.proxy(throttle(this._onScroll, this.pause, this), this));
      this.scroll = win.scrollTop();
      this.posBottom = this.scroll + this.screenH;

      return this.__base.apply(this, arguments);
    }
  }));

});
