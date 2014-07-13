var Sound;

(function() {



Sound = function() {
    this.sounds = [];
    
    this.loading = 0;
    this.success = 0;
    this.errors  = 0;
    this.total   = 0;

    var topContainer = document.getElementById("2D-loaders");
    if(!topContainer) {
        topContainer = document.createElement("div");
        topContainer.setAttribute("id", "2D-loaders");
        document.body.appendChild(topContainer);
    }
    this.container = document.createElement("div");
    this.container.setAttribute("class", "2D-sound");
    topContainer.appendChild(this.container);


    return this;
}

Sound.prototype.name = "sound-dom";
Sound.prototype.type = "Sound";

Sound.prototype.load = function(urls, name) {
    if(typeof urls === "string") urls = [urls];
    var self = this;

// Update stats
    this.loading++;
    this.total++;

// Create SoundInstance object
    var obj = new SoundInstance(urls, name);
    this.sounds.push(obj);

// Create <audio> element
    var elem = document.createElement("audio");
    this.container.appendChild(elem);
    for(var i = 0, len = urls.length; i < len; i++) {
        var url = urls[i];
        var src = document.createElement("source");
        src.setAttribute("src", url)
        src.setAttribute("type", this.getMime(url));
        elem.appendChild(src);
    }

// Attach events
    elem.onload = function(e) {
        self.loading--;
        self.success++;
        obj.done = true;
    }
    elem.onerror = function(e) {
        self.loading--;
        self.errors++;
        obj.done = true;
        obj.error = true;
    }

    obj.element = elem;


    return this;
}

Sound.prototype.get = function(id) {
    var sounds = this.sounds;

    for(var i = 0, len = sounds.length; i < len; i++) {
        var sound = sounds[i];
        if(sound.name === id || sound.urls.indexOf(id) !== -1) {
            return sound;
        }
    }

    return null;
}

Sound.prototype.play = function(id) {
    var sound = this.get(id);
    if(sound) sound.play();
    return this;
}

Sound.prototype.pause = function(id) {
    var sound = this.get(id);
    if(sound) sound.pause();
}

Sound.prototype.stop = function(id) {
    var sound = this.get(id);
    if(sound) sound.stop();
}

Sound.prototype.getMime = function(url) {
    var split = url.split(".");
    var ext = split[split.length - 1];
    return this.mimes[ext];
}


// Mime types from: https://github.com/TuurDutoit/mime-types
Sound.prototype.mimes = {"323":"text/h323","3gp":"video/3gpp","*":"application/octet-stream","acx":"application/internet-property-stream","ai":"application/postscript","aif":"audio/x-aiff","aifc":"audio/x-aiff","aiff":"audio/x-aiff","appcache":"text/cache-manifest","asf":"video/x-ms-asf","asr":"video/x-ms-asf","asx":"video/x-ms-asf","au":"audio/basic","avi":"video/x-msvideo","axs":"application/olescript","bas":"text/plain","bcpio":"application/x-bcpio","bin":"application/octet-stream","bmp":"image/bmp","c":"text/plain","cat":"application/vnd.ms-pkiseccat","cdf":"application/x-cdf","cdf":"application/x-netcdf","cer":"application/x-x509-ca-cert","class":"application/octet-stream","clp":"application/x-msclip","cmx":"image/x-cmx","cod":"image/cis-cod","cpio":"application/x-cpio","crd":"application/x-mscardfile","crl":"application/pkix-crl","crt":"application/x-x509-ca-cert","csh":"application/x-csh","css":"text/css","dcr":"application/x-director","der":"application/x-x509-ca-cert","dir":"application/x-director","dll":"application/x-msdownload","dms":"application/octet-stream","doc":"application/msword","dot":"application/msword","dvi":"application/x-dvi","dxr":"application/x-director","eps":"application/postscript","etx":"text/x-setext","evy":"application/envoy","exe":"application/octet-stream","fif":"application/fractals","flr":"x-world/x-vrml","flv":"video/x-flv","gif":"image/gif","gtar":"application/x-gtar","gz":"application/x-gzip","h":"text/plain","hdf":"application/x-hdf","hlp":"application/winhlp","hqx":"application/mac-binhex40","hta":"application/hta","htc":"text/x-component","htm":"text/html","html":"text/html","htt":"text/webviewhtml","ico":"image/x-icon","ief":"image/ief","iii":"application/x-iphone","ins":"application/x-internet-signup","isp":"application/x-internet-signup","jfif":"image/pipeg","jpe":"image/jpeg","jpeg":"image/jpeg","jpg":"image/jpeg","js":"application/x-javascript","latex":"application/x-latex","lha":"application/octet-stream","lsf":"video/x-la-asf","lsx":"video/x-la-asf","lzh":"application/octet-stream","m13":"application/x-msmediaview","m14":"application/x-msmediaview","m3u":"audio/x-mpegurl","m4v":"video/mp4","man":"application/x-troff-man","manifest":"text/cache-manifest","markdown":"text/x-markdown","md":"text/x-markdown","mdb":"application/x-msaccess","me":"application/x-troff-me","mf":"text/cache-manifest","mht":"message/rfc822","mhtml":"message/rfc822","mid":"audio/mid","mny":"application/x-msmoney","mov":"video/quicktime","movie":"video/x-sgi-movie","mp2":"video/mpeg","mp3":"audio/mpeg","mp4":"video/mp4","mpa":"video/mpeg","mpe":"video/mpeg","mpeg":"video/mpeg","mpg":"video/mpeg","mpp":"application/vnd.ms-project","mpv2":"video/mpeg","ms":"application/x-troff-ms","msg":"application/vnd.ms-outlook","mvb":"application/x-msmediaview","nc":"application/x-netcdf","nws":"message/rfc822","oda":"application/oda","ogg":"audio/ogg","p10":"application/pkcs10","p12":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","p7c":"application/x-pkcs7-mime","p7m":"application/x-pkcs7-mime","p7r":"application/x-pkcs7-certreqresp","p7s":"application/x-pkcs7-signature","pbm":"image/x-portable-bitmap","pdf":"application/pdf","pfx":"application/x-pkcs12","pgm":"image/x-portable-graymap","pko":"application/ynd.ms-pkipko","pma":"application/x-perfmon","pmc":"application/x-perfmon","pml":"application/x-perfmon","pmr":"application/x-perfmon","pmw":"application/x-perfmon","png":"image/png","pnm":"image/x-portable-anymap","pot":"application/vnd.ms-powerpoint","ppm":"image/x-portable-pixmap","pps":"application/vnd.ms-powerpoint","ppt":"application/vnd.ms-powerpoint","prf":"application/pics-rules","ps":"application/postscript","pub":"application/x-mspublisher","qt":"video/quicktime","ra":"audio/x-pn-realaudio","ram":"audio/x-pn-realaudio","rar":"application/x-rar-compressed","ras":"image/x-cmu-raster","rgb":"image/x-rgb","rmi":"audio/mid","roff":"application/x-troff","rtf":"application/rtf","rtx":"text/richtext","scd":"application/x-msschedule","sct":"text/scriptlet","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","sh":"application/x-sh","shar":"application/x-shar","shtml":"text/html","sit":"application/x-stuffit","snd":"audio/basic","spc":"application/x-pkcs7-certificates","spl":"application/futuresplash","src":"application/x-wais-source","sst":"application/vnd.ms-pkicertstore","stl":"application/vnd.ms-pkistl","stm":"text/html","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","svg":"image/svg+xml","swf":"application/x-shockwave-flash","t":"application/x-troff","tar":"application/x-tar","tcl":"application/x-tcl","tex":"application/x-tex","texi":"application/x-texinfo","texinfo":"application/x-texinfo","tgz":"application/x-compressed","tif":"image/tiff","tiff":"image/tiff","tr":"application/x-troff","trm":"application/x-msterminal","tsv":"text/tab-separated-values","txt":"text/plain","uls":"text/iuls","ustar":"application/x-ustar","vcf":"text/x-vcard","vrml":"x-world/x-vrml","wav":"audio/x-wav","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","webm":"video/webm","webp":"image/webp","wks":"application/vnd.ms-works","wma":"audio/x-ms-wma","wmf":"application/x-msmetafile","wmv":"video/x-ms-wmv","wps":"application/vnd.ms-works","wri":"application/x-mswrite","wrl":"x-world/x-vrml","wrz":"x-world/x-vrml","xaf":"x-world/x-vrml","xbm":"image/x-xbitmap","xla":"application/vnd.ms-excel","xlc":"application/vnd.ms-excel","xlm":"application/vnd.ms-excel","xls":"application/vnd.ms-excel","xlt":"application/vnd.ms-excel","xlw":"application/vnd.ms-excel","xof":"x-world/x-vrml","xpm":"image/x-xpixmap","xwd":"image/x-xwindowdump","z":"application/x-compress","zip":"application/zip","ABOUT":"text/plain","AUTHORS":"text/plain","CONTRIBUTORS":"text/plain","COPYING":"text/plain","LICENSE":"text/plain","README":"text/plain","TODO":"text/plain"}




/*
 * SoundInstance
 *
 * Represents a sound, which can be played, paused, stopped, etc.
 */

var SoundInstance = function(urls, name) {
    this.urls = urls;
    this.name = name;

    this.done = false;
    this.error = false;

    this.element = null;

    return this;
}

SoundInstance.prototype.play = function() {
    this.element.load();
    this.element.play();
    return this;
}

SoundInstance.prototype.pause = function() {
    this.element.pause();
    return this;
}

SoundInstance.prototype.stop = function() {
    this.element.currentTime = 0;
    this.element.pause();
    return this;
}

Sound.prototype.SoundInstance = SoundInstance;



})()