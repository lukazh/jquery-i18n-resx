# jQuery.i18n.resx

## About
**jQuery.i18n.resx** is a lightweight jQuery plugin for providing internationalization to javascript from ‘.resx’ files, just like in Asp.Net Resource Bundles. It loads and parses resource bundles (.resx) based on provided language and country codes (ISO-639 and ISO-3166) or language reported by browser.

Resource bundles are ‘.resx‘ files containing locale specific key-value pairs. The use of ‘.resx‘ files for translation is specially useful when sharing i18n files between Asp.Net and Javascript projects. This plugin loads the default file (eg, Messages.resx) first and then locale specific files (Messages.zh.resx, then Messages.zh-CN.resx), so that a default value is always available when there is no translation provided. Translation keys will be available to developer as javascript variables/functions (functions, if translated value contains substitutions (eg, {0}) or as a map.


## Features
* Use Asp.Net standard ‘.resx‘ files for translations
* Use standard ISO-639 for language code and ISO-3166 for country code
* Sequential loading of resource bundles from base language to user-specified/browser-specified so there is always a default value for an untranslated string (eg: Messages.resx, Messages.zh.resx, Messages.zh-CN.resx)
* Use browser reported language if no language was specified
* Placeholder substitution in resource bundle strings (eg, Hello {0}!!)
* Suport for namespaces in keys (eg, com.company.msgs.hello)
* Support for multi-line values
* Resource bundle keys available as Javascript vars/functions or as a map
* Support for namespacing.


## Asynchronous Language File Loading

Synchronous Ajax has now been deprecated and will be removed at some point in the future, so web developers need to start thinking about writing their code as callbacks (https://xhr.spec.whatwg.org/).


## Usage


### Using the plugin
1. Include it on your ``<head>`` section:

```html
<script type="text/javascript" language="JavaScript"
  src="js/jquery.i18n.resx-min.js"></script>
```

2. Initialize the plugin (minimal usage, will use language reported by browser), and access a translated value (assuming a key named ‘org.somekey‘ exists, it will be setup as a variable you can use directly in your Javascript):

```html
<script>
	jQuery.i18n.resx({
  		name: 'Messages', 
  		callback: function(){ alert( org.somekey ); }
	});
</script>
```


### Options             

Option | Description | Notes
------ | ----------- | -----
**name**   | Partial name (or names) of files representing resource bundles (eg, ‘Messages’ or ['Msg1','Msg2']). Defaults to 'Messages' | Optional String or String[] |
**language** | ISO-639 Language code and, optionally, ISO-3166 country code (eg, ‘en’, ‘en_US’, ‘pt_BR’). If not specified, language reported by the browser will be used instead. | Optional String |
**path** | Path to directory that contains ‘.resx‘ files to load. | Optional String |
**namespace** | The namespace that you want your keys to be stored under. You'd access these keys like this: $.i18n.map\[namespace\]\[key\]. Using a namespace minimises the chances of key clashes and overwrites. | Optional String |
**mode** | Option to have resource bundle keys available as Javascript vars/functions OR as a map. The ‘map’ option is mandatory if your bundle keys contain Javascript Reserved Words. Possible options: ‘vars’ (default), ‘map’ or ‘both’. | Optional String |
**debug** | Option to turn on console debug statement. Possible options: true or false. | Optional boolean |
**cache** | Whether bundles should be cached by the browser, or forcibly reloaded on each page load. Defaults to false (i.e. forcibly reloaded). | Optional boolean |
**encoding** | The encoding to request for bundles. Resource bundles are specified to be in ISO-8859-1 format. Defaults to UTF-8 for backward compatibility. | Optional String |
**callback** | Callback function to be called uppon script execution completion. | Optional function() |


Licensed under the [MIT License](LICENSE).