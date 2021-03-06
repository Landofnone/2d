(function() {



var Assets = function(game) {
    this.game = game;
    this.assets = [];

    this.loading = 0;
    this.success = 0;
    this.errors  = 0;
    this.total   = 0;

// Set up DOM Elements
    this.container = document.createElement("div");
    this.container.setAttribute("class", "loader-2D");
    game.container.appendChild(this.container);

    game.EventEmitter(this);
    game.on("init", this.Init);

    return this;
}

Assets.prototype.Init = function(game) {
    this.initTime = game.Utils.time();
}

Assets.prototype.load = function(urls, name) {
    if(typeof urls === "string") urls = [urls];
    var self = this;

// Update stats
    this.loading++;
    this.total++;

// Get MIME type (of first url) to determine the file type (i.e. image, video, audio, text)
    var mime = this.getMime(urls[0]);

// Create Asset object
    var obj = new Asset(urls, name, mime);
    this.assets.push(obj);

// Add element
// Weird order because of 'onload' event not firing otherwise
    var elem;

    if(/audio\//i.test(mime)) {
        elem = document.createElement("audio");
        this.container.appendChild(elem);
        attachMediaEvents(elem, obj, self);
        urls.forEach(function(url) {
            var source = document.createElement("source");
            elem.appendChild(source);
            source.setAttribute("src", url);
            source.setAttribute("type", self.getMime(url));
        });
    }        
    else if(/video\//i.test(mime)) {
        elem = document.createElement("video");
        this.container.appendChild(elem);
        attachMediaEvents(elem, obj, self);
        urls.forEach(function(url) {
            var source = document.createElement("source");
            elem.appendChild(source);
            source.setAttribute("src", url);
            source.setAttribute("type", self.getMime(url));
        });
    }
    else if(/image\//i.test(mime)) {
        var elem = document.createElement("img");
        this.container.appendChild(elem);
        loadImage(elem, urls, 0, function(error) {
            if(error) {
                self.loading--;
                self.errors++;
                obj.done = true;
                obj.error = true;
                obj.emit("error", [null]);
                self.emit("asseterror", [null, obj]);
            }
            else {
                self.loading--;
                self.success++;
                obj.done = true;
                obj.emit("done", [null]);
                self.emit("assetdone", [null, obj]);
                if(self.total === (self.success + self.errors)) {
                    self.emit("done");
                }
            }
        });
    }
    else if(/text\//i.test(mime)) {
        loadXHR(urls, 0, function(xhr) {
            if(xhr.status !== 200) {
                self.loading--;
                self.errors++;
                obj.done = true;
                obj.error = true;
                obj.emit("error", [xhr]);
                self.emit("asseterror", [xhr, obj]);
            }
            else {
                self.loading--;
                self.success++;
                obj.done = true;
                obj.data = xhr.responseText || xhr.response;
                obj.emit("done", [xhr]);
                self.emit("assetdone", [xhr, obj]);
                if(self.total === (self.success + self.errors)) {
                    self.emit("done");
                }
            }
        });
    }
    else {
        console.warn("WARN: Unknown file type passed to 'Assets.load()'. No element will be created.");
    }

    if(elem) obj.element = elem;

    this.emit("assetadd", [obj]);


    return this;
}

Assets.prototype.get = function(id) {
    var assets = this.assets;

    for(var i = 0, len = assets.length; i < len; i++) {
        var asset = assets[i];
        if(asset.name === id || asset.urls.indexOf(id) !== -1) {
            return asset;
        }
    }

    return null;
}

Assets.prototype.getMime = function(url) {
    var split = url.split(".");
    var ext = split[split.length - 1];
    return this.mimes[ext];
}

Assets.prototype.mimes = {"323":"text/h323","3gp":"video/3gpp","*":"application/octet-stream","acx":"application/internet-property-stream","ai":"application/postscript","aif":"audio/x-aiff","aifc":"audio/x-aiff","aiff":"audio/x-aiff","appcache":"text/cache-manifest","asf":"video/x-ms-asf","asr":"video/x-ms-asf","asx":"video/x-ms-asf","au":"audio/basic","avi":"video/x-msvideo","axs":"application/olescript","bas":"text/plain","bcpio":"application/x-bcpio","bin":"application/octet-stream","bmp":"image/bmp","c":"text/plain","cat":"application/vnd.ms-pkiseccat","cdf":"application/x-cdf","cdf":"application/x-netcdf","cer":"application/x-x509-ca-cert","class":"application/octet-stream","clp":"application/x-msclip","cmx":"image/x-cmx","cod":"image/cis-cod","cpio":"application/x-cpio","crd":"application/x-mscardfile","crl":"application/pkix-crl","crt":"application/x-x509-ca-cert","csh":"application/x-csh","css":"text/css","dcr":"application/x-director","der":"application/x-x509-ca-cert","dir":"application/x-director","dll":"application/x-msdownload","dms":"application/octet-stream","doc":"application/msword","dot":"application/msword","dvi":"application/x-dvi","dxr":"application/x-director","eps":"application/postscript","etx":"text/x-setext","evy":"application/envoy","exe":"application/octet-stream","fif":"application/fractals","flr":"x-world/x-vrml","flv":"video/x-flv","gif":"image/gif","gtar":"application/x-gtar","gz":"application/x-gzip","h":"text/plain","hdf":"application/x-hdf","hlp":"application/winhlp","hqx":"application/mac-binhex40","hta":"application/hta","htc":"text/x-component","htm":"text/html","html":"text/html","htt":"text/webviewhtml","ico":"image/x-icon","ief":"image/ief","iii":"application/x-iphone","ins":"application/x-internet-signup","isp":"application/x-internet-signup","jfif":"image/pipeg","jpe":"image/jpeg","jpeg":"image/jpeg","jpg":"image/jpeg","js":"text/javascript","latex":"application/x-latex","lha":"application/octet-stream","lsf":"video/x-la-asf","lsx":"video/x-la-asf","lzh":"application/octet-stream","m13":"application/x-msmediaview","m14":"application/x-msmediaview","m3u":"audio/x-mpegurl","m4v":"video/mp4","man":"application/x-troff-man","manifest":"text/cache-manifest","markdown":"text/x-markdown","md":"text/x-markdown","mdb":"application/x-msaccess","me":"application/x-troff-me","mf":"text/cache-manifest","mht":"message/rfc822","mhtml":"message/rfc822","mid":"audio/mid","mkv":"video/x-matroska","mny":"application/x-msmoney","mov":"video/quicktime","movie":"video/x-sgi-movie","mp2":"video/mpeg","mp3":"audio/mpeg","mp4":"video/mp4","mpa":"video/mpeg","mpe":"video/mpeg","mpeg":"video/mpeg","mpg":"video/mpeg","mpp":"application/vnd.ms-project","mpv2":"video/mpeg","ms":"application/x-troff-ms","msg":"application/vnd.ms-outlook","mvb":"application/x-msmediaview","nc":"application/x-netcdf","nws":"message/rfc822","oda":"application/oda","ogg":"audio/ogg","p10":"application/pkcs10","p12":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","p7c":"application/x-pkcs7-mime","p7m":"application/x-pkcs7-mime","p7r":"application/x-pkcs7-certreqresp","p7s":"application/x-pkcs7-signature","pbm":"image/x-portable-bitmap","pdf":"application/pdf","pfx":"application/x-pkcs12","pgm":"image/x-portable-graymap","pko":"application/ynd.ms-pkipko","pma":"application/x-perfmon","pmc":"application/x-perfmon","pml":"application/x-perfmon","pmr":"application/x-perfmon","pmw":"application/x-perfmon","png":"image/png","pnm":"image/x-portable-anymap","pot":"application/vnd.ms-powerpoint","ppm":"image/x-portable-pixmap","pps":"application/vnd.ms-powerpoint","ppt":"application/vnd.ms-powerpoint","prf":"application/pics-rules","ps":"application/postscript","pub":"application/x-mspublisher","qt":"video/quicktime","ra":"audio/x-pn-realaudio","ram":"audio/x-pn-realaudio","rar":"application/x-rar-compressed","ras":"image/x-cmu-raster","rgb":"image/x-rgb","rmi":"audio/mid","roff":"application/x-troff","rtf":"application/rtf","rtx":"text/richtext","scd":"application/x-msschedule","sct":"text/scriptlet","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","sh":"application/x-sh","shar":"application/x-shar","shtml":"text/html","sit":"application/x-stuffit","snd":"audio/basic","spc":"application/x-pkcs7-certificates","spl":"application/futuresplash","src":"application/x-wais-source","sst":"application/vnd.ms-pkicertstore","stl":"application/vnd.ms-pkistl","stm":"text/html","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","svg":"image/svg+xml","swf":"application/x-shockwave-flash","t":"application/x-troff","tar":"application/x-tar","tcl":"application/x-tcl","tex":"application/x-tex","texi":"application/x-texinfo","texinfo":"application/x-texinfo","tgz":"application/x-compressed","tif":"image/tiff","tiff":"image/tiff","tr":"application/x-troff","trm":"application/x-msterminal","tsv":"text/tab-separated-values","txt":"text/plain","uls":"text/iuls","ustar":"application/x-ustar","vcf":"text/x-vcard","vrml":"x-world/x-vrml","wav":"audio/x-wav","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","webm":"video/webm","webp":"image/webp","wks":"application/vnd.ms-works","wma":"audio/x-ms-wma","wmf":"application/x-msmetafile","wmv":"video/x-ms-wmv","wps":"application/vnd.ms-works","wri":"application/x-mswrite","wrl":"x-world/x-vrml","wrz":"x-world/x-vrml","xaf":"x-world/x-vrml","xbm":"image/x-xbitmap","xla":"application/vnd.ms-excel","xlc":"application/vnd.ms-excel","xlm":"application/vnd.ms-excel","xls":"application/vnd.ms-excel","xlt":"application/vnd.ms-excel","xlw":"application/vnd.ms-excel","xof":"x-world/x-vrml","xpm":"image/x-xpixmap","xwd":"image/x-xwindowdump","z":"application/x-compress","zip":"application/zip","ABOUT":"text/plain","AUTHORS":"text/plain","CONTRIBUTORS":"text/plain","COPYING":"text/plain","LICENSE":"text/plain","README":"text/plain","TODO":"text/plain"}






/*
 * Asset
 *
 * Object that contains some info about an asset, like URL, name, MIME type, etc.
 */

var Asset = function(urls, name, mime) {
    this.urls = urls;
    this.name = name;
    this.mime = mime;

    this.done = false;
    this.error =  false;

    Game.prototype.EventEmitter(this);

    return this;
}

// Attach to Assets
Assets.prototype.Asset = Asset;





/*
 * VARS
 *
 * Some usefuls variables
 */


var attachMediaEvents = function(elem, obj, assets) {
// For Media elements
    elem.onloadeddata = function(e) {
        if(!obj.done) {
            assets.loading--;
            assets.success++;
            obj.done = true;
            obj.emit("done", [xhr]);
            self.emit("assetdone", [xhr, obj]);
            if(assets.total === (assets.success + assets.errors)) {
                assets.emit("done");
            }
        }
    }

// Error
    elem.onerror = function(e) {
        assets.loading--;
        assets.errors++;
        obj.done = true;
        obj.error = true;
        obj.emit("error", [xhr]);
        assets.emit("asseterror", [xhr, obj]);
    }
}

var loadImage = function(elem, urls, index, cb) {
    elem.setAttribute("src", urls[index]);
    elem.setAttribute("type", Assets.prototype.getMime(urls[index]));

    elem.onload = function(e) {
        cb(false);
    }
    elem.onerror = function(e) {
        if(urls[index + 1]) {
            loadImage(elem, urls, index+1, cb);
        }
        else {
            cb(true);
        }
    }
}

var loadXHR = function(urls, index, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urls[index], true);
    xhr.onload = function(e) {
        cb(xhr);
    }
    xhr.onerror = function(e) {
        if(urls[index + 1]) {
            loadXHR(urls, index++, cb);
        }
        else {
            cb(xhr);
        }
    }
    xhr.send();
}



var Plugin = {
    name: "assets-dom",
    id: "core.assets-dom",
    path: "Assets",
    construct: function(game) {
        return new Assets(game);
    }
}
Game.plugins.push(Plugin);



})()