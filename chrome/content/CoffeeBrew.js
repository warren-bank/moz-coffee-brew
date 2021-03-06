/*
 * --------------------------------------------------------
 * firefox addon-on
 *     name:    CoffeeBrew
 *     summary: Browser displays syntax-highlighted JavaScript source code,
 *              after performing CoffeeScript -to- JavaScript transcompilation.
 *     url:     https://github.com/warren-bank/moz-coffee-brew
 * author
 *     name:    Warren R Bank
 *     email:   warren.r.bank@gmail.com
 *     url:     https://github.com/warren-bank
 * license
 *     name:    GPLv2
 *     url:     http://www.gnu.org/licenses/gpl-2.0.txt
 * --------------------------------------------------------
 */

window.addEventListener('load', function load(event) {
	window.removeEventListener('load', load, false);
	CoffeeBrew.init();
}, false);

if (!CoffeeBrew) {
	var CoffeeBrew = {

		prefs: null,
		load_prefs: function(){
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
							.getService(Components.interfaces.nsIPrefService)
							.getBranch("extensions.CoffeeBrew.");
		},

		init: function() {
			var appcontent = document.getElementById('appcontent');
			if (appcontent){
				this.load_prefs();
				appcontent.addEventListener('DOMContentLoaded', this.onPageLoad, true);
			}
		},

		onPageLoad: function(aEvent) {
			var self				= CoffeeBrew;
			var document			= aEvent.originalTarget;
			var head, body, cs_code, js_code;

			if (document.location.protocol.toLowerCase() === "view-source:"){return;}

			switch( document.contentType.toLowerCase() ){
				case 'text/plain':
				case 'text/coffeescript':
					break;
				default:
					return;
			}

			if (! (/\.coffee$/.test( document.location.pathname.toLowerCase() ))){return;}

			head				= document.head;
			body				= document.body;
			cs_code				= body.textContent;
			try {
				js_code			= CoffeeScript.compile(cs_code);
				document.title	= document.location.pathname.toLowerCase().replace(/^.*\/([^\/]+)\.coffee$/,'$1.js');
			}
			catch(e){return;}

			(function(){

				// prefs: syntax_highlighter
				var highlight = {};
				highlight.theme		= self.prefs.getCharPref("syntax_highlighter.theme");
				highlight.enabled	= self.prefs.getBoolPref("syntax_highlighter.enabled");
				highlight.enabled	= (highlight.enabled && highlight.theme);

				// add css files to head
				$C({
					"link_01": {
						"rel"		: "stylesheet",
						"type"		: "text/css",
						"href"		: ("resource://cvskin/CoffeeBrew.css")
					},
					"link_02": {
						"rel"		: "stylesheet",
						"type"		: "text/css",
						"href"		: ("resource://cvskin/" + (highlight.enabled? ("highlight_styles/" + highlight.theme.toLowerCase() + ".css") : "highlight_styles_disabled.css"))
					}
				}, head, document);

				// empty the body
				while (body.firstChild) {
					body.removeChild(body.firstChild);
				}

				// <pre><code class="javascript">js_code</code></pre>
				var $pre;

				$pre	= $C({"pre": false}, body, document);

				if (highlight.enabled){
					(function(){
						try {
							var HTMLParser, $js_dom_tree;

							// add syntax highlighting
							js_code				= ( hljs.highlight('javascript', js_code, false) ).value;

							// wrap inside a single parent element
							js_code				= '<code class="hljs javascript">' + js_code + '</div>';

							// parse this string into a DOM structure
							HTMLParser			= function(aHTMLString){
								var html,body;
								html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
								body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");

								html.documentElement.appendChild(body);

								body.appendChild(
									Components.classes["@mozilla.org/feed-unescapehtml;1"]
										.getService(Components.interfaces.nsIScriptableUnescapeHTML)
										.parseFragment(aHTMLString, false, null, body)
								);
								return body;
							};
							$js_dom_tree		= (HTMLParser(js_code)).firstChild;

							// attach the DOM structure
							$pre.appendChild($js_dom_tree);
						}
						catch(e){
							highlight.enabled	= false;
						}
					})();
				}
				if (! highlight.enabled){
					$C({"code": {
							"class"		: "javascript",
							"text"		: js_code
					}}, $pre, document);
				}

			})();

		}
	};
}
