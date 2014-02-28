( function ( window ){
	"use strict";

	var textRegex = /\w/g;
	var Word = function ( val ) {
		this.val = val;

		this.index = 0;
		this.timeMultiplier = 1;
		this.hasLeadingQuote = false;
		this.hasTrailingQuote = false;
		this.hasPeriod = false;
		this.hasOtherPunc = false;

		this.process();
	};

	var p = Word.prototype;

	p.process = function () {

		var match = this.val.match(textRegex);
		this.length = (match) ? match.length : 0;

		var lastChar = this.val.substr(-1);
		var firstChar = this.val[0];

		if (lastChar == "\"" || lastChar == "'" || lastChar == ")" || lastChar =="”" || lastChar == "’" ) {
			this.hasTrailingQuote = true;
		}

		if (firstChar == "\"" || firstChar == "'" || firstChar == "(" || firstChar =="“" || firstChar == "‘" ) {
			this.hasLeadingQuote = true;
		}

		if (this.hasTrailingQuote) {
			lastChar = this.val.substr(-2,1);
		}

		switch (lastChar) {
			case ".":
			case "!":
			case "?":
				this.hasPeriod = true;
				this.timeMultiplier = 2.5;
				break;
			case ":":
			case ";":
			case ",":
			case "-":
				this.hasOtherPunc = true;
				this.timeMultiplier = 1.5;
				break;
		}

		switch (this.length) {
			case 0:
			case 1:
				this.index = 0;
				this.timeMultiplier += 0.1;
				break;
			case 2:
			case 3:
			case 4:
				this.timeMultiplier += 0.2;
				this.index = 1;
				break;
			case 5:
			case 6:
			case 7:
			case 8:
				this.index = 2;
				break;
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
				this.index = 3;
				this.timeMultiplier += 0.2;
				break;
			default:
				this.index = 4;
				this.timeMultiplier += 0.4;
				break;
		}

		// Adjust index for leading quote
		if (this.hasLeadingQuote) {
			this.index ++;
		}

	};

	window.ReadWord = Word;

}(window) );


( function ( window ){
	"use strict";

	var wordRegex = /([^\s\-\—]+[\-\—]?|[\r\n]+)/g;
	var presuf = /^(\W*)(anti|auto|ab|an|ax|al|as|bi|bet|be|contra|cat|cath|cir|cum|cog|col|com|con|cor|could|co|desk|de|dis|did|dif|di|eas|every|ever|extra|ex|end|en|em|epi|evi|func|fund|fin|hyst|hy|han|il|in|im|ir|just|jus|loc|lig|lit|li|mech|manu|man|mal|mis|mid|mono|multi|mem|micro|non|nano|ob|oc|of|opt|op|over|para|per|post|pre|peo|pro|retro|rea|re|rhy|should|some|semi|sen|sol|sub|suc|suf|super|sup|sur|sus|syn|sym|syl|tech|trans|tri|typo|type|uni|un|van|vert|with|would|won)?(.*?)(weens?|widths?|icals?|ables?|ings?|tions?|ions?|ies|isms?|ists?|ful|ness|ments?|ly|ify|ize|ise|ity|en|ers?|ences?|tures?|ples?|als?|phy|puts?|phies|ry|ries|cy|cies|mums?|ous|cents?)?(\W*)$/i;
	var vowels = 'aeiouyAEIOUY'+
		'ẚÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĀāẢảȀȁȂȃẠạẶặẬậḀḁȺⱥ'+
		'ǼǽǢǣÉƏƎǝéÈèĔĕÊêẾếỀềỄễỂểĚěËëẼẽĖėȨȩḜḝĘęĒēḖḗḔḕẺẻȄȅȆȇẸẹỆệḘḙḚḛɆɇɚɝÍíÌìĬĭÎîǏǐÏ'+
		'ïḮḯĨĩİiĮįĪīỈỉȈȉȊȋỊịḬḭIıƗɨÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯȰȱØøǾǿǪǫǬǭŌōṒṓ'+
		'ṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộƟɵÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũṸṹŲųŪūṺṻỦủȔȕȖȗƯưỨứỪừ'+
		'ỮữỬửỰựỤụṲṳṶṷṴṵɄʉÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵʏɎɏƳƴ';
	var c = '[^'+vowels+']';
	var v = '['+vowels+']';
	var vccv = new RegExp('('+v+c+')('+c+v+')', 'g');
	var simple = new RegExp('(.{2,4}'+v+')'+'('+c+')', 'g');

	var Block = function ( val ) {
		this.val = val;

		this.words = [];
		this.index = 0;

		this.process();
	};

	var p = Block.prototype;

	p.process = function () {
		// Cleanup
		this.words = [];
		this.index = 0;

		// Build word chain
		var rawWords = this.val.match(wordRegex);
		var i = rawWords.length; while (i--) {
			var w = rawWords[i];

			// Split up long words as best we can
			if (w.length > 13) {
				w = this.break(w);
				var subWords = w.match(wordRegex);
				var j = subWords.length; while (j--) {
					this.words.unshift( new ReadWord(subWords[j]) ) ;
				}
			} else {
				this.words.unshift( new ReadWord(w) ) ;
			}
		}

	};


	p.break = function (word) {
		// punctuation, prefix, center, suffix, punctuation
		var parts = presuf.exec(word);
		var ret = [];
		if (parts[2]) {
			ret.push(parts[2]);
		}
		if (parts[3]) {
			ret.push(parts[3].replace(vccv, '$1-$2'));
		}
		if (parts[4]) {
			ret.push(parts[4]);
		}
		return (parts[1]||'') + ret.join('-') + (parts[5]||'');
	};

	p.getWord = function () {
		if (this.words.length && this.index < this.words.length)
			return this.words[this.index];
		else
			return null;
	};

	p.next = function () {
		this.index = Math.min( this.index + 1, this.words.length );
	};

	p.prev = function () {
		this.index = Math.max( this.index - 1, 0 );
	};

	p.restart = function () {
		this.index = 0;
	};

	p.getProgress = function () {
		return this.index / this.words.length;
	};

	window.ReadBlock = Block;

}(window) );


( function ( window, $ ){
	"use strict";

	var ele = '<div class="read progrecss"><div class="read_position"><div class="indicator"></div><div class="display"></div><div class="before"></div><div class="letter"></div></div><input class="speed" type="text" /></div>';

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

	function Read ( block, element, speed ) {

		// Defaults
		this.parentElement = null;
		this.element = null;
		this.displayElement = null;
		this.speedElement = null;
		this.currentWord = null;
		this.delay = 0;
		this.timer = null;
		this.slowStartCount = 5;
		this.isPlaying = false;
		this.isEnded = false;

		Read.enforceSingleton(this);

		// Configured
		this.setWPM(speed || 300);
		this.setBlock(block);
		this.setElement(element);
	};

	Read.enforceSingleton = function (inst) {
		if (Read.instance) {
			Read.instance.destroy();
			Read.instance = null;
		}
		Read.instance = inst;
	};

	var p = Read.prototype;

	p.destroy = function () {
		p.pause();
		this.speedElement.off ( "blur" );
		this.speedElement.off ( "keydown" );
		this.parentElement.find('.read').remove();
		this.parentElement.css( "padding-top", "-=50" );
	};

	p.setBlock = function (val) {
		if (val) {
			this.pause();
			this.restart();
			this.block = new ReadBlock(val);
			this.clearDisplay();
		}
	};

	p.setElement = function (val) {
		if (!val) {
			val = 'body';
		}

		this.clearDisplay();

		// unbind old binds
		if (this.parentElement) {
			this.parentElement.find('.read').remove();
			this.parentElement.css( "padding-top", "-=50" );
		}

		if (val instanceof $) {
			this.parentElement = val;
		} else {
			this.parentElement = $(val);
		}

		// bind new binds
		this.element = $(ele);
		this.parentElement.animate( { "padding-top": "+=50" }, 400);
		this.parentElement.prepend(this.element);
		this.element.slideDown();
		this.displayElement = this.element.find('.display');
		this.speedElement = this.element.find('.speed');
		this.displayElement.on ( "touchend click", $.proxy(this.playPauseToggle, this) );
		this.speedElement.on ( "blur", $.proxy(this.updateWPMFromUI, this) );
		this.speedElement.on ( "keydown", function(e) { if (e.keyCode == 13) { $(this).blur(); } });

	};

	p.playPauseToggle = function () {
		if (this.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	};

	p.play = function () {
		if (this.block) {
			if (this.isEnded) {
				this.restart();
				this.isEnded = false;
			}
			this.slowStartCount = 5;
			this.display();
			this.isPlaying = true;
		}
	};

	p.next = function() {
		this.block.next();
		this.display();
	};

	p.display = function () {
		this.currentWord = this.block.getWord();
		if (this.currentWord) {
			this.showWord();
			var time = this.delay * this.currentWord.timeMultiplier;
			if (this.slowStartCount) {
				time = time * this.slowStartCount;
				this.slowStartCount --;
			}
			this.timer = setTimeout($.proxy(this.next, this),time);
		} else {
			this.clearDisplay();
			this.isPlaying = false;
			this.isEnded = true;
			this.element.attr('data-progrecss', 100 );
		}
	};

	p.showWord = function () {
		if (this.displayElement) {
			var word = this.currentWord.val;

			var before = word.substr(0, this.currentWord.index);
			var letter = word.substr(this.currentWord.index, 1);

			console.log ( before, letter );

			// fake elements
			var $before = this.element.find('.before').html(before).css("opacity","0");
			var $letter = this.element.find('.letter').html(letter).css("opacity","0");

			var calc = $before.textWidth() + Math.round( $letter.textWidth() / 2 );

			this.displayElement.html(this.currentWord.val);
			this.displayElement.css("margin-left", -calc);
		}

		if (this.speedElement && !this.speedElement.is(":focus")) {
			this.speedElement.val(this._wpm);
		}

		if (this.element && this.block) {
			this.element.attr('data-progrecss', parseInt(this.block.getProgress() * 100, 10) );
		}
	};

	p.clearDisplay = function () {
		if (this.displayElement) this.displayElement.html("");
	};

	p.pause = function () {
		clearTimeout(this.timer);
		this.isPlaying = false;
	};

	p.restart = function () {
		if (this.block) this.block.restart();
	};

	p.setWPM = function ( val ) {
		this._wpm = val;
		this.delay = 1/(val/60)*1000;
	};

	p.updateWPMFromUI = function () {
		var newWPM = this.speedElement.val();
		newWPM = newWPM.match(/[\d]+/g);
		newWPM = parseInt(newWPM, 10);
		this.setWPM(newWPM);
	};

	window.Read = Read;

}(window, jQuery) );
