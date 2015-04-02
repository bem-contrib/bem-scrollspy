/* global modules:false */

modules.define('scrollspy',
               ['i-bem__dom', 'jquery__event_type_scroll', 'functions__throttle', 'next-tick'],
               function(provide, BEMDOM, $, throttle, nextTick) {

provide(BEMDOM.decl('scrollspy', {
    onSetMod : {
        'js' : {
            'inited' : function() {  

              this.__self.add(this);
              this.offset = this.params.offset || '10%'; 
              this.scrollin = false; 

              this.nextTick(function(){
                this.calcOffsets();
                 //смотрим, нет ли елементов в фокусе
                this.onScroll();               
              });
              
              this.bindToWin('resize', throttle(this.calcOffsets, 1500, this));
            },

            '' : function(){
              this.__self.del(this._uniqId);
            }
        },
        
    },

    /**
     * Set block offset
     * @public
     * @param {int| string} offset new block offset in px or percents
     */
    setOffset: function(offset){
      this.offset = offset;
      this.calcOffsets();
    },

    /**
     * Calc scroll block in/out position
     * @returns void
     */
    calcOffsets:function(){
      this.position = this.domElem.offset();
      this.height = this.domElem.height();
      this.offset = this.__self.getOffset(this.offset);      

      this.top = this.position.top ; //верхняя граница
      this.bottom = this.position.top + this.height; //нижняя граница 

      this.oftop = this.top + this.offset;
      this.ofbottom = this.bottom - this.offset;
    },


    /**
     * Выполняется, на каждом блоке при каждом скролле
     * @returns void
     */
    onScroll: function(){
      if(this.__self.isForward){  // if scrolled down

        if ( (this.oftop <= this.__self.posBottom) && (this.bottom >= this.__self.scroll) ) {
          this.activate();          
        }else{
          this.deactivate();          
        }

      }else{ // scrolled up
       
        if (this.ofbottom >= this.__self.scroll && this.top <= this.__self.posBottom){
          this.activate();          
        }else{
          this.deactivate();         
        }

      }//end if      
    },


    /**
     * Activate block in view zone.
     * @param {object} block BEM block
     * @returns {bool} result
     */
    activate: function() {

      if (this.scrollin) {
        return false;
      }
      
      this.emit('scrollin', this.__self.direction);
      this.scrollin = true;
      return true;
    },

    /**
     * Dectivate block outside view zone.
     * @returns {bool} result
     */
    deactivate: function() {

      if (!this.scrollin) {
        return false;
      }

      this.emit('scrollout', this.__self.direction);
      this.scrollin = false;    
      return true;
    },

    /**
     * Returns scroll direction
     * @returns {string} direction
     */
    getDir: function(){
      return this.__self.getDir();
    },

    /**
     * Is block in view zone
     * @returns {bool} active block
     */
    isActive: function(){
      return this.scrollin;
    }
},{ /* static methods */

    /**
     * Register new block
     */
    add: function(block) {
      this._listeners[block._uniqId] = block;
    },

    del: function(uniqId){
      delete this._listeners[uniqId];
    },

    _listeners: {},

    pause: 100,

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

    /**
     * viewport Height
     */
    screenH: BEMDOM.win.height(), 

    /**
     * This callback calls once on every scroll 
     *
     * @callback _onScroll
     * @param {object} event
     */
    _onScroll: function(e) {
       //var d = new Date();
       this.scroll = BEMDOM.win.scrollTop();
       this._setDirection();
       this.posBottom = this.scroll + this.screenH;

       for (var i in this._listeners) {
         this._listeners[i].onScroll();
       }

      this.oldScroll = this.scroll;

      //console.log({time: new Date() - d, listeners: Object.keys(this._listeners).length});
    },

    /**
     * Returns scroll direction
     * @returns {string} direction
     */
    getDir: function(){
      return this.direction;
    },

    /**
     * Calc scroll direction.  
     * @returns void 
     */
    _setDirection:function(){
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
    getOffset: function(offset){

      if (typeof offset === 'string') {       
        
        var off = parseFloat(offset);

        if (offset.indexOf('%') > -1) {
          return Math.ceil(this.screenH * off / 100);
        }
        return off;
      }
      return offset;
    },

    live: function(){
      $(window).bind('scrollstop', $.proxy(throttle(this._onScroll, this.pause, this), this));
      this.scroll = BEMDOM.win.scrollTop();
      return false;
    }
} 
 ));


});
