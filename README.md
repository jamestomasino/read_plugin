### Read

Speed reading via rapid serial visual presentation

Get the [plugin](https://chrome.google.com/webstore/detail/read/aiijjeoekhpdpfcnejiganpaaacdodko)!


[![Read Demonstration](http://img.youtube.com/vi/XPbmBl2W1bA/0.jpg)](http://www.youtube.com/watch?v=XPbmBl2W1bA)

- - - - -

#### How to Use

Select text on any website by dragging over it with your mouse. When you right click on your selected text, choose the "Read Selected Text" option to launch the reading bar.

- `Pause` by clicking on the words in the reading bar.
- `Resume` by clicking on the words in the reading bar again.
- Change or finesse your reading speed by expanding the options panel on the left.

- - - - -

#### Features

This tool handles all of the parsing and display logic on the client-side. There is no dictionary look-up or database of words referenced. Everything is parsed by regular expressions. Even with these limitations, read offers some unique features.

##### RSVP

Rapid serial visual presentation allows for readers to keep their eyes focused on a single point on the page, saving a massive amount of time normally lost in reading. As the speed of this serial presentation increases, sub-vocalization also decreases and astounding speeds can be reached with great comprehension.

##### Alignment

When the eyes read a word, there is an optimal focal point placement around 30% into the word to support easiest understanding. We handle this shift in the alignment of the words for you based on the word length.

##### Timing

Speed reading via RSVP is all about the timing. How long we display any given word can have a massive impact on the reading experience. Here's a few ways we optimize that experience.

##### Word Length

Contrary to expectations, reading small words can actually be more difficult than reading words of medium length. Long words also take a longer time to process. These extra delays are built into our rendering code.

##### Punctuation

When you encounter a period, question mark, exclamation point or other punctuation, additional time is provided to process the sentence or fragment. This helps avoid the feeling of a run-on sentence.

##### Paragraphs

The tool also gives an additional pause between paragraphs to help contextualize and process information as you read it.

- - - - -

#### Change Log

- v2.0.6 - Code cleanup and fixes. No more unnecessary number punctuation breaking (@knod contribution)
- v2.0.5 - Added loading icon while fetching full-page text through Mercury for better UX
- v2.0.4 - Readability shut down its API, so I've migrated to a new one called Mercury
- v2.0.3 - Explicitly set word-wrap properties to override sites that add breaks
- v2.0.2 - Added Numeric Delay option to slow down numbers
- v2.0.1 - Allow users to Read at speeds up to 1500wpm (increased from 1200).
- v2.0.0 - Completely rebuilt access to the Readability API by using a proxy. Now supports HTTPS.
- v1.0.0 - We are now parsing the page to get only the relevant article content!
- v0.4.0 - 3 new configurable settings, liquid UI
- v0.3.7 - All settings are stored in chrome sync.
- v0.3.5 - Abandoned Unicode Symbols and just embedded images so I could use a better font.
- v0.3.4 - DroidSans is a pack of lies. DejaVuSans has proper symbols.
- v0.3.3 - Apparently you have to fully embed custom fonts. Boo.
- v0.3.2 - Font fix for PC (missing unicode chars)
- v0.3.1 - CSS fixes
- v0.3.0 - Added a drop-down menu for options and a restart button
- v0.2.2 - Better WPM settings
- v0.2.0 - Read icon reads whole page
- v0.1.3 - Fixed pause/play and alignment

- - - - -

#### License

Unless stated otherwise, everything in this repository is dedicated to the public domain through the [Creative Commons Zero license - zero rights reserved](http://creativecommons.org/publicdomain/zero/1.0/).

#### Issues

If you find a bug or want to suggest a new feature, please log an issue [over here](https://github.com/jamestomasino/read_plugin/issues). I welcome pull requests!
