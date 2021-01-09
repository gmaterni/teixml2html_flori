
var timeStart=function(mesg){
    console.time(mesg);
};

var timeEnd=function(mesg){
    console.timeEnd(mesg);
};

UA = {};

var UaRq = {
    error: '',
    get: function(url, params, callback, fnErr, dataType, callArgs) {
        var ok = true;
        jQuery.ajax({
            type: 'GET',
            url: url,
            dataType: !!dataType ? dataType : 'xml',
            data: params,
            processData: true,
            async: true,
            cache: true,
            success: function(rsp, arg2) {
                UaRq.error = "";
            },
            error: function(rsp, arg2) {
                ok = false;
                UaRq.error = "Error!\n UaRq.get\nurl:" + url;
                if (!fnErr) fnErr = function(rsp) {
                    alert(UaRq.error);
                };
            },
            complete: function(rsp, arg2) {
                if (ok) callback(rsp, callArgs);
                else fnErr(rsp);
            }
        });
    }
};

// uajt2.js release 10-05-2018

var UaJt = function() {
    var lines = [];
    var sepL = '{';
    var sepR = '}';
    var jt = {
        reset: function() {
            lines = [];
            return this;
        },
        delimiters: function(sL, sR) {
            sepL = sL;
            sepR = sR;
            return this;
        },
        //inserisce all'inzio il testo
        insert: function(templ, data) {
            var t = (!data) ? templ : this.render(templ, data);
            lines.unshift(t);
            return this;
        },
        //accoda il testo
        appendEnum: function(templ, list, num) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                item[num] = i;
                this.append(templ, item);
            }
            return this;
        },
        appendList: function(templ, list) {
            for (var i = 0; i < list.length; i++)
                this.append(templ, list[i]);
            return this;
        },
        append: function(templ, data) {
            var t = (!data) ? templ : this.render(templ, data);
            lines.push(t);
            return this;
        },
        render: function(templ, data) {
            //var kl = Object.keys(data).length;
            var spl = templ.split(sepL);
            var arr = [spl[0]];
            var i, j, x, ks, k, v;
            for (i = 1; i < spl.length; i++) {
                x = spl[i].split(sepR);
                ks = x[0].trim().split('.');
                for (j = 0; j < ks.length; j++) {
                    k = ks[j];
                    v = data[k];
                }
                if (v === undefined)
                    v = sepL + ks.join('.') + ':undefined' + sepR;
                else if (!v && v !== 0)
                    v = v || '';
                else if (typeof(v) === 'object')
                    v = sepL + ks.join('.') + ':json Error' + sepR;
                arr.push(v);
                arr.push(x[1]);
            }
            return arr.join("");
        },
        text: function(linesep) {
            linesep = linesep || "";
            return lines.join(linesep);
        },
        rows: function() {
            return lines;
        }
    };
    return jt;
};


var UaWait = {
    w: null,
    show: function(urlImg) {
        if(!!this.w) return;
        urlImg = urlImg || 'css/ico/wait.gif';
        this.w = $('<div></div>').attr('id', '_wait_').appendTo('body');
        this.w.css({
            position: "fixed",
            background:"#c2c288",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            backgroundImage: "url(" + urlImg + ")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: "0.5",
            zIndex: "90"
        }).show();
    },
    hide: function() {
        if(!this.w) return;
        this.w.remove();
        this.w=null;
    }
};

var UaDrag = function(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    var dragMouseDown = function(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };

    var elementDrag = function(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    };

    var closeDragElement = function() {
        document.onmouseup = null;
        document.onmousemove = null;
    };

    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }
};