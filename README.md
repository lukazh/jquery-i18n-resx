# jQuery.i18n.resx

## About
**jQuery.i18n.resx** is a lightweight jQuery plugin for providing internationalization to javascript from ".resx" files, just like in Asp.Net Resource Bundles. It loads and parses resource bundles (.resx) based on provided language and country codes (ISO-639 and ISO-3166) or language reported by browser.

Resource bundles are ".resx" files containing locale specific key-value pairs. The use of ".resx" files for translation is specially useful when sharing i18n files between Asp.Net and Javascript projects. In order to avoiding the web server or project itself's restriction of access to ".resx" files, the file extension could be changed to something else like "xml". This plugin can load the default file (eg, Messages.resx) and locale specific files (with or without country specification, eg, Messages.zh.resx, Messages.zh-CN.resx), according to the setting. Translation keys will be available to developer as javascript variables/functions (functions, if translated value contains substitutions (eg, {0}) or as a map.


## Features
* Use Asp.Net standard ".resx" files for translations, which extension could be changed while content kept
* Use standard ISO-639 for language code and ISO-3166 for country code
* Load resource bundles with or without language and country specification (eg, Messages.resx, Messages.zh.resx, then Messages.zh-CN.resx)
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
<script type="text/javascript" language="JavaScript" src="js/jquery.i18n.resx-min.js"></script>
```

2. Initialize the plugin (minimal usage, will use language reported by browser), and access a translated value (assuming a key named "org.somekey" exists, it will be setup as a variable you can use directly in your Javascript):

```html
<script>
	jQuery.i18n.resx({
  		name: 'Messages', 
		path: 'bundles/', 
		mode: 'both',
		language: 'en-US',
  		callback: function(){
			var value = org.somekey; // or jQuery.i18n.res('org.somekey')
			console.log(value); 
		}
	});
</script>
```


### Options             

Option | Description | Notes
------ | ----------- | -----
**name**   | Partial name (or names) of files representing resource bundles (eg, 'Messages' or ['Msg1','Msg2']). Defaults to 'Messages' | Optional String or String[] |
**language** | ISO-639 Language code and, optionally, ISO-3166 country code (eg, 'en', 'en_US', 'zh_CN'). If not specified, language reported by the browser will be used instead. | Optional String |
**path** | Path to directory that contains resource files to load. | Optional String |
**namespace** | The namespace that you want your keys to be stored under. You'd access these keys like this: jQuery.i18n.map\[namespace\]\[key\]. Using a namespace minimises the chances of key clashes and overwrites. | Optional String |
**mode** | Option to have resource bundle keys available as Javascript vars/functions OR as a map. The 'map' option is mandatory if your bundle keys contain Javascript Reserved Words. Possible options: 'vars', 'map' or 'both'. Defaults to 'vars'. | Optional String |
**load** | Option to determine which files to load: file with no locale specification ('default'), with only language code ('language'), and with language-country code ('country'). Defaults to ['default','language','country'] | Optional String |
**ext** | Option to set the extension of files to load. Defaults to 'resx'. | Optional String |
**debug** | Option to turn on console debug statement. Defaults to true. | Optional boolean |
**cache** | Whether bundles should be cached by the browser, or forcibly reloaded on each page load. Defaults to true. | Optional boolean |
**encoding** | The encoding to request for bundles. Resource bundles are specified to be in ISO-8859-1 format. Defaults to UTF-8 for backward compatibility. | Optional String |
**callback** | Callback function to be called uppon script execution completion. | Optional function() |


Licensed under the [MIT License](LICENSE).
