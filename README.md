# CoffeeBrew
Firefox add-on that displays syntax-highlighted JavaScript source code,
after performing CoffeeScript -to- JavaScript transcompilation.

## Summary
  * [official](http://coffeescript.org/extras/coffee-script.js) [CoffeeScript compiler](https://github.com/jashkenas/coffeescript/blob/master/extras/coffee-script.js) is used to perform the source-to-source transcompilation
  * [highlight.js](https://github.com/isagalaev/highlight.js) is used to provide syntax highlighting to the resulting JavaScript code

## Detection methodology
  * the add-on modifies all server responses that satisfy all of the following criteria:
    * the HTTP header 'content-type' is either:
      * 'text/plain'
      * 'text/coffeescript'
    * the location protocol is not 'view-source:'
    * the location pathname ends with '.coffee'

## User Preferences:
  * syntax highlighting:
    * on/off toggle

      > default: on
    * choice of color scheme

      options consist of those provided by [highlight.js](https://github.com/isagalaev/highlight.js/tree/master/src/styles)

      > default: 'solarized_dark'

## Examples

  > URLs to render in-browser after the add-on has been installed, which illustrate its functionality

  * https://raw.githubusercontent.com/assaf/zombie/master/src/zombie/browser.coffee
  * https://raw.githubusercontent.com/assaf/zombie/master/src/zombie/window.coffee
  * https://raw.githubusercontent.com/assaf/zombie/master/src/zombie/document.coffee

## License
  > [GPLv2](http://www.gnu.org/licenses/gpl-2.0.txt)
