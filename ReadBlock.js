( function ( window ){
	"use strict";

	var wordRegex = /([^\s\-\—\/]+[\-\—\/]?|[\r\n]+)/g;
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

	var ReadBlock = function ( val ) {
		this.val = val;

		this.words = [];
		this.index = 0;

		this.process();
	};

	var p = ReadBlock.prototype;

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

	window.ReadBlock = ReadBlock;

}(window) );
