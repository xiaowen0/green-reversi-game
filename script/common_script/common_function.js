/**
 * common function
 * dependent on jQuery
 * last update:     2018-11-22 12:00
 */

var dependencies = ['jquery', 'bootstrap', 'boorstrapTheme'];

var cdnList = {
    'china' : {
        html5shiv : 'https://cdn.bootcss.com/html5shiv/r29/html5.min.js',
        bootstrap : 'https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css',
        boorstrapTheme : 'https://cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap-theme.min.css',
        jquery : 'https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js',
        momentWithLocales : 'https://cdn.bootcss.com/moment.js/2.18.1/moment-with-locales.min.js'
    },
    'world' : {
        html5shiv : 'https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js',
        bootstrap : 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css',
        bootstrapTheme : 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap-theme.min.css',
        jquery : 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js',
        momentWithLocales : 'http://momentjs.com/downloads/moment-with-locales.min.js'
    }
};

/* --- Number function group --------------------------------------- */


function fixFloatingPointNumber(number, bit) {

    var numberStr = new String(number);
    if (numberStr.indexOf('.') < 0)	// no point, fill 0
    {
        return numberStr + '.' + repeatString('0', bit);
    }

    var a1 = numberStr.split('.');  a1[1].length;

    if (a1[1].length < bit)
    {
        a1[1] += repeatString('0', bit - a1[1].length);
    }
    else if (a1[1].length > bit)
    {
        a1[1] = a1[1].substr(0, bit);
    }

    return a1.join('.');
}

/* --- debug function group ------------------------------------------ */

/**
 * enable debug mode
 * @return  boolean
 */
function enableDebug()
{
    try {
        // current browser not support sessionStorage
        if (typeof(sessionStorage) != 'object') {
            return false;
        }

        sessionStorage.setItem("debug", 'on');
        return true;
    }
    catch (e) {
        return true;
    }
}
var openDebug = enableDebug;

/**
 * disable debug mode
 * @return  boolean
 */
function disableDebug()
{
    try {
        // current browser not support sessionStorage
        if (typeof(sessionStorage) != 'object') {
            return false;
        }

        sessionStorage.setItem("debug", 'off');
        return true;
    }
    catch (e) {
        return false;
    }
}
var closeDebug = disableDebug;

/**
 * get debug status
 * @returns boolean
 */
function getDebugStatus()
{
    try {
        if (typeof(sessionStorage) != 'object') {
            return false;
        }
        return sessionStorage.getItem('debug') === 'on';
    }
    catch (e) {
        return false;
    }
}

/**
 * add console log
 * @param   text    String
 * @returns boolean
 */
function addConsoleLog(text)
{
    try {
        if (typeof(console) != 'object') {
            return false;
        }

        console.log(text);
        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * add debug log
 * @param   text    String
 * @returns boolean
 */
function addDebugLog(text)
{
    if (getDebugStatus()) {
        addConsoleLog('[debug] ' + text);
        return true;
    }
    else {
        return false;
    }
}
var log = addDebugLog;

/**
 * add error log
 * @param   text    String
 * @returns boolean
 */
function addErrorLog(text)
{
    if (getDebugStatus()) {
        addConsoleLog('[error] ' + text);
        return true;
    }
    else {
        return false;
    }
}

/**
 * alert debug log
 * @param   text    String
 * @returns boolean
 */
function alertDebugLog(text)
{
    if (getDebugStatus()) {
        alert('[debug] ' + text);
        return true;
    }
    else {
        return false;
    }
}

/**
 * add debug information
 * @param text  String
 * @param type  String
 */
function addDebugInfo(text, type)
{
    var infoType = type ? type : 'info';

    if ( !$('#debugInfoDialog').length )
    {
        addConsoleLog('[warnning] element: #debugInfoDialog not exist.');
        return;
    }

    var fulltext = '[' + infoType + '] ' + text;
    var info = '<p>' + fulltext + '</p>';
    $('#debugInfoDialog .infoContainer').append(info);
}

/**
 * print object info to page.
 * @param object  Object
 */
function printObject(object)
{
    var info = createElement('div');
    var list = createElement('ul');

    for (var name in object)
    {
        var property = createElement('li');
        property.innerHTML	 = name + ': ' + object[name];
        list.appendChild(property);
    }

    info.appendChild(list);
    document.body.appendChild(info);
}

/**
 * clone object
 * @param   Object  object
 * @return  Object
 */
function cloneObject(object)
{
    var newObject = new Object();

    for (var name in object)
    {
        newObject[name] = object[name];
    }

    return newObject;
}

/**
 * merge 2 object to a new object
 * @param   Object  obj1
 * @param   Object  obj2
 * @return  Object
 */
function mergeObject(obj1, obj2)
{
    var newObject = new Object();

    var name;
    for (name in obj1)
    {
        newObject[name] = obj1[name];
    }
    for (name in obj2)
    {
        newObject[name] = obj2[name];
    }

    return newObject;
}

/**
 * set debug's content
 * @param content  String|Array   content name or array of content name
 * @returns boolean
 */
function setDebuggingContent(content)
{
    if (typeof(content)=="object")
    {
        content = content.join('|');
    }

    try {
        if (typeof(sessionStorage) != 'object') {
            return false;
        }
        return sessionStorage.setItem('debugging_content', content);
    }
    catch (e) {
        return false;
    }
}

/**
 * check if exist debugging content
 * @param name  String
 * @return boolean
 */
function existDebuggingContent(name)
{
    try {
        if (typeof(sessionStorage) != 'object') {
            return false;
        }
        var debuggingContentString = sessionStorage.getItem('debugging_content');
        if (!debuggingContentString)
        {
            return false;
        }
        var debuggingContentList = debuggingContentString.split('|');
        return inArray(name, debuggingContentList);
    }
    catch (e) {
        return false;
    }
}

/* browser feature group --------------------------------------------------------- */

/**
 * disable user copy action
 * @returns boolean
 */
function disableCopy()
{
    if (typeof(document.oncopy) === "undefined")
    {
        return false;
    }

    document.oncopy = (function (e)
    {
        return false;
    });

    return true;
}

/**
 * disable right-click context menu
 * @return boolean
 */
function disableContextMenu()
{
    if (typeof(document.oncontextmenu) === "undefined") {
        return false;
    }

    document.oncontextmenu = (function ()
    {
        return false;
    });
    return true;
}

/**
 * disable Ctrl+C hotkey
 * @returns boolean
 */
function disableCtrlC()
{
    try {
        var onkeydown = (function (e)
        {
            // keyCode with C key: 67
            if (e.ctrlKey && (e.keyCode == 67)) {
                return false;
            }
        });

        if (document.addEventListener) {  //所有主流浏览器，除了 IE 8 及更早 IE版本
            document.addEventListener("keydown", onkeydown);
            return true;
        }
        else if (document.attachEvent) {                  // IE 8 or older
            document.attachEvent("keydown", onkeydown);
            return true;
        }

        return false;
    }
    catch (e) {
        ;
    }
    return false;
}

/**
 * get browser finger printing
 * it use different canvas algorithm of browser to generate different image code
 * use this code can classify browser, then prevent user agent is altered.
 * @return String
 */
function getBrowserFingerPrinting()
{
    // create canvas element
    var canvas = document.createElement('canvas');

    if (typeof(canvas.getContext) === "undefined")
    {
        addConsoleLog("Not support browser finger printing on current browser.");
        return "";
    }

    var ctx;
    try
    {
        ctx = canvas.getContext('2d');
    }
    catch (e)
    {
        addConsoleLog(e);
        return "";
    }

    // write host name
    var txt = "http://" + location.hostname;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = location.hostname;
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);

    return canvas.toDataURL();
}

/* --- String function group ---------------------------------------------------------- */

/**
 * repeat string
 * @param String  string
 * @param Number  times
 */
function repeatString(string, times)
{
    var result = "";

    for (var i=1; i<=times; i++)
    {
        result += string;
    }

    return result;
}

/**
 * replace string
 * @param string  String  The string being searched and replaced on.
 * @param find    String  The value being searched for.
 * @param replace String  The replacement value that replaces found search values.
 * @returns String
 */
function str_replace(string, find, replace)
{
    if (find == replace) {
        return string;
    }

    var oStr = new String(string);
    while (oStr.indexOf(find) >= 0) {
        oStr = oStr.replace(find, replace);
    }
    return oStr;
}

/**
 * replace some data with key
 * @param string String
 * @param data Object  key-value pairs
 * @returns String
 */
function replaceData(string, data)
{
    for (var p in data) {
        while (string.indexOf(p) >= 0) {
            string = string.replace(p, data[p]);
        }
    }

    return string;
}

/**
 * first letter upper case
 * @param string  String
 * @returns String
 */
function firstLetterUpperCase(string)
{
    if (string.length == 0)
    {
        return string;
    }
    var firstLetter = string[0].toUpperCase();
    string = firstLetter + string.substring(1, string.length);

    return string;
}

/**
 * get random chinese name
 * @param options  Object
 * @return String
 */
function getRandomChineseName(options)
{
    var surnameList = [
        '赵','钱','孙','李','周','吴','郑','王',
        '冯','陈','褚','卫','蒋','沈','韩','杨',
        '朱','秦','尤','许','何','吕','施','张',
        '孔','曹','严','华','金','魏','陶','姜'
    ];

    var secondWordList = ['云','化','京','彦','小','志','书','健','思','嘉','明'];

    var thirdWordList = ['腾','东','宏','龙','川','东','福','林','聪','诚','珠'];

    var surname     = surnameList[Math.ceil(Math.random() * (surnameList.length - 1))];
    var secondWord  = secondWordList[Math.ceil(Math.random() * (secondWordList.length - 1))];
    var thirdWord   = thirdWordList[Math.ceil(Math.random() * (thirdWordList.length - 1))];

    var fullname = surname + secondWord + thirdWord;
    return fullname;
}

/**
 * remove all html tag in html code
 * @param   String  html  HTML code
 * @returns String
 */
function removeHtmlTag(html)
{
    return html.replace(/<[^<>]+?>/g, '');//删除所有HTML标签
}

/**
 * filter img tag from html code
 * @param   String  html code
 * @return  Array
 */
function filterImgTag(html)
{
    return new RegExp("<img[^>]*>").exec(html);
}

/**
 * escape html code
 * @param   String html
 * @returns String
 */
function escapeHtml(html)
{
    return html.replace(/[<>&"]/g, function (c)
    {
        return {'<' : '&lt;', '>' : '&gt;', '&' : '&amp;', '"' : '&quot;'}[c];
    });
}

/**
 * encode html
 * @param String  str
 * @returns String
 */
function EncodeHtml(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br/>");
    return s;
}

/**
 * decode html
 * @param String  str
 * @returns String
 */
function DecodeHtml(str)
{
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br\/>/g, "\n");
    return s;
}

/**
 * remove space in ahead of line
 * @param String|Array  single string or array of string
 * @returns String|Array
 */
function removeSpaceInAheadOfLine(string)
{
    var type = typeof(string);
    var stringList = (type == "object") ? string : [string];
    for (var i=0; i<stringList.length; i++)
    {
        stringList[i] = stringList[i].replace(new RegExp('^( )+'), '');
    }
    return (type == "object") ? stringList : stringList[0];
}

/**
 * convert a object or array to string
 * @param data  Object|Array
 * @returns mixed
 */
function data2String(data)
{
    var text = '';

    if (typeof(data) === 'object') {
        for (var i in data) {
            text += i + ': ' + data[i] + '  ';
        }
        return text;
    }
    else if (typeof(data) === 'array') {
        for (var i = 0; i < data.length; i++) {
            text += data[i];

            if (i + 1 < data.length) {
                text += ', ';
            }
        }
        return text;
    }

    return data;
}

/**
 * create url with params
 * @param String url
 * @param Object params
 * @return String
 */
function createUrl(url, params)
{
    if (typeof(params) === 'object') {
        url += '?';
        var param_string = '';

        for (var name in params) {
            param_string.length ? param_string += '&' : null;

            param_string += name + '=' + params[name];
        }

        url += param_string;
    }

    return url;
}

/**
 * get body html from html code
 * @param  String  html
 * @return String|false
 */
function getBodyHtml(html)
{
    try {
        var splitResult = html.split(/\<body[^\>]*\>/);
        if (splitResult.length < 2) {
            log('can not found string: /\<body[^\>]*\>/');
            return false;
        }
        html = splitResult[1].replace('</body>', '');
    }
    catch (e) {
        log(e);
        return false;
    }

    return html;
}

/**
 * check a path if root
 * @param String path
 * @returns boolean
 */
function isRootPath(path)
{
    // remove last / char
    if (path.lastIndexOf('/') == path.length - 1) {
        path = path.substr(0, path.length - 1);
    }

    // no parent
    if (path == '/' || path.length == 0) {
        return true;
    }

    return false;
}

/**
 * get the parent folder url by url
 * @param String url
 * @returns String
 * example:
 * 'abc' => ''
 * 'abc/dfg' => 'abc'
 * './abc/dfg' => './abc'
 */
function getParentFolder(url)
{
    // remove last / char
    if (url.lastIndexOf('/') == url.length - 1) {
        url = url.substr(0, url.length - 1);
    }

    // no parent
    if (url.lastIndexOf('/') < 0 || url.lastIndexOf('/') == 0) {
        return '';
    }

    return url.substr(0, url.lastIndexOf('/'));
}

/**
 * adjust url
 * remove parent directory string
 * @param String url
 * @returns String
 */
function adjustUrl(url)
{
    var stack = [];
    var paths = url.split("/");
    for (var i = 0; i < paths.length; i++) {
        if (paths[i] === '.') {
            continue;
        }

        if (paths[i] === "..") {
            stack.pop();
        }
        else {
            stack.push(paths[i]);
        }
    }
    var nurl = stack.join("/");
    return nurl;
}

/**
 * concat path string
 * @param String path1
 * @param String path2
 * @return String
 */
function concatPath(path1, path2)
{
    // complement separator in the end of path
    if (path1.substr(-1, 1) != '/');
    {
        path1 += '/';
    }

    // remove separator in the head of path
    if (path2.substr(0, 1) === '/') {
        path2 = path2.substr(1, path2.length);
    }

    return path1 + path2;
}

/**
 * simplify path
 * remove current directory string and current directory string
 * @param String url
 * @returns String
 */
function simplifyPath(url)
{
    // current directory string
    url = url.split('/./').join('/');
    if (url.substr(0, 2) == './') {
        url = url.substr(2, url.length);
    }

    // remove parent directory expression string
    var rule1 = new RegExp('([^\/]*)\/..\/');
    while (url.search(rule1) >= 0) {
        url = url.replace(rule1, '');
    }

    return url;
}

/**
 * get absolute base url like: http://www.example.com/
 * @return String
 */
function getAbsoluteBaseUrl()
{
    var protocol = location.protocol;
    var hostname = location.hostname;
    var port = location.port;

    var url = protocol + "//" + hostname;
    if (port != 80 || port != 443)
    {
        url += ":" + port;
    }
    url += "/";
    return url;
}

/**
 * JSON encode
 * @param   object
 * @returns String|false
 */
function json_encode(object)
{
    if (typeof(JSON) !== 'undefined') {
        var json_string = JSON.stringify(object);
        return json_string;
    }
    else if (typeof(json_parse) !== 'undefined') {
        return false;
    }

    return false;
}

/**
 * JSON decode
 * @param   string  JSON string
 * @returns Object|false
 */
function json_decode(string)
{
    var object = null;

    // use JSON object
    if (typeof(JSON) !== 'undefined') {
        object = JSON.parse(string);
        return object;
    }
    // use JSON library from  http://www.JSON.org/
    else if (typeof(json_parse) !== 'undefined') {
        object = json_parse(string);
        return object;
    }

    return false;
}

/* --- Array function group ------------------------------------------ */

/**
 * check if a value in array  检查数组是否存在某个值
 * @param mixed  value
 * @param Array  array data
 * @returns boolean
 */
function inArray(value, array)
{
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return true;
        }
    }
    return false;
}

/**
 * remove an element from a array
 * @param  Array  array
 * @param  Mixed  element
 * @returns {Array}
 */
function removeArrayElement(array, element)
{
    var newArray = new Array();

    for (var i=0; i<array.length; i++)
    {
        if (array[i] == element)
        {
            continue;
        }

        newArray.push(array[i]);
    }

    return newArray;
}

/* --- Time function group ------------------------------------------ */

/**
 * get fresh text
 * @param time_str  time text (2016-01-31 12:00:00)
 * @returns String
 * require moment-with-locales library
 */
function getFreshText(time_str)
{
    try {
        var time = moment(time_str);
        return time.fromNow();
    }
    catch (e) {
        addConsoleLog(e);
    }

    return '';
}

/**
 * format time
 * @param String format like "YYYY-MM-DD HH:mm"
 * @param Number|Date   millisecond or date object
 * @return String
 * require  moment library
 */
function formatTime(format, time)
{
    if (!time)
    {
        return "";
    }

    var dateObj = typeof(time) === "object" ? time : new Date(time);

    return moment(dateObj).format(format);
}

/**
 * get am or pm
 * @param   String|Date|Number  time expression or date object or timestamp(millsecond)
 * @param   String  string format for time expression
 * @return  String  am or pm or empty string
 * require  moment library
 */
function getAMPM(time, format)
{
    if (!format) {
        format = 'YY-MM-dd HH:mm:ss';
    }

    switch (typeof(time)) {
        case 'object' :
            try {
                return time.getHours() < 12 ? 'am' : 'pm';
            }
            catch (e) {
                addConsoleLog(e);
            }
        case 'number' :
            var oDate = new Date(time);
            return oDate.getHours() < 12 ? 'am' : 'pm';
        case 'string' :
            var oMoment = moment(time, format);
            return parseInt(oMoment.format('H')) < 12 ? 'am' : 'pm';
    }

    return '';
}

/* timer function group -------------------------------------------- */

/**
 * print time string in a wrapper
 * it will refresh time per second
 * @param element   HTMLElement|String      HTML element or CSS path string
 * @param format    String                  date time format expression
 * require moment-with-locales library
 */
function printTime(element, format)
{
    if (!format) {
        format = $(element).data('format') || 'YYYY-MM-DD H:mm:ss';
    }

    // update per minute
    setInterval(function ()
    {
        try {
            var current_time_string = moment().format(format);
            $(element).html(current_time_string);
        }
        catch (e) {
            addConsoleLog(e);
        }
    }, 1000);
}

/**
 * get now time
 * @param String  format
 * @return String
 */
function getNowTime(format)
{
    if (!format)
    {
        format = 'YYYY-MM-DD H:mm:ss';
    }

    return moment().format(format);
}

/**
 * set a number count backwards
 * @param Object(HTMLElement)  element
 * @param Object               options
 */
function countBackwards(element, options)
{
    typeof (options) == 'object' ? null : options = {};
    var callback = options.callback || null;

    // get the number
    var number = parseInt(element.innerHTML);

    // set timer to count
    var timer = setInterval(function ()
    {
        try {
            var number = parseInt(element.innerHTML);

            number--;
            element.innerHTML = number;

            if (number <= 0) {
                clearInterval(timer);
                callback ? callback(element) : null;
            }

        }
        catch (e) {
            log(e);
        }
    }, 1000);
}

/**
 * set a element include number count backwards
 * @param Object(HTMLElement)|String  element    element object or css selector string
 * @param Object                      options
 * -- process   String      process text string with {n}
 * -- finish    String      finish text string
 * -- second    String      count backwards seconds
 * -- callback  Function    finish callback
 */
function setCountBackwards(element, options)
{
    // check jQuery library
    if (typeof($) === 'undefined') {
        log('[error] missing $ function.');
        return false;
    }

    var elementQuote = $(element);

    // check options param
    typeof (options) === 'object' ? null : options = {};

    // save default text
    var defaultText = elementQuote.html();
    elementQuote.data('default', defaultText);

    // get process text
    var processText = options.process || elementQuote.data('process');

    // get finish text
    var finishText = options.finish || elementQuote.data('finish');

    // get callback
    var callback = options.callback || null;

    // get second
    var second = options.second || parseInt(elementQuote.data('second')) || 60;

    if (second <= 0) {
        addConsoleLog('[error] setCountBackwards must give a second param.');
        return;
    }

    log('second=' + second);

    var timer = null;

    var update = (function ()
    {
        try {
            second--;

            // update content
            elementQuote.html(processText.replace('{n}', second));

            if (second <= 0) {
                // set finish text
                elementQuote.html(finishText);

                // clear timer
                clearInterval(timer);

                // callback
                callback ? callback(element) : null;
            }
        }
        catch (e) {
            log(e);
        }
    });

    update();
    // set timer to count
    timer = setInterval(update, 1000);
}

/* --- element function group ------------------------------------------ */

/**
 * get element by id  根据ID获取元素
 * @param id String  element ID
 * @returns Object(HTMLElement) | null
 */
function getElement(id)
{
    return document.getElementById(id);
}

/**
 * get elements
 * @param selector  CSS query selector
 * @returns {*}
 */
function get(selector)
{
    try {
        if (typeof(document.querySelector) != 'function') {
            addConsoleLog('querySelector is not supported in current client.');
            return false;
        }

        return document.querySelector(selector);
    }
    catch (e) {
        return false;
    }
}

/**
 * create element  创建元素
 * @param name     String  element name
 * @param options  Object  element attributes
 * @param content  Object of HTMLElement | String  element content
 * @returns Object(HTMLElement) | false
 */
function createElement(name, options, content)
{
    // create element
    var element = document.createElement(name);

    // set attributes
    if (options !== null) {
        for (var attr_name in options) {
            element.setAttribute(attr_name, options[attr_name]);
        }
    }

    // set content
    if (typeof (content) === "object") {
        element.innerHTML = content.outerHTML;
    }
    else if (typeof (content) === 'string') {
        element.innerHTML = content;
    }

    // return
    return element;
}

/**
 * print tag  输出一个 HTML 标记
 * @param name     String  element name
 * @param options  Object  element attributes
 * @param content  Object of HTMLElement | String  element content
 */
function printTag(name, options, content)
{
    var element = createElement(name, options, content);
    document.writeln(element.outerHTML);
}

/**
 * print stylesheet link
 * @param url  String
 */
function printStylesheetLink(url)
{
    document.writeln('<link rel="stylesheet" href="' + url + '"/>');
}

/**
 * load style sheet
 * @param url  String  url to style sheet file.
 */
function loadStylesheet(url)
{
    var stylesheetLink = createElement('link', {
        href : url,
        rel : "stylesheet"
    });
    document.head.appendChild(stylesheetLink);
}

/**
 * load script
 * @param url  String  url to script file.
 * @param options  Object  options for this action
 */
function loadScript(url, options)
{
    options = options || {};

    var scriptLink = createElement('script', {
        src : url
    });

    var onload = options.onload || (function(){});
    if (onload)
    {
        scriptLink.onload = onload;
    }

    document.body.appendChild(scriptLink);
}

/**
 * download a file, not display in window
 * @param url  String
 */
function downloadFile(url)
{
    if (isIE())
    {
        var imageWindow = window.open(url);
        imageWindow.onload = (function()
        {
            // open design mode
            // reference: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/designMode
            try
            {
                this.document.designMode = "ON";
            }
            catch(e)
            {
                addConsoleLog(e.message);
            }

            try
            {
                // only IE support SaveAs action
                this.document.execCommand("SaveAs");
                this.close();
            }
            catch(e)
            {
                addConsoleLog(e.message);
            }
        });
        try
        {
            if (imageWindow.document.readyState == "complete")
            {
                imageWindow.onload();
            }
        }
        catch(e)
        {
            addConsoleLog(e.message);
            imageWindow.onload();
        }
    }
    else
    {
        var linkElm = createElement('a', {
            href : url,
            target : '_blank',
            download : ''
        });
        linkElm.style.display = 'none';
        document.body.appendChild(linkElm);
        linkElm.click();
        linkElm = null;
    }

}

/**
 * set element height equal to width  设置元素高度等于宽度
 * @param element Object of HTMLElement
 */
function setHeightEqualToWidth(element)
{
    element.style.height = element.offsetWidth + "px";
}

/**
 * set image fill
 * @param   image   Object(HTMLImageElement)    image element
 */
function setImageFill(image)
{
    image.onload = (function ()  // set 'onload' event
    {
        // get parent inner size
        var wrapper_width = $(this.parentNode).innerWidth();
        var wrapper_height = $(this.parentNode).innerHeight();

        this.style.width = '100%';
        this.style.height = 'auto';

        // wrapper has height limit and image height less than warpper height
        if (wrapper_height > 0 && this.height < wrapper_height) {
            this.style.width = 'auto';
            this.style.maxWidth = 'none';
            this.style.height = '100%';
        }

    });

    // check if loaded
    if (image.width > 0 && image.height > 0) // already loaded
    {
        image.onload();
    }

}

/**
 * set a element middle position in his parent
 * @param  String|Array  element CSS selector path or array
 * @returns boolean
 */
function setElementMiddlePosition(element)
{
    // check param type
    if (typeof(element) === 'string')
    {
        var elementQuery = $(element);
        if (elementQuery.length)
        {
            element = elementQuery[0];
        }
        else
        {
            return false;
        }
    }

    // get parent
    var parent = element.parentNode;

    // set
    $(parent).css('overflow', 'hidden');
    $(element).css('overflow', 'hidden');
    var parentHeight = parent.offsetHeight;
    var elementHeight = element.offsetHeight;

    // set top margin
    var topMargin = (parentHeight - elementHeight) / 2;
    $(element).css('margin-top', topMargin + 'px');

    return true;
}

/**
 * load a image
 * @param url       String  image url
 * @param options   Object
 * @returns Object(Image)
 */
function loadImage(url, options)
{
    var image = new Image;

    typeof (options) === 'object' ? null : options = {};
    var onerror = options.onerror ? options.onerror : null;
    var onload = options.onload ? options.onload : null;
    var onabort = options.onabort ? options.onabort : null;

    onerror ? image.onerror = onerror : null;
    onload ? image.onload = onload : null;
    onabort ? image.onabort = onabort : null;

    image.src = url;

    return image;
}

/* --- Image function group ---------------------------------------- */

/**
 * create image object  创建图片
 * @param String url
 * @param null|Array options  element attributes
 * @returns Object of Image
 */
function createImage(url, options)
{
    // create new
    var image = new Image();

    if (typeof (options) === "undefined") {
        options = new Array();
    }
    for (var i in options) {
        image[i] = options[i];
    }

    image.src = url;

    return image;
}

/**
 * set image centered fill
 * @param image Object(ImageHTMLElement)
 */
function setImageCenteredFill(image)
{
    // check if loaded
    if (image.complete !== true) {
        // call self again
        image.onload = (function ()
        {
            setImageCenteredFill(this);
        });
        return;
    }

    // reset max width & height rule
    image.style.maxHeight = "none";
    image.style.maxWidth = "none";
    image.style.width = "auto";
    image.style.height = "auto";

    image_width = image.offsetWidth;
    image_height = image.offsetHeight;

    // get parent
    var parent = image.parentNode;

    container_width = parent.offsetWidth;
    container_height = parent.offsetHeight;

    if (container_width / container_height < image_width / image_height) {
        image.style.height = '100%';
        image.style.width = 'auto';
        image.style.marginLeft = (container_width - image.offsetWidth) / 2 + 'px';
    }
    else {
        image.style.height = 'auto';
        image.style.width = '100%';
        image.style.marginTop = (container_height - image.offsetHeight) / 2 + 'px';
    }

}

/* --- Multimedia function group ------------------------------------------------ */

/**
 * check audio supported  检查音频支持
 * @param coding String  coding name
 * @return Bool  true if supported or false if not supported
 */
function checkAudio(coding)
{
    var audio = createAudio();
    if (audio === false) {
        return false;
    }
    if (audio.canPlayType("audio/" + coding)) {
        return true;
    }
    return false;
}

/**
 * check a file name is video format
 * @param   String  file name
 * @return  boolean
 */
function isVideo(name)
{
    videoFormatList = ["webm","mp4"];
    for (var i=0; i<videoFormatList.length; i++)
    {
        if (name.substr(0-videoFormatList[i].length) === videoFormatList[i])
        {
            return true;
        }
    }

    return false;
}

/**
 * check if current browser supports full screen
 * @param name  String  element name, default is video.
 * @return boolean
 */
function supportsFullScreen(name)
{
    name ? null : name = 'video';

    var element = createElement(name);

    return element.requestFullscreen |
        element.webkitRequestFullscreen |
        element.mozRequestFullScreen |
        element.msRequestFullscreen |
        element.oRequestFullscreen;
}

/**
 * set a video element full screen
 * @param videoElement  HTMLElement
 * @returns boolean
 */
function setFullScreenVideo(videoElement)
{
    try
    {
        if(videoElement.requestFullscreen)
        {
            videoElement.requestFullscreen();
            return true;
        }
        else if(videoElement.mozRequestFullScreen)
        {
            videoElement.mozRequestFullScreen();
            return true;
        }
        else if(videoElement.msRequestFullscreen)
        {
            videoElement.msRequestFullscreen();
            return true;
        }
        else if(videoElement.oRequestFullscreen)
        {
            videoElement.oRequestFullscreen();
            return true;
        }
        else if(videoElement.webkitRequestFullscreen)
        {
            videoElement.webkitRequestFullScreen();
            return true;
        }
    }
    catch (e)
    {
        addConsoleLog(e);
    }

    return false;
}

/**
 * set auto check video to play
 * @param  String|HTMLElement  element
 * @return boolean
 */
function setAutoCheckVideoToPlay(element)
{
    if ( typeof(element) === 'string' )
    {
        var elementQuery = $(element);
        if (elementQuery.length)
        {
            element = elementQuery[0];
        }
        else
        {
            return false;
        }
    }

    if (element.tagName.toLowerCase() !== 'video')
    {
        addErrorLog('element param is not a video element.');
        return false;
    }

    setInterval(function()
    {
        if (element.paused)
        {
            element.play();
        }

    }, 1000);

    return true;
}

/**
 * set some element take turns to show
 * @param  String|Array  elementList
 * @param  Object        options
 *   interval : turn interval (second), default 10
 *   number : show count one time, default one
 * @return number  timer quote
 */
function setTakeTurns(elementList, options)
{
    var interval = options.interval || 10;
    var number = options.number || 1;

    if (getDebugStatus() && existDebuggingContent('setTakeTurns'))
    {
        addDebugLog('interval=' + interval);
        addDebugLog('number=' + number);
    }

    var timer = setInterval(function()
    {
        var list = typeof(elementList) === 'string' ?
            $(elementList) : elementList;

        // get hidden item count
        var count = list.length;
        var hideCount = list.filter(':hidden').length;

        hideCount += number;
        if (hideCount >= count)
        {
            hideCount = 0;
        }

        if (getDebugStatus() && existDebuggingContent('setTakeTurns'))
        {
            addDebugLog('interval=' + interval);
            addDebugLog('number=' + number);
            addDebugLog('count=' + count);
            addDebugLog('hideCount=' + hideCount);
        }

        // hide some element
        list.show().filter(':lt(' + hideCount + ')').hide();

    }, interval * 1000);

    return timer;
}

/**
 * set take turn to display some image
 * @param wrapper  HTMLElement|String  element object or CSS path string
 * @param interval  Number
 * @return
 */
function setTakeTurnDisplayImage(wrapper, interval)
{
    wrapper = $(wrapper);

    interval ? null : interval = 5;

    // find image items
    var imageItems = wrapper.find('.imageItem');
    if (imageItems.length < 1)
    {
        return;
    }

    // remove hidden class, and display first item.
    imageItems.removeClass('hidden').hide().eq(0).show();

    // create a timer
    setInterval(function(){
        var imageItems = wrapper.find('.imageItem');
        var visibleItems = imageItems.filter(':visible');
        var currentIndex = imageItems.index(visibleItems);
        currentIndex++;
        if (currentIndex >= imageItems.length)
        {
            currentIndex = 0;
        }

        // hide and after display next image
        visibleItems.fadeOut('fast', function(){
            imageItems.eq(currentIndex).fadeIn();
        });

    }, interval * 1000);
}

/**
 * set video play list
 * @param element   HTMLElement|String  element object or id
 * @param list      Array               array of video url string
 */
function setVideoPlaylist(element, list)
{
    if (typeof (element) === "string")
    {
        element = getElement(element);
        if (!element) { return; }
    }

    try
    {
        if (list.length === 0)
        {
            // stop and remove file
            element.pause();
            element.src = '';
        }

        // play first video
        element.pause();
        element.src = list[0];
        $(element).data('currentIndex', 0);
        element.load();
        element.play();

        // auto load next video when play end
        element.onended = (function()
        {
            var fileSrc = this.src;
            var index = $(element).data('currentIndex') || '0';
            index = parseInt(index);
            index++;

            if (index >= list.length)
            {
                index = 0;
            }

            this.pause();
            this.src = list[index];
            $(element).data('currentIndex', index);
            this.load();
            this.play();
        });
    }
    catch(e)
    {
        addConsoleLog(e);
    }

}



/**
 * check canvas supported  检查画布元素支持
 * @returns boolean
 */
function canvasSupport()
{
    return typeof (createElement('canvas').getContext) === 'function';
}

/* --- URL function group ------------------------------------------ */

/**
 * add url param  添加网址参数
 * @param url String  网址
 * @param name String  param name  参数名
 * @param value String  param alue  参数的值
 */
function addUrlParam(url, name, value)
{
    var new_url = url;
    if (url.indexOf("?") < 0) {
        new_url += "?";
    }
    else {
        new_url += "&";
    }
    new_url += name + "=" + value;
    return new_url;
}

/**
 * get url param  获取网址参数
 * @param name String  param name  参数名
 * @returns fixed  param value  参数的值
 */
function getUrlParam(name)
{

    var default_value = arguments[1] ? arguments[1] : null;

    // get query string
    var query_string = location.search.replace('?', '');

    // no any param
    if (!query_string.length) {
        return default_value;
    }

    // 以 & 分割字符串(a=1&b=2) to ['a=1', 'b=2']
    var url_query_params = query_string.split("&");

    var index_name = -1;
    for (var i = 0; i < url_query_params.length; i++) {

        index_name = url_query_params[i].indexOf(name + "=");

        // 参数名开头
        if (index_name === 0) {
            return url_query_params[i].substring(index_name + 1 + name.length);
        }
    }

    return default_value;
}



/* --- Window function group ------------------------------------------- */

/**
 * Get scroll top  获取窗口视图区域到顶部的滚动距离
 * @returns Number|false
 */
function getScrollTop()
{
    if (document.documentElement && document.documentElement.scrollTop)		// For standard
    {
        return document.documentElement.scrollTop;
    }
    else if (document.body)		// For Internet Explorer old version
    {
        return document.body.scrollTop;
    }
    return false;
}

/**
 * Get scroll height  获取窗口视图区域的高度
 * @returns Number
 */
function getScrollHeight()
{
    if (document.documentElement && document.documentElement.scrollHeight)		// For standard
    {
        return document.documentElement.scrollHeight;
    }
    else if (document.body)		// For Internet Explorer
    {
        return document.body.scrollHeight;
    }
    return false;
}

/**
 * page down wrapper
 * @param   HTMLElement|String  element     element object or css selector
 */
function pageDown(element)
{
    if (typeof(element) === "string") {
        var elementQueryList = $(element);
        if (!elementQueryList.length) {
            return;
        }

        element = elementQueryList[0];
    }

    if ( getDebugStatus() && existDebuggingContent('pageDown') )
    {
        addDebugLog('scroll height: ' + element.scrollHeight);
        addDebugLog('offset height: ' + element.offsetHeight);
    }

    // check if overflow
    if (element.scrollHeight > element.offsetHeight) {

        // check scroll top
        if (element.scrollTop < element.scrollHeight - element.offsetHeight) {
            element.scrollTop += element.offsetHeight;
        }
        else {
            element.scrollTop = 0;
        }
    }
}

/**
 * set a wrapper auto page down
 * @param   HTMLElement|String  element     element object or css selector
 * @param   Number              interval    interval time (second)
 */
function setAutoPageDown(element, interval)
{
    if (!interval) {
        interval = 10;
    }

    window.setInterval(function ()
    {
        pageDown(element);
    }, interval * 1000)
}

/**
 * set a use marquee effect
 * @param element  Object(HTMLElement)|String   element node quote or CSS selector string
 * @param speed
 * @return boolean|number  'false' if fail, or interval quote if success.
 */
function setMarquee(element, speed)
{
    if (typeof(element) === "string") {
        var elementQueryList = $(element);
        if (!elementQueryList.length) {
            return;
        }

        element = elementQueryList[0];
    }

    if (!interval) {
        interval = 10;
    }

    var childList = element.find();

    var timer = window.setInterval(function ()
    {
        var step = speed / 1000;

        if ( getDebugStatus() && existDebuggingContent('setMarquee') )
        {
            addDebugLog('scroll height: ' + element.scrollLeft);
            addDebugLog('offset height: ' + element.offsetWidth);
            addDebugLog('scroll top: ' + element.scrollTop);
        }

        // check if overflow
        if (element.scrollHeight > element.offsetHeight)
        {
            // check scroll top
            if (element.scrollTop < element.scrollHeight - element.offsetHeight) {
                element.scrollTop += element.offsetHeight;
            }
            else {
                element.scrollTop = 0;
            }
        }
    }, 1);

    return timer;
}

/**
 * get window height  获取窗口的高度
 * @returns Number
 */
function getWindowHeight()
{
    if (typeof($) !== 'undefined')
    {
        return $(window).outerHeight();
    }

    // standard API: window.innerHeight
    // wrong API: $(window).height() when body height < window height, value = body height
    var height = window.innerHeight
        || window.height;               // IE old version

    return height ? height : 0;
}

/**
 * get window width  获取窗口的宽度
 * @returns Number
 */
function getWindowWidth()
{
    if (typeof($) !== 'undefined')
    {
        return $(window).outerWidth();
    }

    // standard API: window.innerWidth
    // wrong API: $(window).width()
    var width = window.innerWidth
        || window.width;            // IE old version

    return width ? width : 0;
}

/**
 * get body element height
 * @returns Number
 */
function getBodyHeight()
{
    // standard API: document.body.offsetHeight, document.documentElement.offsetHeight
    var bodyHeight = document.body.offsetHeight ||
        document.documentElement.offsetHeight ||
        document.body.clientHeight ||               // IE old version
        $(document.body).height();                   // jQuery API

    return bodyHeight ? bodyHeight : 0;
}

/**
 * set body min height
 * @returns boolean
 */
function setBodyMinHeight()
{
    // set window resize event
    $(window).on('resize', function ()
    {
        // reset height to auto
        $(document.body).css('height', 'auto');

        var bodyHeight = getBodyHeight();
        var windowHeight = getWindowHeight();

        if ( getDebugStatus() && existDebuggingContent('setBodyMinHeight') )
        {
            addDebugLog('bodyHeight= ' + bodyHeight);
            addDebugLog('windowHeight= ' + windowHeight);
        }

        // can not get height
        if (bodyHeight === 0 || windowHeight === 0) {
            return false;
        }

        if (bodyHeight < windowHeight) {
            $(document.body).css('height', windowHeight + 'px');
        }

    }).trigger('resize');
}

/**
 * check a wrapper if is overflow height
 * @param  String|HTMLObject  selector  CSS selector string of wrapper or HTML object
 * @return boolean
 */
function isOverflowHeight(selector)
{
    var wrapperList = $(selector);
    if (!wrapperList.length) {
        return false;
    }

    var wrapper = wrapperList[0];

    var childrenList = wrapper.children;
    var contentHeightCount = 0;
    for (var i = 0; i < childrenList.length; i++) {
        contentHeightCount += parseInt($(childrenList[i]).css('margin-top').replace('px', ''));
        contentHeightCount += childrenList[i].offsetHeight;
        contentHeightCount += parseInt($(childrenList[i]).css('margin-bottom').replace('px', ''));
    }

    if (contentHeightCount > wrapper.offsetHeight) {
        return true
    }
    else {
        return false;
    }
}

function createDialog(options)
{

}

/**
 * adjust dialog width & height
 * @param dialog  HTMLElement
 */
function adjustDialog(dialog)
{
    // get window height
    var windowHeight = getWindowWidth();

    // get dialog height
    var dialogHeight = $(dialog).outerHeight();

    var dialogHeaderHeight = $(dialog).find('.dialog_header').outerHeight();
    var dialogFooterHeight = $(dialog).find('.dialog_footer').outerHeight();

    var dialogBodyHeight = dialogHeight - dialogHeaderHeight - dialogFooterHeight;
    $(dialog).find('.dialog_body').css("height", dialogBodyHeight + 'px');
}

/**
 * center dialog in current window
 * @param dialog  HTMLElement
 */
function centerDialog(dialog)
{
    // reset margin
    $(dialog).css({
        'margin'	: '0',
        'left'      : '0',
        'top'       : '0'
    });

    var windowWidth		= getWindowWidth();
    var windowHeight	= getWindowHeight();

    var dialogWidth		= $(dialog).outerWidth();
    var dialogHeight	= $(dialog).outerHeight();

    var leftOffset		= (windowWidth - dialogWidth) / 2;
    var topOffset		= (windowHeight - dialogHeight) / 2;

    $(dialog).css({
        'margin-left' : '0',
        'margin-top'  : '0',
        'left'        : leftOffset + 'px',
        'top'         : topOffset + 'px'
    });
}

/**
 * initialize dialog action
 */
function initDialogAction()
{
    // close button for layer panel
    $('.layer .panel .close_button').on('click', function ()
    {
        var layer = $(this).parents('.layer');
        layer.fadeOut();
    });

    $('.dialog .close_button').on('click', function ()
    {
        var dialog = $(this).parents('.dialog');
        var layer = $(this).parents('.layer');

        if (layer.length)
        {
            layer.fadeOut();
        }
        else
        {
            dialog.fadeOut();
        }
    });
}

/**
 * open dialog
 * @param String|Object(HTMLElement)  css_selector  CSS selector string for dialog
 * @param Object  options
 * - Function onConfirm(Object dialog)  trigger when click confirm button
 * - Function onCancel(Object dialog)  trigger when click cancel button
 * - Function onShow(Object dialog)  trigger when dialog show
 */
function openDialog(css_selector, options)
{
    typeof (options) == 'object' ? null : options = {};

    var onConfirm   = options.onConfirm || function(){};
    var onCancel    = options.onCancel || function(){};
    var onShow      = options.onShow || function(){};

    var jDialog = $(css_selector);

    var jFormEle    = jDialog.find('.dialog_body form');
    var form        = jFormEle.length ? jFormEle[0] : null;

    jDialog.find('.confirmButton').on('click', function(){
        onConfirm(jDialog[0], form);
    });
    jDialog.find('.cancelButton').on('click', function(){
        onCancel(jDialog[0]);
    });

    $(css_selector).fadeIn(function(){
        onShow(jDialog[0]);
    });

    adjustDialog(jDialog[0]);
    centerDialog(jDialog[0]);
}

/**
 * close dialog
 * @param String|Object(HTMLElement)  css_selector  CSS selector string for dialog
 */
function closeDialog(css_selector)
{
    $(css_selector).fadeOut();
}

/**
 * show a message box
 * @param message  String  message text
 * @param title    String  message box title
 * @return boolean
 */
function showMessageBox(message, title)
{
    title ? null : title = '提示';

    var messageBox = $('#mainMessageBox');
    if (!messageBox)
    {
        addConsoleLog('Element #mainMessageBox not exist.');
        return false;
    }

    messageBox.find('.dialog_body').html('<p>' + message + '</p>');

    messageBox.find('.dialog_header .dialog_title').html(title);

    messageBox.fadeIn();

    centerDialog(messageBox);

    //var width = messageBox.width();
    //var marginLeft = width / 2 * -1;
    //messageBox.css('margin-left', marginLeft + 'px');

    return true;
}

/* --- Browser function group ------------------------------------------ */

/**
 * Get browser core  获取浏览器核心
 * @returns String  core name
 */
function getBrowserCore()
{
    // Find known core names from the userAgent data  搜索核心名称
    var userAgent = window.navigator.userAgent;
    var isGecko = RegExp("Gecko").test(userAgent);
    var isWebkit = RegExp("AppleWebKit").test(userAgent);
    var isPresto = RegExp("Presto").test(userAgent);
    var isTrident = RegExp("IE").test(userAgent);

    // Return result  返回结果
    if (isWebkit) {
        return "Webkit";
    }
    if (isGecko) {
        return "Gecko";
    }
    if (isPresto) {
        return "Presto";
    }
    if (isTrident) {
        return "Trident";
    }

    // Return "unknown" as unknown core  不是主流浏览器
    return "unknown";
}

/**
 * check if is IE
 * @returns boolean
 */
function isIE()
{
    return getBrowserCore() == "Trident";
}

/**
 * Get IE browser core  获取 IE 的版本
 * @returns Number
 */
function getIEsVersion()
{
    // Check whether the current browser is IE  检查是否 IE 浏览器
    var userAgent = window.navigator.userAgent;
    var isIE = userAgent.search(RegExp("MSIE [0-9.]+;"));
    if (!isIE) {
        return 0;
    }

    // Get the browser version  获取版本
    var version = userAgent.match(RegExp("MSIE [0-9]+.[0-9]+;"))[0];
    version = version.replace(RegExp("MSIE ([0-9])+.[0-9]+;"), "$1");
    return Number(version);
}

/**
 * get browser language, return lower case text like "zh-cn".
 * @return String
 */
function getBrowserLanguage()
{
    // web standard use navigator.language API, value is no case
    // and IE6-8 use navigator.browserLanguage API, value is lower case.
    var lang = '';
    try {
        lang = (navigator.language || navigator.browserLanguage).toLowerCase();
    }
    catch (e) {
        addConsoleLog(e);
        return lang;
    }

    return lang;
}

/* --- file function group ----------------------------------------- */

/**
 * check file type
 * @param file object(File)
 * @param type string
 * @returns boolean
 */
function checkFile(file, type)
{
    return file.type.indexOf(type) === 0;
}

/**
 * check file is image type
 * @param file  Object(File)
 * @returns boolean
 */
function checkFileIsImage(file)
{
    if (/image\/\w+/.test(file.type)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * check file reader supported  检查文件读取器支持
 * @returns boolean
 */
function fileReaderSupport()
{
    return typeof(FileReader) !== 'undefined';
}

/**
 * read a file
 * @param file  Object(File)
 * @param data_type  String
 * 'data_url', 'array_buffer', 'binary_string', 'text'
 * @param options  Object|null
 * 'onabort', 'onload', 'onloadend', 'onloadstart', 'onprogress'
 */
function readFile(file, data_type, options)
{
    if (!fileReaderSupport()) {
        addConsoleLog('[error] FileReader API is not supported.');
        return false;
    }

    typeof (options) === 'object' ?
        null : options = {};

    var onabort = options.onabort ? options.onabort : null;
    var onload = options.onload ? options.onload : null;
    var onloadend = options.onloadend ? options.onloadend : null;
    var onloadstart = options.onloadstart ? options.onloadstart : null;
    var onprogress = options.onprogress ? options.onprogress : null;

    // 创建文件读取器
    var reader = new FileReader();

    onabort ? reader.onabort = onabort : null;
    onload ? reader.onload = onload : null;
    onloadend ? reader.onloadend = onloadend : null;
    onloadstart ? reader.onloadstart = onloadstart : null;
    onprogress ? reader.onprogress = onprogress : null;

    switch (data_type) {
        case 'data_url' :
            reader.readAsDataURL(file);
            return true;
            break;
    }

    return false;
}

/**
 * convert image to canvas object
 * @param image     Image|String    image object or image url string
 * @param options   Object          image data options
 * @param callback  Function|null   convert success callback function
 * @returns Object(CanvasHTMLElement)|false
 */
function convertImage2Canvas(image, options, callback)
{
    // check canvas support
    if (!canvasSupport()) {
        return false;
    }

    var image_object = null;

    typeof (options) === 'object' ? null : options = {};

    var image_min_width = options.image_min_width ? options.image_min_width : -1;
    var image_min_height = options.image_min_height ? options.image_min_height : -1;
    var image_max_width = options.image_max_width ? options.image_max_width : -1;
    var image_max_height = options.image_max_height ? options.image_max_height : -1;

    if ( getDebugStatus() && existDebuggingContent('convertImage2Canvas') )
    {
        addDebugLog('image_max_width: ' + image_max_width);
        addDebugLog('image_max_height: ' + image_max_height);
    }

    // canvas size
    var canvas_width = options.canvas_width ? options.canvas_width : -1;
    var canvas_height = options.canvas_height ? options.canvas_height : -1;

    // error event
    var onerror = options.onerror ? options.onerror : null;

    if (typeof(image) === 'string') {
        image_object = new Image;
        image_object.src = image;
    }
    else {
        image_object = image;
    }

    onerror ? image_object.onerror = onerror : null;

    image_object.onload = (function ()
    {

        // 宽高比例
        var image_ratio = this.width / this.height;

        // limit size
        if (
            image_min_width > -1 ||
            image_min_height > -1 ||
            image_max_width > -1 ||
            image_max_height > -1
        ) {
            // min size limit
            if (this.width < image_min_width || this.height < image_min_height) {
                // 取最小宽度时，高度不小于最小高度
                if (image_min_width / image_ratio >= image_min_height) {
                    // 宽度取最小值，高度按比例
                    this.width = image_min_width;
                    this.height = this.width / image_ratio;
                }
                else {
                    // 高度取最小值，宽度按比例
                    this.height = image_min_height;
                    this.width = this.height * image_ratio;
                }
            }

            // max size limit
            if (image_max_width > -1 && this.width > image_max_width && image_max_height > -1 && this.height > image_max_height) {
                // 宽度和高度都超过了
                if (image_max_width / image_ratio <= image_max_height)  // 取最大宽度时，高度不超过最大高度
                {
                    // 宽度取最大值，高度按比例
                    this.width = image_max_width;
                    this.height = this.width / image_ratio;
                }
                else {
                    // 高度取最大值，宽度按比例
                    this.height = image_max_height;
                    this.width = this.height * image_ratio;
                }
            }
            else if (image_max_width > -1 && this.width > image_max_width) {
                // 只是宽度超过了
                this.width = image_max_width;
                this.height = this.width / image_ratio;
            }
            else if (image_max_height > -1 && this.height > image_max_height) {
                // 只是高度超过了
                this.height = image_max_height;
                this.width = this.height * image_ratio;
            }
        }

        // create canvas element
        var canvas = createElement('canvas');
        //canvas.style.display = 'block';
        var ctx = canvas.getContext("2d");

        // set canvas size
        canvas.width = canvas_width > -1 ? canvas_width : this.width;
        canvas.height = canvas_height > -1 ? canvas_height : this.height;

        // 画图后，重设画布尺寸裁剪
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

        // success callback
        if (callback) {
            callback(canvas);
        }

    });
    /* end image onload event */
}

/* --- Form function group ----------------------------------------------- */

/**
 * get form by element
 * @param element   Object(HTMLElement)
 * @returns Object(HTMLElement)|null
 */
function getForm(element)
{
    return element.form ? element.form : null;
}

/**
 * get form data
 * @param   form    Object(HTMLFormElement)
 * @returns Object|false
 */
function getFormData(form)
{
    if (typeof(form.elements) === 'undefined') {
        return false;
    }

    var data = {};

    // init key list
    for (var i = 0; i < form.elements.length; i++)
    {
        var type = form.elements[i].type;
        var name = form.elements[i].name;

        if (name === "")
        {
            continue;
        }

        switch (type)
        {
            case 'checkbox' :
                data[form.elements[i].name] = new Array(); break;
            default :
                data[form.elements[i].name] = "";
        }
    }

    // get value
    for (var i = 0; i < form.elements.length; i++)
    {
        var type = form.elements[i].type;
        var name = form.elements[i].name;
        var value = form.elements[i].value;

        if (name === "")
        {
            continue;
        }

        switch (type)
        {
            case 'text' :
                data[name] = value; break;
            case 'radio' :
                // check selected
                if (form.elements[i].checked)
                {
                    data[name] = value;
                }
                break;
            case 'checkbox' :
                // checkbox's data is a array
                if (form.elements[i].checked)
                {
                    data[name].push(value);
                }
                break;
            default :
                data[name] = value;
        }
    }

    return data;
}

/**
 * set form control
 * @param form  Object(HTMLElement)|String  form dom quote or ID
 * @param name  String                      form control's name property
 * @param value                             form control's new value
 * @return boolean
 */
function setFormControl(form, name, value)
{
    // get element by ID
    if (typeof (form) === 'string') {
        var formId = form;
        form = document.getElementById(form);
        if (!form) {
            addErrorLog('form dom with id:' + formId + ' not found.');
            return false;
        }
    }

    // get form controls
    var controls = $(form).find('*[name="' + name + '"]');

    for (var controlIndex = 0; controlIndex < controls.length; controlIndex++)
    {
        var controlItem = controls[controlIndex];

        // check element name
        switch (controlItem.nodeName.toLowerCase())
        {
            case 'input' :
                switch(controlItem.type)
                {
                    case 'checkbox':
                    case 'radio' :
                        controlItem.value == value ? controlItem.checked = true : null;
                        break;
                    case 'password' :
                        if ( getDebugStatus() && existDebuggingContent('setFormControl') )
                        {
                            addDebugLog('skip inputbox type:password.');
                        }
                        break;
                    case 'file' :
                        if ( getDebugStatus() && existDebuggingContent('setFormControl') )
                        {
                            addDebugLog('skip inputbox type:file.');
                        }
                        break;
                    case 'text' :
                    default :   // other like email, number, url ...
                        controlItem.value = value;
                }
                break;
            case 'textarea' :
                controls[controlIndex].innerHTML = value;
                break;
            case 'select' :
            default :   // extension for the future
                controlItem.value = value;
        }
    }

    return true;
}

/**
 * check form is validate
 * @param   form    Object(HTMLFormElement) | String    form element or id
 * @returns boolean
 */
function checkForm(form)
{
    // get element by ID
    if (typeof (form) === 'string') {
        var formId = form;
        form = document.getElementById(form);
        if (!form) {
            addErrorLog('form dom with id:' + formId + ' not found.');
            return false;
        }
    }

    for (var i=0; i<form.length; i++)
    {
        var required = form[i].required || false;
        var value = form[i].value;

        if (required && value === "")
        {
            form[i].focus();
            return false;
        }
    }

    return form.checkValidity();
}

/**
 * check a form element is locked
 * @param   form    Object(HTMLElement)|String       form element or ID
 * @returns boolean
 */
function formIsLocked(form)
{
    // get element by ID
    if (typeof (form) === 'string') {
        form = document.getElementById(form);
        if (!form) {
            return false;
        }
    }

    // undefined return false
    if (typeof (form.dataset.lock) === 'undefined') {
        // set default value
        form.dataset.lock = 'off';
        return false;
    }

    return form.dataset.lock === 'on';

}
var isLockedForm = formIsLocked;

/**
 * lock form
 * set a lock data
 * @param   form    Object|String       form element or ID
 */
function lockForm(form)
{
    // get element by ID
    if (typeof (form) === 'string') {
        var form = document.getElementById(form);
        if (!form) {
            return;
        }
    }

    form.dataset.lock = "on";
}

/**
 * unlock form
 * set a lock data
 * @param   form    Object|String       form element or ID
 */
function unlockForm(form)
{
    // get element by ID
    if (typeof (form) === 'string') {
        var form = document.getElementById(form);
        if (!form) {
            return;
        }
    }

    form.dataset.lock = 'off';
}

/**
 * set form node no more data
 * @param form  String|Object(HTMLElement)  form ID or dom quote
 */
function formNoMoreData(form)
{
    // get element by ID
    if (typeof (form) === 'string') {
        form = document.getElementById(form);
        if (!form) {
            return;
        }
    }

    form.dataset.noMoreData = "on";
}
var setFormNoMoreData = formNoMoreData;

/**
 * set form has more data
 * @param form  String|Object(HTMLElement)  form ID or dom quote
 */
function formMoreData(form)
{
    // get element by ID
    if (typeof (form) === 'string') {
        form = document.getElementById(form);
        if (!form) {
            return;
        }
    }

    form.dataset.noMoreData = 'off';
}
var setFormHasMoreData = formMoreData;

/**
 * check if the form has more data
 * @param form  String|Object(HTMLElement)  form ID or dom quote
 * @returns boolean
 */
function formHasMoreData(form)
{
    // if form is a string, then get element by ID
    if (typeof (form) === 'string') {
        form = document.getElementById(form);
        if (!form) {
            return true;
        }
    }

    if (typeof (form.dataset.noMoreData) !== 'undefined') {
        // set default value
        form.dataset.noMoreData = 'off';

        return form.dataset.noMoreData === 'off';
    }

    // default has more data
    return true;
}
var isFormHasMoreData = formHasMoreData;

/**
 * add some options to selectbox
 * @param selectbox     Object(HTMLElemet)
 * @param list          Array
 */
function selectboxAddOptions(selectbox, list)
{
    if (typeof(selectbox) === "string")
    {
        var selectboxJq = $(selectbox);
        if (!selectboxJq.length)
        {
            return;
        }
        selectbox = selectboxJq[0];
    }

    for (var i=0; i<list.length; i++)
    {
        var option = createElement('option', {
            value : list[i].id
        });
        option.innerHTML = list[i].name;
        selectbox.appendChild(option);
    }
}

/**
 * set check all action
 * @param   checkbox    Object(HTMLInputElement)
 */
function setCheckAllAction(checkbox)
{
    checkbox.onchange = (function ()
    {
        // get check status
        var check_status = this.checked;

        // get form's input controls
        var form_input_list = this.form.getElementsByTagName('input');

        // traversal
        for (var i = 0; i < form_input_list.length; i++) {
            if (form_input_list[i].type === 'checkbox') {
                form_input_list[i].checked = check_status;
            }
        }
    });
}

/**
 * set checkbox a action to check all children
 * @param checkbox  HTMLElement  checkbox input
 */
function setCheckAllChildrenAction(checkbox)
{
    $(checkbox).on('change', function()
    {
        // get status
        var status = this.checked;

        // get parent node, it maybe is label element
        var parent = this.parentNode;
        if (parent.nodeName.toLowerCase() === "label")
        {
            parent = parent.parentNode;
        }

        // get children list and checkboxes
        var childrenList = $(parent).find('ul');
        var childrenCheckboxes = childrenList.find('input[type="checkbox"]');

        // update checkboxes's status
        for (var i=0; i<childrenCheckboxes.length; i++)
        {
            childrenCheckboxes[i].checked = status;
        }

    });
}

/**
 * set a textarea element auto increase height
 * @param  object(HTMLElement)  textarea
 */
function setTextareaAutoIncreaseHeight(textarea)
{
    $(textarea).on("input", function(){
        if (this.offsetHeight < this.scrollHeight)
        {
            this.style.height = this.scrollHeight + "px";
        }
    });
}

/**
 * init importing file button
 * @param element   String|HTMLElement  css selector for element or element quoto
 * @param options   Object
 * @return      Object(ImportHelper)
 */
function initImportButton(element, options)
{
    var defaultOptions = {
        type : 'file'
    };

    typeof(options) === 'object' ? null : options = {};
    var name = options.name || '';

    var realOptions = mergeObject(defaultOptions, {
        name : name
    });

    var helper = {
        name : 'ImportHelper',
        control : createElement('input', realOptions)
    };

    $(helper.control).hide();
    document.body.appendChild(helper.control);

    $(helper.control).ajaxfileupload(options);

    $(element).on('click', function(){
        $(helper.control).trigger('click');
    });

    return helper;
}

/**
 * render a pagination panel
 * @param   container   container for append
 * @param   options     panel options
 */
function renderPaginationPanel(container, options)
{
    var pagination_list = $('<ul class="pagination">\
        <li class="previous_page_item disabled">\
            <a class="previous_page_link" href="javascript:;" aria-label="上一页">\
                <span aria-hidden="true">上一页</span>\
            </a>\
        </li>\
        <li class="active current"><a href="javascript:;">1</a></li>\
        <li class="next_page_item">\
            <a class="next_page_link" href="javascript:;" aria-label="下一页">\
                <span aria-hidden="true">下一页</span>\
            </a>\
        </li>\
    </ul>');

    $(container).append(pagination_list);

    return pagination_list[0];
}

/**
 * bind pagination panel action  绑定分页面板的动作
 * 分页元素需要用 Form 标签包含，且 Form 标签包含 ".form_page" 的隐藏类型的 Input 元素，用于更改页码。
 * @param   element     Object(HTMLElement)
 */
function bindPaginationPanelAction(element)
{
    var previous_page_link = $(element).find('.previous_page_link');
    var next_page_link = $(element).find('.next_page_link');
    var current_page_link = $(element).find('.current a');

    // set previous page link click action
    previous_page_link.on('click', function ()
    {

        // check form
        var form = $(this).parents('form');
        if (!form.length) {
            return;
        }

        // get current page number
        var page = parseInt($(form).find('.form_page').val());
        page ? null : page = 1;

        // set previous page number
        if (page === 1) {
            return;
        }
        page--;
        $(form).find('.form_page').val(page);
        current_page_link.html(page);

        // submit form
        form.submit();

    }); // End .previous_page_link click event function

    // set next page link click action
    next_page_link.on('click', function ()
    {

        // check form
        var form = $(this).parents('form');
        if (!form.length) {
            return;
        }

        // get current page number
        var page = parseInt($(form).find('.form_page').val());
        page ? null : page = 1;

        // get page count
        var pagination = $(this).parents('.pagination');
        var page_count = parseInt(pagination.data('count'));
        if (page_count && page === page_count)  // 已经是最后1页了
        {
            if ( getDebugStatus() && existDebuggingContent('bindPaginationPanelAction') )
            {
                addDebugLog('已经是最后1页了。');
            }
            return false;
        }

        // set previous page number
        page++;
        $(form).find('.form_page').val(page);
        current_page_link.html(page);

        // submit form
        form.submit();

    }); // End .next_page_link click event function

}

/**
 * update pagination panel
 * @param   element     Object(HTMLElement)     pagination panel element
 * @param   options     Object                  pagination panel data
 */
function updatePaginationPanel(element, options)
{
    var message = '[info] 更新页码面板；';

    var current_page = options.page ? options.page : parseInt($(element).find('.current a').html());
    current_page ? null : current_page = 1;
    var page_count = options.count ? options.count : null;

    // update current page
    message += '当前页码：' + current_page + '；';
    $(element).find('.current a').html(current_page);

    if (current_page === 1)     // 第1页禁用上一页按钮
    {
        $(element).find('.previous_page_item').addClass('disabled');
    }
    else {
        $(element).find('.previous_page_item').removeClass('disabled');
    }

    // set page count
    if (page_count) {
        message += '总页数：' + page_count + '。';
        $(element).data('count', page_count);

        if (current_page === page_count)    // 最后1页禁用下一页按钮
        {
            $(element).find('.next_page_item').addClass('disabled');
        }
        else {
            $(element).find('.next_page_item').removeClass('disabled');
        }
    }

    if ( getDebugStatus() && existDebuggingContent('updatePaginationPanel') )
    {
        addDebugLog(message);
    }
}

/**
 * initialize textbox actions
 * @param   textbox     Object(HTMLElement)     textbox element
 * @param   options     Object                  action option
 *   change : function(textbox, text, length)
 *   input  : function(textbox, text, length)
 *     param textbox   textbox element
 *     param text      textbox text
 *     param length    textbox text length
 */
function initTextboxActions(textbox, options)
{
    var change_callback = options.change ? options.change : null;
    var input_callback = options.input ? options.input : null;

    if (change_callback) {
        textbox.onchange = (function ()
        {

            var text = this.value;
            var length = text.length;

            change_callback(this, text, length);
        });
    }

    if (input_callback) {
        textbox.oninput = (function ()
        {

            var text = this.value;
            var length = text.length;

            input_callback(this, text, length);
        });
    }

}

/**
 * add a auto complete value to inputbox
 * this function simulate a form submit action
 * @param name        inputbox data name
 * @param value        inputbox value
 * @Author  Kevin
 * @date    2017-01-23
 */
function addInputboxAutocompleteValue(name, value)
{
    var form = document.createElement('form');
    form.action = 'javascript:;';
    form.method = 'post';
    form.style.display = 'none';

    var inputbox = document.createElement('input');
    inputbox.type = 'text';
    inputbox.name = name;
    inputbox.value = value;

    form.appendChild(inputbox);

    document.body.appendChild(form);

    form.submit();
    document.body.removeChild(form);
}

/**
 * check if current browser support cross origin
 * @returns boolean
 */
function isSupportCrossOrigin()
{
    if (typeof(XMLHttpRequest) == "undefined")
    {
        return false;
    }

    var xhr = new XMLHttpRequest();
    if (typeof(xhr.withCredentials) == "undefined")
    {
        return false;
    }
    else
    {
        return true;
    }
}

/**
 * general Ajax error callback function
 * @param  XMLHttpRequest
 * @param  textStatus
 * @param  errorThrown
 */
function generalAjaxErrorCallback(XMLHttpRequest, textStatus, errorThrown)
{
    var error_text = "连接失败\n";
    error_text += XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText + "\n";
    addConsoleLog(error_text);
}

/**
 * ajax
 * Ajax request API
 * @param api_name  String
 * @param data  null|Object
 * @param callback  null|Function
 */
var ajax = (function (api_name, data, callback)
{

    if (typeof(api) === 'undefined') {
        addConsoleLog('[error] api variable is undefined.');
        return false;
    }

    var api_url = api[api_name].url;
    var url = base_url + api_url;
    var type = api[api_name].type;

    $.ajax({
        'url' : url,
        'type' : type,
        'dataType' : 'json',
        'data' : data,
        'error' : ajaxErrorCallback,
        'success' : function (result)
        {
            if (callback) {
                callback(result);
            }
        }
    });
});

/* --- Dialog group ----------------------------------------------------------- */

/**
 * create a dialog  创建一个对话框
 * @param title  String  dialog title  对话框标题
 * @param text  String  dialog content text  对话框内容文本
 * argument 3  Object  dialog options  对话框参数
 * @return Object(DivHTMLElement)  对象（DOM）
 */
function createDialog(title, text)
{
    // get arguments
    var options = arguments[3] ? arguments[3] : new Object();

    // set dialog attributes
    var dialog_attributes = {
        "class" : "dialog"
    };
    if (options.id) {
        dialog_attributes.id = options.id;
    }

    // create new dialog
    var dialog = createElement("div", dialog_attributes);

    // dialog header
    var dialog_header = createElement("div", {
        "class" : "dialog_header"
    });
    dialog.appendChild(dialog_header);

    // dialog title
    var dialog_title = createElement("div", {
        "class" : "dialog_title"
    }, title);
    dialog_header.appendChild(dialog_title);

    // dialog buttons
    var dialog_buttons = createElement("div", {
        "class" : "dialog_buttons"
    });
    dialog_header.appendChild(dialog_buttons);
    var button_close = createElement("button", {
        "class" : "button_close dialog_close"
    }, "x");
    dialog_buttons.appendChild(button_close);
    button_close.onclick = (function ()
    {
        var dialog = this.parentNode.parentNode.parentNode;
        dialog.parentNode.removeChild(dialog);
    });

    // dialog body
    var dialog_body = createElement("div", {
        "class" : "dialog_body"
    }, text);
    dialog.appendChild(dialog_body);

    // return
    return dialog;
}

/**
 * remove dialog  移除对话框
 * @param dialog  String|Object(HTMLElement)  dialog ID or dialog node  对话框ID或对话框节点
 */
function removeDialog(dialog)
{
    if (!dialog || !dialog.parentNode) {
        return;
    }

    // get dialog node
    if (typeof(dialog) !== "object") {
        dialog = getElement(dialog);
    }

    // remove
    dialog.parentNode.removeChild(dialog);
}

/**
 * create a progress dialog  创建一个新的进度条对话框
 * @param id  String  dialog ID string  对话框ID
 * @param percent  Number  progress percent  进度条百分比
 */
function createProgressDialog(id, percent)
{
    // create a wrapper
    var dialog = createElement("div", {
        "id" : id,
        "class" : "dialog dialog_progress"
    });

    // create a wrapper to contain progress
    var box_progress = createElement("div", {
        "class" : "box_progress"
    });
    dialog.appendChild(box_progress);

    // create progress
    var progress = createElement("div", {
        "class" : "progress"
    });
    box_progress.appendChild(progress);

    // create progress percent display
    var progress_bar = createElement("div", {
        "class" : "progress-bar progress-bar-striped active"
    });
    progress.appendChild(progress_bar);

    // set width
    progress_bar.style.width = percent + "%";

    // display
    document.body.appendChild(dialog);
}

/**
 * update progress dialog  更新一个进度条对话框
 * @param id  String  dialog ID string  对话框ID
 * @param percent  Number  progress percent  进度条百分比
 * @returns boolean  true if success or false if fail  成功返回true，失败返回false
 */
function updateProgressDialog(id, percent)
{
    // get dialog node
    var dialog = getElement(id);
    if (!dialog) {
        log("dialog (" + id + ") not found.");
        return false;
    }

    var progress_bar = null;
    if (document.getElementsByClassName) {
        var list_progress_bar = dialog.getElementsByClassName("progress-bar");
        if (list_progress_bar.length) {
            progress_bar = list_progress_bar[0];
            progress_bar.style.width = percent + "%";
        }
    }
    else {
        $(dialog).find(".progress-bar").css("width", percent + "%");
    }

    return true;
}

/**
 * remove progress dialog  移除进度条对话框
 * @param id String  dialog ID string  对话框ID
 * @returns boolean  true if success or false if fail  成功返回true，失败返回false
 */
function removeProgressDialog(id)
{
    // get dialog node
    var dialog = getElement(id);
    if (!dialog) {
        log("dialog (" + id + ") not found.");
        return false;
    }

    // remove
    dialog.parentNode.removeChild(dialog);

    // return
    return true;
}

/**
 * show loadding icon
 * require jQuery library
 * @param speed  fade speed
 */
function showLoadingIcon(speed)
{
    $('#loading_icon_container').fadeIn(speed ? speed : 'fast');
}

/**
 * hide loadding icon
 * require jQuery library
 * @param speed  fade speed
 */
function hideLoadingIcon(speed)
{
    $('#loading_icon_container').fadeOut(speed ? speed : 'fast');
}

/* music controlling ---------------------------------------------- */

/**
 * get main audio controller
 * get the audio element with ID: mainAudioController
 * @returns Object(HTMLElement)|null
 */
function getMainAudioController()
{
    // get audio element
    return getElement('mainAudioController');
}

/**
 * play music
 * play audio use audio element with ID: mainAudioController
 * @return boolean
 */
function playMusic()
{
    // toggle button status
    $('#mainMusicControlButton').removeClass('stopped');

    // get audio element
    var mainAudioController = getElement('mainAudioController');
    if (!mainAudioController) {
        // audio controller not exist
        return false;
    }

    // try to play
    mainAudioController.play();

    // check play status
    if (mainAudioController.paused) {
        // play fail
        return false;
    }

    return true;
}

/**
 * pause music
 * pause audio use audio element with ID: mainAudioController
 * @return boolean
 */
function pauseMusic()
{
    // toggle button status
    $('#mainMusicControlButton').addClass('stopped');

    // get audio element
    var mainAudioController = getElement('mainAudioController');
    if (!mainAudioController) {
        // audio controller not exist
        return false;
    }

    // try to pause
    mainAudioController.pause();

    // check play status
    if (!mainAudioController.paused) {
        // still playing, pause fail
        return false;
    }

    return true;
}

/**
 * get music play status
 * get audio play status use audio element with ID: mainAudioController
 * @return boolean
 */
function getMusicPlayStatus()
{
    // get audio element
    var mainAudioController = getElement('mainAudioController');
    if (!mainAudioController) {
        // audio controller not exist
        return false;
    }

    // return status
    return !mainAudioController.paused;
}

/**
 * toggle music
 * toggle audio play status use audio element with ID: mainAudioController
 * @return boolean
 */
function toggleMusic()
{
    // check status
    if (getMusicPlayStatus()) {
        // playing then pause
        return pauseMusic();
    }
    else {
        // pausing then play
        return playMusic();
    }
}

/**
 * play letter
 */
function playLetter(sentence_index, delay)
{
    // default index
    sentence_index ? null : sentence_index = 0;

    // get sentences
    var letter_sentences = $('#letter_content_box > *');

    // check index
    if (sentence_index + 1 > letter_sentences.length) {
        return;
    }

    // show sentence
    letter_sentences.eq(sentence_index).fadeIn(3000);
    window.setTimeout(function ()
    {
        playLetter(sentence_index + 1, delay)
    }, delay);
}

/**
 * auto load missing dependencies library
 */
function loadDependencies()
{
    // check jQuery
    if (typeof(jQuery) === "undefined")
    {
        if (getBrowserLanguage() === 'zh-cn')
        {
            printTag('script', {src: cdnList.china.jquery});
        }
        else
        {
            printTag('script', {src: cdnList.world.jquery});
        }
    }

    // check moment library
    if (typeof(moment) === "undefined")
    {
        if (getBrowserLanguage() === 'zh-cn')
        {
            printTag('script', {src: cdnList.china.momentWithLocales});
        }
        else
        {
            printTag('script', {src: cdnList.world.momentWithLocales});
        }
    }
}

/**
 * load a html file content
 * @param url       String
 * @param element   HTMLElement
 * @param options   Object   $.ajax options param
 */
function loadHtml(url, element, options)
{
    typeof (options) === 'undefined' ? options = {} : null;
    options.dataType    = 'html';
    options.success     = (function(result)
    {
        var jElement = $(element);
        jElement.after(result);
        jElement.remove();
    });
    $.ajax(url, options);
}

/**
 * load a html file content
 * @param url       String
 * @param target    HTMLElement
 * @param options   Object
 */
function loadAppendHtml(url, target, options)
{
    typeof (options) === 'undefined' ? options = {} : null;
    options.dataType    = 'html';
    options.success     = (function(result){
        $(target).append(result);
    });

    $.ajax(url, options);
}

/**
 * get session storage
 * @key  String  data key string
 * @return  String|null
 */
function getSessionData(key)
{
    if (typeof(sessionStorage) === "undefined")
    {
        return null
    }

    return sessionStorage.getItem(key);
}

/**
 * set session storage
 * @key		String  data key string
 * @value	String  value
 * @return  boolean  success or not
 */
function setSessionData(key, value)
{
    if (typeof(sessionStorage) === "undefined")
    {
        return false
    }

    sessionStorage.setItem(key, value);
    return true;
}

/**
 * initialize tree view
 * @param Object(HTMLElement)|String  treeview element or CSS selector string
 */
function initTreeView(treeView)
{
    var treeviewEle = $(treeView);

    var folderName = treeviewEle.find('.folderNode .folderIcon, .folderNode .folderName');
    folderName.on('click', function(){
        var folderNode = $(this).parent().parent();
        folderNode.toggleClass('extended');
    });
}

/**
 * set UI setting, save in local storage.
 * @param name  String  setting name
 * @param value String  setting value
 */
function setUISetting(name, value)
{
    var id = 'ui_setting_' + name;

    localStorage.setItem(id, value);
}

/**
 * get UI setting value, get data in local storage, if not found, then return default value.
 * @param name          String  setting name
 * @param defaultValue  String  default value, if not defined, then it's null
 * @returns {String|null}
 */
function getUISetting(name, defaultValue)
{
    defaultValue = defaultValue || null;

    var id = 'ui_setting_' + name;
    return localStorage.getItem(id) || defaultValue;
}

/**
 * init UI setting form
 * @param form  String|HTMLElement   element id or object
 * @param options  Object   special options
 * -- onchange  Function   extra action on controls's change
 * require jQuery library
 */
function initUISettingForm(form, options)
{
    if ( getDebugStatus() && existDebuggingContent('initUISettingForm') )
    {
        addDebugLog('init UI setting form.');
    }

    if (typeof(form) == "string")
    {
        form = getElement(form);
        if (!form)
        {
            addConsoleLog('[error] form not found.');
            return;
        }
    }

    options = options || {};
    var onchange = options.onchange || null;

    // set value and event
    for (var controlIndex = 0; controlIndex < form.length; controlIndex++)
    {
        var control     = form[controlIndex];
        var name            = control.name;
        var target          = control.dataset.target || 'body';
        var property        = control.dataset.property || "";
        var defaultValue    = control.dataset.default || "";
        var expression      = control.dataset.expression || "";
        if (!name)
        {
            continue;
        }
        if (!property)
        {
            addConsoleLog('[warnning] control missing data-property value.');
            continue;
        }

        // set change event
        $(control).on('change', function(event){

            var name        = this.name;
            var target      = this.dataset.target || 'body';
            var property    = this.dataset.property || "";
            var expression  = this.dataset.expression || "";
            var value       = this.value;

            if (!property)
            {
                addConsoleLog('[warnning] control missing data-property value.');
                return;
            }

            // save value
            setUISetting(name, value);

            // update style
            if (expression)
            {
                try
                {
                    eval('value = ' + expression)
                }
                catch (e)
                {
                    addConsoleLog('[error] ' + e.message);
                }
            }
            $(target).css(property, value);

            onchange ? onchange() : null;
        });

        // get setting value by name
        var setting = getUISetting(name);

        // update control's value if has special setting and is not a default value
        if (setting && setting != defaultValue)
        {
            setFormControl(form, name, setting);
            $(control).change();
        }
    }

    // trigger once change event
    onchange ? onchange() : null;
}

