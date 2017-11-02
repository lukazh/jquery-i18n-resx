/******************************************************************************
 * jQuery.i18n.resx
 *
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 *
 * @version     1.0.0
 * @url         https://github.com/lukazh/jquery-i18n-resx
 *
 *****************************************************************************/

(function ($) {

    $.i18n = {};

    /**
     * Map holding bundle keys if mode is 'map' or 'both'. Values of this can also be an
     * Object, in which case the key is a namespace.
     */
    $.i18n.map = {};

    var log = function (message) {
        window.console && console.log('i18n::' + message);
    };

    /**
     * Load and parse message bundle files (.resx),
     * making bundles keys available as javascript variables.
     *
     * i18n files are named <name>.resx, or <name>.<language>.resx or <name>.<language>-<country>.resx
     * Where:
     *      The <language> argument is a valid ISO Language Code. These codes are the lower-case,
     *      two-letter codes as defined by ISO-639. You can find a full list of these codes at a
     *      number of sites, such as: http://www.loc.gov/standards/iso639-2/englangn.html
     *      The <country> argument is a valid ISO Country Code. These codes are the upper-case,
     *      two-letter codes as defined by ISO-3166. You can find a full list of these codes at a
     *      number of sites, such as: http://www.iso.ch/iso/en/prods-services/iso3166ma/02iso-3166-code-lists/list-en1.html
     *
     * Sample usage for a bundles/Messages.resx bundle:
     * $.i18n.resx({
     *      name:      'Messages',
     *      language:  'en-US',
     *      path:      'bundles'
     * });
     * @param  name      (string/string[], optional) names of file to load (eg, 'Messages' or ['Msg1','Msg2']). Defaults to 'Messages'
     * @param  language  (string, optional) language/country code (eg, 'en', 'en-US', 'zh-CN'). if not specified, language reported by the browser will be used instead.
     * @param  path      (string, optional) path of directory that contains file to load
     * @param  mode      (string, optional) whether bundles keys are available as JavaScript variables/functions or as a map (eg, 'vars' or 'map')
     * @param  load      (string/string[], optional) which files to load: file with no locale specification ('default'), with only language code ('language'), 
     *                                              and with language-country code ('country'). Defaults to ['default','language','country']
     * @param  ext       (string, optional) extension of files to load. In case one changes the 'resx' extension in order to avoiding web server restriction. Defaults to 'resx'
     * @param  debug     (boolean, optional) whether debug statements are logged at the console
     * @param  cache     (boolean, optional) whether bundles should be cached by the browser, or forcibly reloaded on each page load. Defaults to true (i.e. forcibly reloaded)
     * @param  encoding  (string, optional) the encoding to request for bundles. Resource bundles are specified to be in ISO-8859-1 format. Defaults to UTF-8 for backward compatibility.
     * @param  callback  (function, optional) callback function to be called after script is terminated
     */
    $.i18n.resx = function (settings) {

        var defaults = {
            name: 'Messages',
            language: '',
            path: '',
            namespace: null,
            mode: 'vars',
            load: '',
            ext: 'resx',
            cache: true,
            debug: false,
            encoding: 'UTF-8',
            async: false,
            callback: null
        };

        settings = $.extend(defaults, settings);

        if (settings.namespace && typeof(settings.namespace) === 'string') {
            // A namespace has been supplied, initialise it.
            if (settings.namespace.match(/^[a-z]*$/)) {
                $.i18n.map[settings.namespace] = {};
            } else {
                log('Namespaces can only be lower case letters, a - z');
                settings.namespace = null;
            }
        }

        // Ensure a trailing slash on the path
        if (!settings.path.match(/\/$/)) settings.path += '/';

        // Try to ensure that we have at a least a two letter language code
        settings.language = this.normaliseLanguageCode(settings);

        // Ensure correct and an array
        var loadAll = ['default','language','country'];
        if(settings.load){
            if(typeof(settings.load) === 'string') settings.load = [settings.load];
            for(var i=0;i<settings.load.length;){
                var item = settings.load[i];
                if(loadAll.indexOf(item) === -1){
                    log('err: unexpected setting for "load": ' + item);
                    settings.load.splice(i, 1);
                    continue;
                }
                i++;
            }
        }
        if(!settings.load.length) {
            settings.load = loadAll;
        }

        // Ensure an array
        var files = (settings.name && $.isArray(settings.name)) ? settings.name : [settings.name];

        // A locale is at least a language code which means at least two files per name. If
        // we also have a country code, thats an extra file per name.
        settings.totalFiles = (files.length * 2) + ((settings.language.length >= 5) ? files.length : 0);
        if (settings.debug) {
            log('totalFiles: ' + settings.totalFiles);
        }

        settings.filesLoaded = 0;
        
        files.forEach(function (file) {
            var fileNames = [];
            if(settings.load.indexOf('default') !== -1){
                fileNames.push(settings.path + file + '.' + settings.ext);
            }
            if(settings.load.indexOf('language') !== -1){
                fileNames.push(settings.path + file + '.' + settings.language.substring(0, 2) + '.' + settings.ext);
            }
            if(settings.load.indexOf('country') !== -1 && settings.language.length >= 5){
                fileNames.push(settings.path + file + '.' + settings.language.substring(0, 5) + '.' + settings.ext);
            }
            loadAndParseFiles(fileNames, settings);
        });

        // call callback
        if (settings.callback && !settings.async) {
            settings.callback();
        }
    }; // resx

    /**
     * When configured with mode: 'map', allows access to bundle values by specifying its key.
     * Eg, $.i18n.res('com.company.bundles.menu_add')
     */
    $.i18n.res = function (key /* Add parameters as function arguments as necessary  */) {

        var args = [].slice.call(arguments);

        var phvList, namespace;
        if (args.length === 2) {
            if ($.isArray(args[1])) {
                // An array was passed as the second parameter, so assume it is the list of place holder values.
                phvList = args[1];
            } else if (typeof args[1] === 'object') {
                // Second argument is an options object {namespace: 'mynamespace', replacements: ['egg', 'nog']}
                namespace = args[1].namespace;
                var replacements = args[1].replacements;
                args.splice(-1, 1);
                if (replacements) {
                    Array.prototype.push.apply(args, replacements);
                }
            }
        }

        var value = (namespace) ? $.i18n.map[namespace][key] : $.i18n.map[key];
        if (typeof(value) === 'undefined') {
            return (namespace) ? namespace + '#' + key : key;
        }

        var i;
        if (typeof(value) === 'string') {
            // Lazily convert the string to a list of tokens.
            var arr = [], j, index;
            i = 0;
            while (i < value.length) {
                if (value.charAt(i) === '{') {
                    // Beginning of an unquoted place holder.
                    j = value.indexOf('}', i + 1);
                    if (j === -1) {
                        i++; // No end. Process the rest of the line. Java would throw an exception
                    } else {
                        // Add 1 to the index so that it aligns with the function arguments.
                        index = parseInt(value.substring(i + 1, j));
                        if (!isNaN(index) && index >= 0) {
                            // Put the line thus far (if it isn't empty) into the array
                            var s = value.substring(0, i);
                            if (s !== '') {
                                arr.push(s);
                            }
                            // Put the parameter reference into the array
                            arr.push(index);
                            // Start the processing over again starting from the rest of the line.
                            i = 0;
                            value = value.substring(j + 1);
                        } else {
                            i = j + 1; // Invalid parameter. Leave as is.
                        }
                    }
                } else {
                    i++;
                }
            } // while

            // Put the remainder of the no-empty line into the array.
            if (value !== '') {
                arr.push(value);
            }
            value = arr;

            // Make the array the value for the entry.
            if (namespace) {
                $.i18n.map[settings.namespace][key] = arr;
            } else {
                $.i18n.map[key] = arr;
            }
        }

        if (value.length === 0) {
            return '';
        }
        if (value.length === 1 && typeof(value[0]) === 'string') {
            return value[0];
        }

        var str = '';
        for (i = 0, j = value.length; i < j; i++) {
            if (typeof(value[i]) === 'string') {
                str += value[i];
            } else if (phvList && value[i] < phvList.length) {
                // Must be a number
                str += phvList[value[i]];
            } else if (!phvList && value[i] + 1 < args.length) {
                str += args[value[i] + 1];
            } else {
                str += '{' + value[i] + '}';
            }
        }

        return str;
    };

    function callbackIfComplete(settings) {

        if (settings.debug) {
            log('callbackIfComplete()');
            log('totalFiles: ' + settings.totalFiles);
            log('filesLoaded: ' + settings.filesLoaded);
        }

        if (settings.async) {
            if (settings.filesLoaded === settings.totalFiles) {
                if (settings.callback) {
                    settings.callback();
                }
            }
        }
    }

    function loadXML (text) {
        var xmlDoc = null;
        try //Internet Explorer
        {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async='false';
            xmlDoc.loadXML(text);
        }
        catch(e)
        {
            try //Firefox, Mozilla, Opera, etc.
            {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(text, 'text/xml');
            }
            catch(e) {}
        }
        return xmlDoc;
    }

    function loadAndParseFiles(fileNames, settings) {

        if (settings.debug) log('loadAndParseFiles');

	    if (fileNames !== null && fileNames.length > 0) {
		    loadAndParseFile(fileNames[0], settings, function () {
			    fileNames.shift();
			    loadAndParseFiles(fileNames,settings);
		    });
	    } else {
            callbackIfComplete(settings);
        }
    }

    /** Load and parse .resx files */
    function loadAndParseFile(filename, settings, nextFile) {

        if (settings.debug) {
            log('loadAndParseFile(\'' + filename +'\')');
            log('totalFiles: ' + settings.totalFiles);
            log('filesLoaded: ' + settings.filesLoaded);
        }

  	    if (filename !== null && typeof filename !== 'undefined') {
            $.ajax({
                url: filename,
                async: settings.async,
                cache: settings.cache,
                dataType: 'text',
                success: function (data, status) {

                    if (settings.debug) {
                        log('Succeeded in downloading ' + filename + '.');
                        log(data);
                    }

                    parseData(data, settings);
                    nextFile();
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    if (settings.debug) {
                        log('Failed to download or parse ' + filename + '. errorThrown: ' + errorThrown);
                    }
                    if (jqXHR.status === 404) {
                        settings.totalFiles -= 1;
                    }
                    nextFile();
                }
            });
        }
    }

    /** Parse .resx files */
    function parseData(data, settings) {
        var xmlDoc = loadXML(data);
        var items = xmlDoc.getElementsByTagName('data');
        var parsed = '';
        var regPlaceHolder = /(\{\d+})/g;
        var regRepPlaceHolder = /\{(\d+)}/g;
        var regEscapeCharacters = /"|\t|\r|\n|\f/g;
        var unicodeRE = /(\\u.{4})/ig;
        for (var i=0,l=items.length;i<l;i++) {
            var item = items[i];
            var name = item.attributes['name'].value;
            var value = item.getElementsByTagName('value')[0].textContent.trim();

            /** Mode: bundle keys in a map */
            if (settings.mode === 'map' || settings.mode === 'both') {
                // handle unicode chars possibly left out
                var unicodeMatches = value.match(unicodeRE);
                if (unicodeMatches) {
                    unicodeMatches.forEach(function (match) {
                        value = value.replace(match, unescapeUnicode(match));
                    });
                }
                // add to map
                if (settings.namespace) {
                    $.i18n.map[settings.namespace][name] = value;
                } else {
                    $.i18n.map[name] = value;
                }
            }

            /** Mode: bundle keys as vars/functions */
            if (settings.mode === 'vars' || settings.mode === 'both') {
                // Handle escape characters. Done separately from the tokenizing loop below because escape characters are
                // active in quoted strings.
                value = value.replace(regEscapeCharacters, function(match){
                    if(match === '\"')
                        return '\\\"';
                    if(match === '\t')
                        return '\\t';
                    if(match === '\r')
                        return '\\r';
                    if(match === '\n')
                        return '\\n';
                    if(match === '\f')
                        return '\\f';
                });

                // make sure namespaced key exists (eg, 'some.key')
                checkKeyNamespace(name);

                // value with variable substitutions
                if (regPlaceHolder.test(value)) {
                    var parts = value.split(regPlaceHolder);
                    // process function args
                    var first = true;
                    var fnArgs = '';
                    var usedArgs = [];
                    parts.forEach(function (part) {

                        if (regPlaceHolder.test(part) && (usedArgs.length === 0 || usedArgs.indexOf(part) === -1)) {
                            if (!first) {
                                fnArgs += ',';
                            }
                            fnArgs += part.replace(regRepPlaceHolder, 'v$1');
                            usedArgs.push(part);
                            first = false;
                        }
                    });
                    parsed += name + '=function(' + fnArgs + '){';
                    // process function body
                    var fnExpr = '"' + value.replace(regRepPlaceHolder, '"+v$1+"') + '"';
                    parsed += 'return ' + fnExpr + ';' + '};';
                    // simple value
                } else {
                    parsed += name + '="' + value + '";';
                }
            } // END: Mode: bundle keys as vars/functions
        }
        eval(parsed);
        settings.filesLoaded += 1;
    }

    /** Make sure namespace exists (for keys with dots in name) */
    // TODO key parts that start with numbers quietly fail. i.e. month.short.1=Jan
    function checkKeyNamespace(key) {

        var regDot = /\./;
        if (regDot.test(key)) {
            var fullname = '';
            var names = key.split(/\./);
            for (var i=0,j=names.length;i<j;i++) {
                var name = names[i];

                if (i > 0) {
                    fullname += '.';
                }

                fullname += name;
                if (eval('typeof(' + fullname + ')==="undefined"')) {
                    eval(fullname + '={};');
                }
            }
        }
    }

    /** Ensure language code is in the format aa-AA. */
    $.i18n.normaliseLanguageCode = function (settings) {

        var lang = settings.language;
        if (!lang || lang.length < 2) {
            if (settings.debug) log('No language supplied. Pulling it from the browser ...');
			/* Chrome will display pages in the language on the top of the user prefered language list,
			   but itself in the selected one, which is a little confusing. */
            lang = (navigator.languages && navigator.languages.length > 0) ? navigator.languages[0]
                                        : (navigator.language || navigator.userLanguage || 'en');
            if (settings.debug) log('Language from browser: ' + lang);
        }

        lang = lang.toLowerCase();
        lang = lang.replace(/_/,'-');
        if (lang.length > 3) {
            lang = lang.substring(0, 3) + lang.substring(3).toUpperCase();
        }
        return lang;
    };

    /** Unescape unicode chars ('\u00e3') */
    function unescapeUnicode(str) {

        // unescape unicode codes
        var codes = [];
        var code = parseInt(str.substr(2), 16);
        if (code >= 0 && code < Math.pow(2, 16)) {
            codes.push(code);
        }
        // convert codes to text
        return codes.reduce(function (acc, val) { return acc + String.fromCharCode(val); }, '');
    }
}) (jQuery);
