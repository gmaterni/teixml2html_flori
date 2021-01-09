// release 23-08.2018

 /* jshint esversion: 6 */

var TextInfoLst = {
    "par1": {
        'css_init': true,
        'url': "html/par1/syn/par1.html",
        'urleps': "html/par1/syn/_EPS_.html",
        'name': 'G (paris)',
        'sigla': 'G',
        'dip_id': '#par_dip_id',
        'int_id': '#par_int_id'
    },
    "tor1": {
        'css_init': true,
        'url': "html/tor1/syn/tor1.html",
        'urleps': "html/tor1/syn/_EPS_.html",
        'name': 'K (torino)',
        'sigla': 'K',
        'dip_id': '#tor_dip_id',
        'int_id': '#tor_int_id'
    },
    "tou1": {
        'css_init': true,
        'url': "html/tou1/syn/tou1.html",
        'urleps': "html/tou1/syn/_EPS_.html",
        'name': 'T (tours)',
        'sigla': 'T',
        'dip_id': '#tou_dip_id',
        'int_id': '#tou_int_id'
    },
    "ven1": {
        'css_init': true,
        'url': "html/ven1/syn/ven1.html",
        'urleps': "html/ven1/syn/_EPS_.html",
        'name': 'I (venezia)',
        'sigla': 'I',
        'dip_id': '#ven_dip_id',
        'int_id': '#ven_int_id'
    }
};

var initSync = function() {
    UaBarText.show();
};

var readText = function(cod) {

    var call = function(rsp) {
        //console.log("readText:"+cod);
        var div_id = TextMgr.addText(cod);
        //ua0,ua1,ua2,ua3
        let id = div_id.substr(1);
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).innerHTML = rsp.responseText;
        var info = TextInfoLst[cod];
        // par_dip_id, tor_dip_d
        var pid = text_info.dip_id;
        // TODO modificato find
        var eps_array = $(pid).find('div.div_text').toArray();
        EpsMgr.init(eps_array);
        UaBarVert.init(eps_array);
        UaBarText.show();
        UaBarVert.showEps(cod, UaFl.eps_num);
        TextScroll();
        UaWait.hide();
    };

    let status = TextMgr.getStatusText(cod);
    if (status != 0)
        return;
    UaWait.show();
    //alert('xx');
    let text_info = TextInfoLst[cod];
    UaRq.get(text_info.url, "", call, null, 'text');
};


var TextMgr = {
    pos_lst: ['', '', '', ''],
    info_map: {
        'par1': {
            'css': null,
            'status': 0,
            'class': null,
            'id': null
        },
        'ven1': {
            'css': null,
            'status': 0,
            'class': null,
            'id': null
        },
        'tor1': {
            'css': null,
            'status': 0,
            'class': null,
            'id': null
        },
        'tou1': {
            'css': null,
            'status': 0,
            'class': null,
            'id': null
        }
    },
    div_ids: ['#ua0', '#ua1', '#ua2', '#ua3'],
    css_lst: [{
        'position': 'absolute',
        'top': '50px',
        'left': '61px'
    }, {
        'position': 'absolute',
        'top': '50px',
        'left': '462px'
    }, {
        'position': 'absolute',
        'top': '50px',
        'left': '863px'
    }, {
        'position': 'absolute',
        'top': '50px',
        'left': '1263px'
    }, ],
    getPos: function(cod) {
        var n = this.pos_lst.indexOf(cod);
        return n;
    },
    getDivId: function(cod) {
        var info = this.info_map[cod];
        return info.id;
    },
    getPosList: function() {
        return this.pos_lst;
    },
    getInfoLst: function() {
        return this.info_map;
    },
    getStatusText: function(cod) {
        return this.info_map[cod].status;
    },
    getPosActive: function() {
        var ls = [];
        this.pos_lst.forEach(function(x) {
            if (x != '') ls.push(x);
        });
        return ls;
    },
    getDivFree: function() {
        var id = null;
        for (var i = 0; i < this.div_ids.length; i++) {
            var h = $(this.div_ids[i]).html();
            if (h == '') {
                id = this.div_ids[i];
                break;
            }
        }
        return id;
    },
    assignClasses: function() {
        var ks = Object.keys(this.info_map);
        for (var i = 0; i < ks.length; i++) {
            var k = ks[i];
            var info = this.info_map[k];
            if (info.status == 0) continue;
            $(info.id).css(info.css);
        }
    },
    addText: function(cod) {
        var n = this.pos_lst.indexOf(cod);
        if (n > -1)
            return -1;
        n = this.pos_lst.indexOf('');
        var id = this.getDivFree();
        var css = this.css_lst[n];
        this.pos_lst[n] = cod;
        this.info_map[cod].status = 1;
        this.info_map[cod].id = id;
        this.info_map[cod].css = css;
        return id;
    },
    delText: function(cod) {
        var n = this.pos_lst.indexOf(cod);
        this.pos_lst[n] = '';
        var info = this.info_map[cod];
        info.status = 0;
        $(info.id).html('');
        info.id = null;
        info.css = null;
    },
    swapLeft: function(cod) {
        var pos = this.pos_lst.indexOf(cod);
        if (pos > 0)
            this.swapPos(cod, pos - 1);
        else
            this.swapPos(cod, 3);
    },
    swapRight: function(cod) {
        var pos = this.pos_lst.indexOf(cod);
        if (pos < this.pos_lst.length - 1)
            this.swapPos(cod, pos + 1);
        else
            this.swapPos(cod, 0);
    },
    swapPos: function(cod0, pos1) {
        var pos0 = this.pos_lst.indexOf(cod0);
        var info0 = this.info_map[cod0];
        var css0 = info0.css;
        var css1 = this.css_lst[pos1];
        info0.css = css1;
        var cod1 = this.pos_lst[pos1];
        if (!!cod1) {
            var info1 = this.info_map[cod1];
            info1.css = css0;
        }
        this.pos_lst[pos0] = cod1;
        this.pos_lst[pos1] = cod0;
        this.assignClasses();
    }
};

var EpsMgr = {
    eps_array: null,
    ref_lst: null,
    init: function(eps_array) {
        this.eps_array = eps_array;
        this.ref_lst = [];
        for (var i = 0; i < eps_array.length; i++) {
            var ref = $(eps_array[i]).attr('ref');
            this.ref_lst.push(ref);
        }
    },
    /*
    loadEpsNum: function(cod, n) {
        var url = EpsMgr.getUrl(cod, n);
        var rsp = UaRq.rqsGet(url, "", null, 'text');
        var h = rsp.responseText;
        $("#eps_id").html(h);
        var es = $("#eps_id").find('div.div_text').toArray();
        var hd = es[0].innerHTML;
        es[0].innerHTML = "";
        var hi = es[1].innerHTML;
        es[1].innerHTML = "";
        return [hd, hi];
    },
    */
    getEpsElem: function(text_id, eps_num) {
        let ref = this.ref_lst[eps_num];
        let es = $(text_id).find("div.div_text").toArray();
        var elm = null;
        for (let i = 0; i < es.length; i++) {
            if (ref == $(es[i]).attr('ref')) {
                elm = es[i];
                break;
            }
        }
        return elm;
    },
    getRef: function(n) {
        var ref = this.ref_lst[n];
        return ref;
    },
    getUrl: function(text_cod, n) {
        var ref = this.getRef(n);
        var rf = ref.replace('#', '');
        var info = TextInfoLst[text_cod];
        var url = info.urleps.replace('_EPS_', rf);
        return url;
    },
    removeText: function(cod) {
        var text_info = TextInfoLst[cod];
        let eds = $(text_info.dip_id).find("div.div_text").toArray();
        let eis = $(text_info.int_id).find("div.div_text").toArray();
        for (let i = 0; i < eds.length; i++) {
            $(eds[i]).empty();
            $(eis[i]).empty();
        }
    }
};

var TextScrollMgr = {
    text_num: 0,
    dips: null,
    ints: null,
    setTextNum: function(n) {
        this.text_num = n;
    },
    gerTextNum: function() {
        return this.text_num;
    },
    setTop: function() {
        $("div.text_pannel").scrollTop(0);
    },
    setAlignCod: function(cod) {
        var divs = $('div.text_pannel').toArray();
        var ua_id = TextMgr.getDivId(cod);
        let di=UaFl.getDipInt();
        let tei_cls=(di == 'd') ? "div.tei_dip" : "div.tei_int";
        var top = $(ua_id + " "+tei_cls).scrollTop();
        divs.forEach(function(x) {
            $(x).scrollTop(top);
        });
    },
    store: function() {
        this.dips = [];
        this.ints = [];
        var divs = $('div.text_pannel').toArray();
        var that = this;
        divs.forEach(function(x) {
            var t = $(x).scrollTop();
            var id = $(x).prop('id');
            var item = {
                'top': t,
                'id': id
            };
            if (id.indexOf('dip') > -1)
                that.dips.push(item);
            else
                that.ints.push(item);
        });
    },
    restore: function(di) {
        if (di == 'd')
            this.ints.forEach(function(x) {
                var id = "#" + x.id.replace('int', 'dip');
                $(id).scrollTop(x.top);
            });
        else
            this.dips.forEach(function(x) {
                var id = "#" + x.id.replace('dip', 'int');
                $(id).scrollTop(x.top);
            });
    }
};

var TextScroll = function() {
    var y0 = 0;
    var tops = [];

    var scrollMouseDown = function(e) {
        e.preventDefault();
        var last_id = e.currentTarget.id;
        y0 = e.clientY;
        for (var i = 0; i < divs.length; i++) {
            if ($(divs[i]).prop('id') == last_id)
                TextScrollMgr.setTextNum(i);
            $(divs[i]).css('cursor', 'move');
            tops[i] = $(divs[i]).scrollTop();
        }
        document.onmouseup = closeScrollElement;
        document.onmousemove = elementScroll;
    };

    var elementScroll = function(e) {
        e.preventDefault();
        var dy = y0 - e.clientY;
        y0 = e.clientY;
        for (var i = 0; i < divs.length; i++) {
            var top = tops[i] + dy;
            $(divs[i]).scrollTop(top);
            tops[i] = $(divs[i]).scrollTop();
        }
    };

    var closeScrollElement = function() {
        for (var i = 0; i < divs.length; i++) {
            $(divs[i]).css('cursor', 'default');
        }
        document.onmouseup = null;
        document.onmousemove = null;
    };

    var divs = $('div.text_pannel').toArray();
    for (i = 0; i < divs.length; i++) {
        var e = $(divs[i])[0];
        if (!e) continue;
        e.onmousedown = scrollMouseDown;
    }
};


var UaFl = {
    dip_int: 'd',
    line_status: 1,
    eps_num: 0,
    getDipInt: function() {
        return this.dip_int;
    },
    showInt: function() {
        this.setDipInt('i');
        UaBarText.show();
    },
    showDip: function() {
        this.setDipInt('d');
        UaBarText.show();
    },
    setDipInt: function(di) {
        if (this.dip_int == di) return;
        TextScrollMgr.store();
        this.dip_int = di;
        //this.showEpsNum(this.eps_num);
        this.showActiveEps();
        TextScrollMgr.restore(di);
    },
    load_show: function(cod, n,callEnd) {
        var eps_num=n;
        var text_cod=cod;

        let call=function(rsp){
            var h = rsp.responseText;
            $("#eps_id").html(h);
            var es = $("#eps_id").find('div.div_text').toArray();
            var hd = es[0].innerHTML;
            es[0].innerHTML = "";
            var hi = es[1].innerHTML;
            es[1].innerHTML = "";
            /////////
            EpsMgr.removeText(text_cod);
            var text_info = TextInfoLst[cod];
            var ed = EpsMgr.getEpsElem(text_info.dip_id, eps_num);
            var ei = EpsMgr.getEpsElem(text_info.int_id, eps_num);
            $(ed).html(hd);
            $(ei).html(hi);
            if (UaFl.dip_int == 'd') {
                $(text_info.int_id).hide();
                $(text_info.dip_id).show();
            } else {
                $(text_info.dip_id).hide();
                $(text_info.int_id).show();
            }
            TeimedCss.init(text_cod);
            UaWait.hide();
            if(!!callEnd)
                callEnd();
        };

        UaWait.show();
        var url = EpsMgr.getUrl(cod, n);
        UaRq.get(url, "", call, null, 'text');
    },
    // legge l'episodio di un testo
    loadEps: function(text_cod, eps_num) {
        TextMgr.assignClasses();
        this.load_show(text_cod, eps_num);
    },
    // legge episodio in tutt i testi attivi
    loadActiveEps: function(eps_num) {
        if (this.eps_num == eps_num)
            return;
        this.eps_num = eps_num;
        var txt_lst = TextMgr.getPosActive();
        let le=txt_lst.length -1;
        for (var i = 0; i < le; i++) {
            let text_cod = txt_lst[i];
            this.load_show(text_cod, eps_num);
        }
        let text_cod = txt_lst[le];
        this.load_show(text_cod, eps_num,TextScrollMgr.setTop);
        //TextScrollMgr.setTop();
    },
    showActiveEps: function() {
        var show = function(cod, eps_num) {
            var text_info = TextInfoLst[cod];
            if (UaFl.dip_int == 'd') {
                $(text_info.int_id).hide();
                $(text_info.dip_id).show();
            } else {
                $(text_info.dip_id).hide();
                $(text_info.int_id).show();
            }
        };
        var txt_lst = TextMgr.getPosActive();
        for (var i = 0; i < txt_lst.length; i++) {
            let text_cod = txt_lst[i];
            show(text_cod, this.eps_num);
        }
        TextScrollMgr.setTop();
    }

/*
    load_show: function(cod, eps_num) {
        var text_info = TextInfoLst[cod];
        var ed = EpsMgr.getEpsElem(text_info.dip_id, eps_num);
        var ei = EpsMgr.getEpsElem(text_info.int_id, eps_num);
        var hdhi = EpsMgr.loadEpsNum(cod, eps_num);
        var hd = hdhi[0];
        var hi = hdhi[1];
        //$(text_info.dip_id).hide();
        //$(text_info.int_id).hide();
        $(ed).html(hd);
        $(ei).html(hi);
        if (UaFl.dip_int == 'd') {
            $(text_info.int_id).hide();
            $(text_info.dip_id).show();
            //$(ed).show();
        } else {
            $(text_info.dip_id).hide();
            $(text_info.int_id).show();
            //$(ei).show();
        }
    },
    XXloadEps: function(text_cod, eps_num) {
        EpsMgr.removeText(text_cod);
        this.load_show(text_cod, eps_num);
        TeimedCss.init(text_cod);
        TextMgr.assignClasses();
    },
    XXloadActiveEps: function(eps_num) {
        if (this.eps_num == eps_num)
            return;
        this.eps_num = eps_num;
        var txt_lst = TextMgr.getPosActive();
        for (var i = 0; i < txt_lst.length; i++) {
            var text_cod = txt_lst[i];
            EpsMgr.removeText(text_cod);
            this.load_show(text_cod, eps_num);
            TeimedCss.init(text_cod);
        }
        TextMgr.assignClasses();
        TextScrollMgr.setTop();
    },
  */
    // visualizza dip / it gli pisodi nei testi attivi

};

var UaBarText = {
    show: function() {
        let di = UaFl.getDipInt();
        let dip = (di == 'd') ? 'active' : '';
        let int = (di == 'i') ? 'active' : '';
        var h0 = `
            <div class='ul'>
            <ul>
            <li><a class='pn' href='javascript:UaBarVert.showEpsPrev();'>
            <img src='css/ico/prev.png' height='24' /></a></li>
            <li><a class='pn' href='javascript:UaBarVert.showEpsSucc();'>
            <img src='css/ico/next.png' height='24' /></a></li>
           <li><a class='${dip}' href='javascript:UaFl.showDip();'><span>Dipl.</span></a></li>
            <li><a class='${int}' href='javascript:UaFl.showInt();'><span>Int.</span></a></li>
            <li><a class='x' href='javascript:TextScrollMgr.setTop();'>
            <img src='css/ico/aligntop.png' height='23' width='35' title="aligner au top"/></a></li>
            `;
        //`<li><a class='txt {class}' href='javascript:readText("{cod}");'><span>{sigl></a></li>`;
        var h1 = `
            <li><a class='tei' href='javascript:TeiHelp.toggle();'>
            <img src='css/ico/help.png' height='25' width='35' title='help' /></a></li>
            </ul>
            </div>
            <div class='text'>
            `;
        //'<span class="textn txt{n} {class}"><a href="#"">{cod}</a></span> ';
        var hsyn = this.barSyn();
        var h = h0 + hsyn[0] + h1 + hsyn[1] + "</div>";
        $('#bar_text_id').html(h).show();
    },
    barSyn: function() {
        var html1 = function() {
            var sts = TextMgr.getInfoLst();
            var templ = `<li><a class='txt {class}' href='javascript:readText("{cod}");'><span >{sigla}</span></a></li>`;
            var jt = UaJt();

            var ks = Object.keys(sts);
            var cs = Array(ks.length);
            cs.fill('');
            var ps = TextMgr.getPosList();
            ks.forEach(function(k) {
                var p = ps.indexOf(k);
                if (p > -1)
                    cs[p] = k;
            });
            ks.forEach(function(k) {
                var p = ps.indexOf(k);
                if (p < 0) {
                    var n = cs.indexOf('');
                    cs[n] = k;
                }
            });
            cs.forEach(function(k, i) {
                var v = sts[k];
                var sigla = TextInfoLst[k].sigla;
                var item = {
                    'n': i,
                    'cod': k,
                    'sigla': sigla,
                    'class': (v.status != 0) ? 'active' : ''
                };
                jt.append(templ, item);
            });
            return jt.text();
        };
        var html2 = function() {
            var templ = `
            <span class="textn txt{n}">
            <a class="{class}" href='javascript:UaBarText.swapLeft("{cod}")';')>{left}</a>
            <span class="sep"></span>
            <a class="{class}" href='javascript:UaBarText.swapRight("{cod}")';')>{right}</a>
            <span class="sep"></span>
            <a class="{class}" href='javascript:TextScrollMgr.setAlignCod("{cod}")';')>{align}</a>
            <span>{name}</span>
            <a class="{class}" href='javascript:UaBarText.delText("{cod}")';>{del}</a>
            </span>
            `;
            var left = `<img src='css/ico/left.png' title='déplacer à gauche' >`;
            var right = `<img src='css/ico/right.png' title='déplacer à droite' />`;
            var del = `<img src='css/ico/delete.png' title='fermer'/>`;
            var align = `<img src='css/ico/align.png' title='aligner les autres'/>`;
            var jt = UaJt();
            var lst = TextMgr.getPosList();
            for (var i = 0; i < lst.length; i++) {
                var cod = lst[i];
                var item = {};
                item.cod = cod;
                if (cod != '') {
                    var info = TextInfoLst[cod];
                    item.name = info.name;
                    item.del = del;
                    item.left = left;
                    item.right = right;
                    item.align = align;
                    item.class = 'x';
                    item.cod = cod;
                } else {
                    item.name = 'Ms.';
                    item.del = '';
                    item.left = '';
                    item.right = '';
                    item.align = '';
                    item.class = 'hide';
                    item.cod = '';
                }
                item.n = i;
                jt.append(templ, item);
            }
            return jt.text();
        };
        return [html1(), html2()];
    },
    delText: function(cod) {
        TextMgr.delText(cod);
        UaBarText.show();
    },
    swapLeft: function(cod) {
        TextMgr.swapLeft(cod);
        UaBarText.show();
    },
    swapRight: function(cod) {
        TextMgr.swapRight(cod);
        UaBarText.show();
    }
};

var UaBarVert = {
    eps_list: null,
    init: function(es) {
        this.eps_list = [];
        for (var i = 0; i < es.length; i++) {
            var type = $(es[i]).attr('type');
            var ref = $(es[i]).attr('ref');
            var item = {
                'i': i,
                'type': type,
                'ref': ref.replace('#', ''),
                'class': 'x'
            };
            this.eps_list.push(item);
        }
    },
    showEpsPrev: function() {
        var n = UaFl.eps_num;
        if (n > 0)
            this.showEpsNum(n - 1);
    },
    showEpsSucc: function() {
        var n = UaFl.eps_num;
        var eps_le = this.eps_list.length;
        if (n < eps_le - 1)
            this.showEpsNum(n + 1);
    },
    showEpsNum: function(n) {
        UaFl.loadActiveEps(n);
        var h = this.htmlEpsList(n);
        $('#barv_text_id').html(h).show();
    },
    showEps: function(text_cod, eps_num) {
        UaFl.loadEps(text_cod, eps_num);
        var h = this.htmlEpsList(eps_num);
        $('#barv_text_id').html(h).show();
    },
    htmlEpsList: function(n) {
        this.eps_list[n].class = 'used';
        var template = '<li><a class="{class}" href="javascript:UaBarVert.showEpsNum({i})">{ref}</a></li>';
        var jt = UaJt();
        jt.append("<div><ul>");
        jt.appendList(template, this.eps_list);
        jt.append("</ul></div>");
        this.eps_list[n].class = 'x';
        return jt.text();
    }
};


var TeiHelp = {
    id: '#teimed_help_id',
    visible: false,
    show: function() {
        var h1 = '<div><div class="head" ><a href="javascript:TeiHelp.toggle();">x</a></div>';
        var h2 = "</div>";
        var call = function(rsp) {
            var html = h1 + rsp.responseText + h2;
            $(TeiHelp.id).addClass('teimed_help');
            $(TeiHelp.id).html(html);
            var ew = $(TeiHelp.id)[0];
            UaDrag(ew);
            TeiHelp.visible = true;
            $(TeiHelp.id).show();
        };
        var url = "html/flsynhelp.html";
        UaRq.get(url, "", call, null, 'text');
    },
    hide: function() {
        $(TeiHelp.id).html("");
        $(TeiHelp.id).hide();
        this.visible = false;
    },
    toggle: function() {
        if (this.visible) TeiHelp.hide();
        else TeiHelp.show();
    }
};


var TeimedCss = {
    init: function(cod) {
        TeimedCss.setAfterPoint(cod);
        TeimedCss.setDirMon(cod);
    },
    setDirMon: function(cod) {
        var pannel_id = TextInfoLst[cod].dip_id;
        var pannel = $(pannel_id);
        //var pannel = $("div.tei_dip");
        var i, le, item;
        var ls = $(pannel).find(".from_to").toArray();
        var fts = [];
        le = ls.length;
        for (i = 0; i < le; i++) {
            var e = ls[i];
            var idFrom = $(e).attr('from');
            var idTo = $(e).attr('to');
            var type = $(e).attr('type');
            item = {
                'from': idFrom,
                'to': idTo,
                'type': type
            };
            fts.push(item);
        }
        var h, h0, h1, id0, id1, e0, e1;
        var spl = '';
        var spr = '';
        var dl = '"';
        var dr = '"';
        var idml = {
            'directspeech': '«',
            'monologue': '“'
        };
        var idmr = {
            'directspeech': '»',
            'monologue': '”'
        };
        le = fts.length;
        for (i = 0; i < le; i++) {
            item = fts[i];
            id0 = item.from;
            id1 = item.to;
            var clazz = item.type;
            // diplomatica
            // directbeg / monologuebeg
            e0 = $('#' + id0);
            var s = e0.html();
            //s=s[0].toUpperCase()+s.substr(1);
            h0 = spl + dl + s;
            e0.html(h0).addClass(clazz + "beg");
            // directend / monologueend
            e1 = $('#' + id1);
            h = e1.html();
            // impone la visualizzazione quando termina con .,?,!
            var x = !!h.match(/[.!?]/gi) || false;
            if (x) h = h.replace(/".|\!|\?/g, '');
            h1 = h + dr + spr;
            e1.html(h1).addClass(clazz + "end");
            if (x) e1.removeClass('pc_ed');
            // interpret
            // directbeg / monologuebeg
            var ap = idml[clazz];
            e0 = $('#x' + id0);
            //console.log(id0)
            s = e0.html();
            //var t=e0.text();
            //console.log(s);
            s = s[0].toUpperCase() + s.substr(1);
            //console.log(s);
            //console.log(t);
            //console.log("");
            h0 = spl + ap + s;
            e0.html(h0).addClass(clazz + "beg");
            e0.html(h0).addClass("directspeech_start_int ");
            // directend / monologueend
            var cl = idmr[clazz];
            e1 = $('#x' + id1);
            h1 = e1.html() + cl + spr;
            e1.html(h1).addClass(clazz + "end");
        }
        var ws = $(pannel).find("div.w").toArray();
        var w;
        var okd = false;
        var okm = false;
        le = ws.length;
        var id_int;
        for (i = 0; i < le; i++) {
            w = $(ws[i]);
            id_int = '#x' + w.prop('id');
            if (w.hasClass('directspeechbeg'))
                okd = true;
            if (w.hasClass('monologuebeg'))
                okm = true;
            if (okd) {
                w.addClass('directspeech');
                $(id_int).addClass('directspeech');
            }
            if (okm) {
                w.addClass('monologue');
                $(id_int).addClass('monologue');
            }
            if (w.hasClass('directspeechend'))
                okd = false;
            if (w.hasClass('monologueend'))
                okm = false;
        }
    },
    setAfterPoint: function(cod) {
        var pannel_id = TextInfoLst[cod].int_id;
        var pannel = $(pannel_id);
        var pcs = $(pannel).find(".pc_ed_upc_int").toArray();
        for (var i = 0; i < pcs.length; i++) {
            var pc = $(pcs[i]);
            var nx = $(pc).next();
            var nxid = $(nx).prop('id');
            // non è in fondo riga
            if (!!nxid) continue;
            var prl = $(pc).parents('div.l')[0];
            var nxl = $(prl).nextAll('div.l').first();
            var wf = $(nxl).find("div.w").first();
            $(wf).addClass('capitaiize_afp_int');
        }
    }
};