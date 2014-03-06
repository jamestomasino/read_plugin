( function ( window, $ ){
	"use strict";

	var ele = '<div class="__read __progrecss"><div class="__read_position"><div class="__read_indicator"></div><div class="__read_display"></div><div class="__read_before"></div><div class="__read_letter"></div></div><input class="__read_speed" type="text" /></div>';

	$.fn.textWidth = function(){
		var self = $(this),
			children = self.contents(),
			calculator = $('<span style="display: inline-block;" />'),
			width;

		children.wrap(calculator);
		width = children.parent().width();
		children.unwrap();
		return width;
	};

	var defaultOptions = {
		element: null,
		wpm: 300,
		slowStartCount: 5,
		sentenceDelay: 2.5,
		otherPuncDelay: 1.5,
		shortWordDelay: 1.3,
		longWordDelay: 1.4
	};


	function Read ( block, options ) { //element, wpm ) {

		// Defaults
		this._parentElement = null;
		this._displayElement = null;
		this._speedElement = null;
		this._currentWord = null;
		this._delay = 0;
		this._timer = null;
		this._isPlaying = false;
		this._isEnded = false;

		this._options = $.extend( {}, defaultOptions, options );

		Read.enforceSingleton(this);

		// Configured
		this.setWPM(this._options.wpm);
		this.setText(block);
		this.setElement(this._options.element);
	}

	Read.enforceSingleton = function (inst) {
		if (Read.instance) {
			Read.instance.destroy();
			Read.instance = null;
		}
		Read.instance = inst;
	};

	var p = Read.prototype;

	p._display = function () {
		this._currentWord = this._block.getWord();
		if (this._currentWord) {
			this._showWord();

			var time = this._delay;

			if ( this._currentWord.hasPeriod ) time *= this._options.sentenceDelay;
			if ( this._currentWord.hasOtherPunc ) time *= this._options.otherPuncDelay;
			if ( this._currentWord.isShort ) time *= this._options.shortWordDelay;
			if ( this._currentWord.isLong ) time *= this._options.longWordDelay;

			if (this._options.slowStartCount) {
				time = time * this._options.slowStartCount;
				this._options.slowStartCount --;
			}
			this._timer = setTimeout($.proxy(this._next, this),time);
		} else {
			this.clearDisplay();
			this._isPlaying = false;
			this._isEnded = true;
			this._options.element.attr('data-progrecss', 100 );
		}
	};

	p._showWord = function () {
		if (this._displayElement) {
			var word = this._currentWord.val;

			var before = word.substr(0, this._currentWord.index);
			var letter = word.substr(this._currentWord.index, 1);

			// fake elements
			var $before = this._options.element.find('.__read_before').html(before).css("opacity","0");
			var $letter = this._options.element.find('.__read_letter').html(letter).css("opacity","0");

			var calc = $before.textWidth() + Math.round( $letter.textWidth() / 2 );

			this._displayElement.html(this._currentWord.val);
			this._displayElement.css("margin-left", -calc);
		}

		if (this._speedElement && !this._speedElement.is(":focus")) {
			this._speedElement.val(this._wpm);
		}

		if (this._options.element && this._block) {
			this._options.element.attr('data-progrecss', parseInt(this._block.getProgress() * 100, 10) );
		}
	};

	p.destroy = function () {
		p.pause();
		this._speedElement.off ( "blur" );
		this._speedElement.off ( "keydown" );
		this._parentElement.find('.__read').remove();
		this._parentElement.css( "padding-top", "-=50" );
	};

	p.setText = function (val) {
		if (val) {
			this.pause();
			this.restart();
			this._block = new ReadBlock(val);
			this.clearDisplay();
		}
	};

	p._next = function() {
		this._block.next();
		this._display();
	};

	p.setElement = function (val) {
		if (!val) {
			val = 'body';
		}

		this.clearDisplay();

		// unbind old binds
		if (this._parentElement) {
			this._parentElement.find('.__read').remove();
			this._parentElement.css( "padding-top", "-=50" );
		}

		if (val instanceof $) {
			this._parentElement = val;
		} else {
			this._parentElement = $(val);
		}

		// bind new binds
		this._options.element = $(ele);
		this._parentElement.animate( { "padding-top": "+=50" }, 400);
		this._parentElement.prepend(this._options.element);
		this._options.element.slideDown();
		this._displayElement = this._options.element.find('.__read_display');
		this._speedElement = this._options.element.find('.__read_speed');
		this._displayElement.on ( "touchend click", $.proxy(this.playPauseToggle, this) );
		this._speedElement.on ( "blur", $.proxy(this.updateWPMFromUI, this) );
		this._speedElement.on ( "keydown", function(e) { if (e.keyCode == 13) { $(this).blur(); } });

	};

	p.playPauseToggle = function () {
		if (this._isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	};

	p.play = function () {
		if (this._block) {
			if (this._isEnded) {
				this.restart();
				this._isEnded = false;
			}
			this._options.slowStartCount = 5;
			this._display();
			this._isPlaying = true;
		}
	};

	p.clearDisplay = function () {
		if (this._displayElement) this._displayElement.html("");
	};

	p.pause = function () {
		clearTimeout(this._timer);
		this._isPlaying = false;
	};

	p.restart = function () {
		if (this._block) this._block.restart();
	};

	p.setWPM = function ( val ) {
		val = Number(val);
		val = Math.max (1, val);
		val = Math.min (1500, val);
		this._wpm = val;
		this._delay = 1/(val/60)*1000;
	};

	p.setSentenceDelay = function ( val ) {
		val = Number(val);
		val = Math.max (1, val);
		val = Math.min (10, val);
		this._options.sentenceDelay = val;
	};

	p.setOtherPuncDelay = function ( val ) {
		val = Number(val);
		val = Math.max (1, val);
		val = Math.min (10, val);
		this._options.otherPuncDelay = val;
	};

	p.setShortWordDelay = function ( val ) {
		val = Number(val);
		val = Math.max (1, val);
		val = Math.min (10, val);
		this._options.shortWordDelay = val;
	};

	p.setLongWordDelay = function ( val ) {
		val = Number(val);
		val = Math.max (1, val);
		val = Math.min (10, val);
		this._options.longWordDelay = val;
	};

	p.setSlowStartCount = function ( val ) {
		val = Number(val);
		val = Math.max(0,val);
		val = Math.min(10,val);
		this._options.slowStartCount = val;
	};

	p.updateWPMFromUI = function () {
		var newWPM = this._speedElement.val();
		newWPM = newWPM.match(/[\d]+/g);
		newWPM = parseInt(newWPM, 10);
		this.setWPM(newWPM);
	};

	window.Read = Read;

}(window, jQuery) );
