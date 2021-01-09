
/* jshint esversion: 6 */

var TextInfoMap = {
    "par1": {
        'url': "html/par1/txt/par1.html",
        'urleps': "html/par1/txt/_EPS_.html",
        'imgs': "imgs/par/par_243t6_",
        'name': 'G (paris)'
    },
    "tor1": {
        'url': "html/tor1/txt/tor1.html",
        'urleps': "html/tor1/txt/_EPS_.html",
        'imgs': "imgs/tor/tor_lii16_",
        'name': 'K (torino)'
    },
    "tou1": {
        'url': "html/tou1/txt/tou1.html",
        'urleps': "html/tou1/txt/_EPS_.html",
        'imgs': "imgs/tou/tou_941_",
        'name': 'T (tours)'
    },
    "ven1": {
        'url': "html/ven1/txt/ven1.html",
        'urleps': "html/ven1/txt/_EPS_.html",
        'imgs': "imgs/ven/ven_frz22_",
        'name': 'I (venezia)'
    }
};


var getTeiMed = function (text_cod) {
    var info = TextInfoMap[text_cod];
    var call = function (rsp) {
        document.getElementById('ua').innerHTML = "";
        document.getElementById('ua').innerHTML = rsp.responseText;
        UaFl.init(text_cod);
        UaWait.hide();
    };
    UaWait.show();
    UaRq.get(info.url, "", call, null, 'text');
};

var EpsMgr = {
    wait: false,
    ref_array: null,
    text_cod: null,
    init: function () {
        this.text_cod = UaFl.text_cod;
        this.ref_array = [];
        for (var i = 0; i < UaFl.eps_array.length; i++) {
            var ep = UaFl.eps_array[i];
            var ref = $(ep).attr('ref');
            this.ref_array.push(ref);
        }
    },
    getUrl: function (n) {
        var ref = this.ref_array[n];
        var rf = ref.replace('#', '');
        var text_cod = EpsMgr.text_cod;
        var info = TextInfoMap[text_cod];
        var url = info.urleps.replace('_EPS_', rf);
        return url;
    },
    removeAll: function () {
        var pds = $('#pannel_dip_id  div.div_text').toArray();
        var pis = $('#pannel_int_id  div.div_text').toArray();
        for (var i = 0; i < pds.length; i++) {
            pds[i].innerHTML = "";
            pis[i].innerHTML = "";
        }
    }
};

var UaFl = {
    lk_imgs_base: null,
    line_select: true,
    line_status: 1,
    pannel_version: 'd',
    pag_curr_id: '',
    eps_num: 0,
    eps_array: null,
    pannel_img_width: null,
    is_note_show: false,
    init: function (text_cod, lk_imgs) {
        this.text_cod = text_cod;
        var info = TextInfoMap[text_cod];
        UaFl.lk_imgs_base = info.imgs;
        UaFl.eps_array = $('#pannel_dip_id').find('div.div_text').toArray();
        UaFl.eps_num = 0;
        UaFl.pannel_img_width = $('#pannel_img_id').width();
        EpsMgr.init(text_cod);
        UaFl.htmlBarText(info.name);
        UaFl.htmlBarImg();
        TeiBarSpy.init();
        TeiBarAbr.init();
        UaBarVert.init();
        UaFl.showInit();
    },
    htmlBarText: function (sign) {
        var html = "" +
            "<div class='sign'><span>" + sign + "</span></div>" +
            "<div class='ul'>" +
            "<ul>" +
            "<li><a href='javascript:UaFl.showPagAll();'><span>All</span></a></li> " +
            "<li><a class='pn' href='javascript:UaBarVert.showPagPrev();'>" +
            "<img src='css/ico/prev.png' height='24' /></a></li> " +
            "<li><a class='pn' href='javascript:UaBarVert.showPagSucc();'>" +
            "<img src='css/ico/next.png' height='24' /></a></li> " +
            //"<li><a href='javascript: UaFl.toggleSelectLine()'><span>Sel..</span></a></li> " +
            "<li><a href='javascript: UaFl.toggleLnum()'><span>Lines n.</span></a></li> " +
            "<li><a href='javascript:UaFl.showDip();'><span>Dipl.</span></a></li> " +
            "<li><a href='javascript:UaFl.showInt();'><span>Int.</span></a></li> " +
            "<li><a href='javascript:UaFl.showDipInt()'><span>Dipl.&Int.</span></a></li> " +
            "<li><a href='javascript:UaFl.showNotes()'><span>Notes</span></a></li> " +
            "<li><a class='tei' href='javascript:TeiBarSpy.show()'>" +
            "<img src='css/ico/info.png' height='25' width='35'/></a></li> " +
            "<li><a class='tei' href='javascript:TeiBarAbr.show()'>" +
            "<img src='css/ico/abr.png' height='25' width='39'/></a></li> " +
            "<li><a class='tei' href='javascript:TeiHelp.toggle();'>" +
            "<img src='css/ico/help.png' height='25' width='35' /></a></li> " +
            "</ul>" +
            "</div>";
        $('#bar_text_id').html(html).show();
        //$('#bar_text_id').find('a').click(function() {//$(this).toggleClass('bar_select'); });
    },
    htmlBarImg: function () {
        var html = "" +
            "<div class='ul'>" +
            "<ul>" +
            "<li><a href='javascript:UaFl.incrImgPag();'><img src='css/ico/zoom_in.png' height='24'></a></li>" +
            "<li><a href='javascript:UaFl.decrImgPag();'><img src='css/ico/zoom_out.png' height='24'></a> </li>" +
            "<li><a href='javascript:UaFl.defImgPag();'><img src='css/ico/zoom_eq.png' height='24'></a> </li>" +
            "</ul>" +
            "</div>";
        $('#bar_img_id').html(html).show();
    },
    setEpsNum: function (n) {
        UaFl.eps_num = n;
        this.removeNotes();
    },
    // id0 <= id <=id1
    rangeIds: function (ls, id0, id1) {
        var i;
        var ok = 0;
        var ids = [];
        for (i = 0; i < ls.length; i++) {
            id = $(ls[i]).prop('id');
            if (id == id0)
                ok = 1;
            if (ok)
                ids.push(id);
            if (id == id1)
                break;
        }
        return ids;
    },
    getIdVers: function (id) {
        var p = id.indexOf('x');
        var id_int = '';
        var id_dip = '';
        if (p == 0) {
            id_dip = id.substr(1);
            id_int = id;
        } else {
            id_dip = id;
            id_int = 'x' + id;
        }
        return {
            dip: id_dip,
            int: id_int
        };
    },
    getElemIdVers: function (e) {
        var id = e.attr('id');
        var ids = UaFl.getIdVers(id);
        return ids;
    },
    syncPannelScroll: function () {
        var timeout;
        $('#pannel_dip_id, #pannel_int_id').on("scroll", function callback() {
            clearTimeout(timeout);
            var source = $(this);
            var ref = $(source.is("#pannel_dip_id") ? '#pannel_int_id' : '#pannel_dip_id');
            ref.off("scroll").scrollTop(source.scrollTop());
            timeout = setTimeout(function () {
                ref.on("scroll", callback);
            }, 100);
            //window.requestAnimationFrame(function() {ref.on("scroll", callback); }, 100);
        });
    },
    onSelectLine: function () {
        var line_enter = function (e) {
            var elm = $(e.currentTarget);
            var idx = UaFl.getElemIdVers(elm);
            $('#' + idx.dip).addClass("line_select");
            $('#' + idx.int).addClass("line_select");
        };
        var line_leave = function (e) {
            var elm = $(e.currentTarget);
            var idx = UaFl.getElemIdVers(elm);
            $('#' + idx.dip).removeClass("line_select");
            $('#' + idx.int).removeClass("line_select");
        };
        $("div.l").on("mouseenter", function (e) {
            line_enter(e);
        });
        $("div.l").on("mouseleave", function (e) {
            line_leave(e);
        });
    },
    offSelectLine: function () {
        $("div.l").off("mouseenter");
        $("div.l").off("mouseleave");
    },
    onSelectNote: function () {
        $(".ptr").on("click", function (evn) {
            UaFl.showNote(evn.target.id);
        });
    },
    toggleLnum: function () {
        $("span.lnum").toggleClass("teimed_hidden");
    },
    toggleSelectLine: function () {
        if (this.line_select == false) {
            this.onSelectLine();
            this.line_select = true;
        } else {
            this.offSelectLine();
            this.line_select = false;
        }
    },
    //
    showInit: function () {
        UaFl.pannel_version = 'd';
        UaFl.showPagBarImg();
        $("#pannel_dip_id").addClass("teimed1_left");
        $("#pannel_int_id").hide();
        $("#pannel_dip_id").show();
    },
    showDip: function () {
        this.showInit();
        UaFl.showPagId(UaFl.pag_curr_id);
    },
    showInt: function () {
        UaFl.pannel_version = 'i';
        UaFl.showPagBarImg();
        $("#pannel_int_id").removeClass("teimed2_left");
        $("#pannel_int_id").addClass("teimed1_left");
        $("#pannel_dip_id").hide();
        $("#pannel_int_id").show();
        UaFl.showPagId(UaFl.pag_curr_id);
    },
    showDipInt: function () {
        let vers = UaFl.pannel_version;
        UaFl.pannel_version = 'di';
        UaFl.hidePagBarImg();
        $("#pannel_int_id").removeClass("teimed1_left");
        $("#pannel_int_id").removeClass("teimed2_left");
        $("#pannel_dip_id").removeClass("teimed1_left");
        $("#pannel_dip_id").removeClass("teimed2_left");
        $("#pannel_dip_id").addClass("teimed1_left");
        $("#pannel_int_id").addClass("teimed2_left");
        $("#pannel_dip_id").show();
        $("#pannel_int_id").show();
        if (vers == 'd') {
            let top = $("#pannel_dip_id").scrollTop();
            $("#pannel_int_id").scrollTop(top);
        } else if (vers == 'i') {
            let top = $("#pannel_int_id").scrollTop();
            $("#pannel_dip_id").scrollTop(top);
        } else { }
        UaFl.showPagId(UaFl.pag_curr_id);
    },
    //
    showPagAll: function (pag_id) {
        if (UaFl.pannel_version == 'd') {
            $('#pannel_dip_id').find('.div_text,.pb,.cb,.lg,.l').show();
        } else if (UaFl.pannel_version == 'i') {
            $('#pannel_int_id').find('.div_text,.pb,.cb,.lg,.l').show();
        } else {
            $('#pannel_dip_id').find('.div_text,.pb,.cb,.lg,.l').show();
            $('#pannel_int_id').find('.div_text,.pb,.cb,.lg,.l').show();
            UaFl.syncPannelScroll();
        }
    },
    showPagId: function (pag_id) {
        //console.log("showPagId:"+pag_id);
        var id_di = UaFl.getIdVers(pag_id);
        UaFl.pag_curr_id = id_di.dip;
        var pag_num = $('#' + id_di.dip).attr('n');
        if (UaFl.pannel_version == 'd') {
            UaFl.showPagVers(id_di.dip);
            UaFl.showPagImg(pag_num);
        } else if (UaFl.pannel_version == 'i') {
            UaFl.showPagVers(id_di.int);
            UaFl.showPagImg(pag_num);
        } else {
            UaFl.showPagVers(id_di.dip);
            UaFl.showPagVers(id_di.int);
        }
    },
    showPagVers: function (pag_id) {
        var pannel = $("#" + pag_id).parents('div.text_pannel')[0];
        $(pannel).find('.div_text,.pb,.cb,.lg,.l').hide();
        var pbs = $(pannel).find('.pb').toArray();
        var pg1_id = pag_id;
        var pg2_id = null;
        var i, id;
        for (i = 0; i < pbs.length; i++) {
            if (pag_id == $(pbs[i]).prop('id')) {
                if (i < pbs.length)
                    pg2_id = $(pbs[i + 1]).prop('id');
                break;
            }
        }
        var l_first = null;
        var l_last = null;
        var lss = [];
        var ok = 0;
        var ls = $(pannel).find(".div_text,.pb,.cb,.lg,.l").toArray();
        for (i = 0; i < ls.length; i++) {
            var e = ls[i];
            id = $(e).prop('id');
            if (id == pg1_id)
                ok = 1;
            if (!!pg2_id && id == pg2_id)
                break;
            if (ok == 0)
                continue;
            lss.push(e);
            if ($(ls[i]).hasClass('l')) {
                if (!l_first)
                    l_first = ls[i];
                l_last = ls[i];
            }
        }
        var text_first = $(l_first).parents('.div_text')[0];
        var text_last = $(l_last).parents('.div_text')[0];
        var lg_first = $(l_first).parents(".lg")[0];
        var lg_last = $(l_last).parents(".lg")[0];
        //controllo inizio pagina NON con lg
        $(pannel).find('div.lg span.lgnum').removeClass('nodisp');
        var lg = lss[2];
        if (!$(lg).hasClass('lg')) {
            var x = $(lg_first).find('span')[0];
            $(x).addClass('nodisp');
        }
        $(lg_first).show();
        for (i = 0; i < lss.length; i++)
            $(lss[i]).show();
        $(text_last).show();
        $(lg_last).show();
        //$("#pannel_dip_id").scrollTop(0);
        //$("#pannel_int_id").scrollTop(0);
    },
    showNote: function (ptr_id) {
        var show = function (ptr_id, note_id) {
            var xxid = 'xx' + ptr_id;
            var ptr = $('#' + ptr_id);
            var n = $(ptr).html();
            var pannel = ptr.parents('div.text_pannel')[0];
            var notes = $(pannel).find("div.notes")[0];
            var hn = $(note_id).html();
            var h = '<div id="' + xxid + '" class="note_show"><div class="note_n">' + n + '</div>' + hn + '</div>';
            var y = ptr.offset().top + 0;
            $(notes).append(h);
            var nn = $('#' + xxid);
            $(nn).offset({
                'top': y
            }).show();
            $(nn).on("click", function (evn) {
                $('#' + xxid).remove();
            });
        };
        var ptr = $('#' + ptr_id);
        if (!ptr) return;
        var xxid = 'xx' + ptr_id;
        var nota_w = $('#' + xxid)[0];
        if (!nota_w) {
            var note_id = $(ptr).attr("target_note");
            $("div.note_show").remove();
            this.is_note_show = true;
            show(ptr_id, note_id);
        } else {
            $(nota_w).remove();
            this.is_note_show = false;
        }
    },
    removeNotes: function () {
        $("div.note_show").remove();
        this.is_note_show = false;
    },
    showNotes: function () {
        if (this.is_note_show) {
            this.removeNotes();
            return;
        }
        $("div.note_show").remove();
        UaFl.showNotesVers("#pannel_dip_id");
        UaFl.showNotesVers("#pannel_int_id");
        this.is_note_show = true;
    },
    showNotesVers: function (pannel_id) {
        var eps = $(pannel_id).find('div.div_text').toArray();
        var ep = eps[UaFl.eps_num];
        var ps = $(ep).find("a.ptr").toArray();
        if (ps.length == 0)
            return;
        var ptr = ps[0];
        var pannel = $(ptr).parents('div.text_pannel')[0];
        var notes = $(pannel).find("div.notes")[0];
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i];
            var n = $(p).html();
            var note_id = $(p).attr("target_note");
            var hn = $(note_id).html();
            var h = '<div class="list note_show"><div class="note_n">' + n + '</div>' + hn + '</div>';
            $(notes).append(h);
        }
    },
    hidePagBarImg: function () {
        $('#pannel_img_id').hide();
        $("#bar_img_id").hide();
    },
    showPagBarImg: function () {
        $('#pannel_img_id').show();
        $("#bar_img_id").show();
        UaFl.defImgPag();
    },
    //
    showPagImg: function (pag_n) {
        var url_pag = function (n) {
            var lk0 = UaFl.lk_imgs_base;
            var sn = "00" + n;
            var lk1 = sn.substr(sn.length - 4);
            var lk = lk0 + lk1 + ".jpg";
            return lk;
        };
        var url = url_pag(pag_n);
        var html = `
        <div id="div_img_id"  class="zoom"  >
          <img src="${url}" />
        </div> `;
        $('#pannel_img_id').html(html);
        var ew = $("#div_img_id")[0];
        UaDrag(ew);
        $("#bar_img_id").show();
        UaFl.defImgPag();
    },
    defImgPag: function () {
        $("#div_img_id img").width("100%");
        $('#div_img_id').css({
            "left": 0,
            "top": 0
        });
    },
    incrImgPag: function () {
        let w0 = UaFl.pannel_img_width;
        let w1 = $('#div_img_id img').width() + 200;
        let w2 = (w1 / w0 * 100).toString() + "%";
        console.log(w2);
        $("#div_img_id img").width(w2);
    },
    decrImgPag: function () {
        let w0 = UaFl.pannel_img_width;
        let w1 = $('#div_img_id img').width() - 200;
        if (w1 < UaFl.pannel_img_width) {
            UaFl.defImgPag();
            return;
        }
        let w2 = (w1 / w0 * 100).toString() + "%";
        console.log(w2);
        $("#div_img_id img").width(w2);
    }
};
//
var TeimedCss = {
    init: function () {
        TeimedCss.setDirMonoAggl();
        TeimedCss.setAfterPoint();
        TeimedCss.setBegEpisode();
    },
    // setta discorso diretto , monologo e agglutinazione utilizzando gli
    // spam fro_.. to .. tyoe ..
    setDirMonoAggl: function () {
        var i, item;
        var pannel = $("#pannel_dip_id");
        var ls = $(pannel).find(".from_to").toArray();
        var fts = [];
        let le = ls.length;
        for (i = 0; i < le; i++) {
            let e = ls[i];
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
        //
        const direct = "directspeech";
        const monolog = "monologue";
        const aggl = "agglutination";
        const aggl_u = "agglutination_uncert";
        const class_info = {
            'directspeech': {
                'tp': 'dm',
                'd': {
                    'css_class': 'directspeech',
                    'ap': '"',
                    'cl': '"'
                },
                'i': {
                    'css_class': 'directspeech',
                    'ap': '«',
                    'cl': '»'
                }
            },
            'monologue': {
                'tp': 'dm',
                'd': {
                    'css_class': 'monologue',
                    'ap': '"',
                    'cl': '"'
                },
                'i': {
                    'css_class': 'monologue',
                    'ap': '“',
                    'cl': '”'
                }
            },
            'agglutination': {
                'tp': 'a',
                'd': {
                    'css_class': 'aggl',
                    'ap': '',
                    'cl': ''
                },
                'i': {
                    'css_class': 'aggl_int',
                    'ap': '',
                    'cl': ''
                }
            },
            'agglutination_uncert': {
                'tp': 'a',
                'd': {
                    'css_class': 'aggl-uncert',
                    'ap': '',
                    'cl': ''
                },
                'i': {
                    'css_class': 'aggl-uncert_int',
                    'ap': '',
                    'cl': ''
                }
            }
        };
        var elm0, html0, elm1, html1,h,h0,h1,css;
        le = fts.length;
        for (let i = 0; i < le; i++) {
            item = fts[i];
            let id0 = item.from;
            let id1 = item.to;
            let clazz = item.type;
            let js = class_info[clazz];
            if (!js) {
                alert("Error class:" + clazz);
            }
           // diplomatica
            elm0 = $('#' + id0);
            html0 = elm0.html();
            elm1 = $('#' + id1);
            html1 = elm1.html();
            if (js.tp == 'dm') {  // diretto / monologo
                // inizio segmento
                h0 = js.d.ap + html0;
                css = js.d.css_class;
                elm0.html(h0).addClass(css);
                // fine segmento
                h = html1;
                // impone la visualizzazione quando termina con .,?,!
                /*
                let x = !!h.match(/[.!?]/gi) || false;
                if (x) h = h.replace(/".|\!|\?/g, '');
                */
                h1 = h + js.d.cl;
                css = js.d.css_class;
                elm1.html(h1).addClass(css);
                //if (x) elm1.removeClass('pc_ed');
            }
            else { // agglutinazione
                // inizio segmento
                h0 = js.d.ap + html0;
                css = js.d.css_class;
                elm0.html(h0).addClass(css);
                // fine segmento
                h = html1;
                h1 = h + js.d.cl;
                css = js.d.css_class;
                elm1.html(h1).addClass(css);
            }

            // interpretativa
            // solo apici per discorso diretto e monologo
            // css con effetto nullo per agglutinazione
            elm0 = $('#x' + id0);
            html0 = elm0.html();
            elm1 = $('#x' + id1);
            html1 = elm1.html();
            if (js.tp == 'dm') {  // diretto / monologo
                // inizio segmento
                h = html0;
                // Maiuscolo per direct e monologue in interpretativa
                h = h[0].toUpperCase() + h.substr(1);
                h0 = js.i.ap + h;
                css = js.i.css_class;
                elm0.html(h0).addClass(css);
                // capitalize
                // ?? elm0.addClass("directspeech_start_int ");
                // fine segmento
                h1 = html1 + js.i.cl;
                css = js.i.css_class;
                elm1.html(h1).addClass(css);
            }
            else { // agglutinazione
                // inizio segmento
                h0 = js.i.ap + html0;
                css = js.i.css_class;
                elm0.html(h0).addClass(css);
                // fine segmento
                h1 = html1 + js.i.cl;
                css = js.i.css_class;
                elm1.html(h1).addClass(css);
            }
        }
        // pannello diplomatica
        let ws = $(pannel).find("div.w").toArray();
        var okd = 0;
        var okm = 0;
        var oka = 0;
        var oku = 0;
        var w;
        le = ws.length;
        var id_int,w_int;
        let dr_class = class_info[direct].d.css_class;
        let mn_class = class_info[monolog].d.css_class;
        let ag_class = class_info[aggl].d.css_class;
        let au_class = class_info[aggl_u].d.css_class;
        let ag_class_i = class_info[aggl].i.css_class;
        let au_class_i = class_info[aggl_u].i.css_class;
        // setta elementi successi al primo nel segmento
        for (let i = 0; i < le; i++) {
            w = $(ws[i]);
            id_int = '#x' + w.prop('id');
            w_int = $(id_int);

            // direct
            if (w.hasClass(dr_class))
                okd = okd == 0 ? okd = 1 : okd = 0;
            if (okd > 1) {
                w.addClass(dr_class);
                w_int.addClass(dr_class);
            }
            if (okd > 0) okd++;

            // monologo
            if (w.hasClass(mn_class))
                okm = okm == 0 ? okm = 1 : okm = 0;
            if (okm > 1) {
                w.addClass(mn_class);
                w_int.addClass(mn_class);
            }
            if (okm > 0) okm++;

            //aggl
            if (w.hasClass(ag_class)) {
                if (oka == 0) {
                    oka = 1;
                }
                else {
                    oka = 0;
                    w.removeClass(ag_class);
                    w.addClass(ag_class+"-last");
                }
            }
            if (oka > 1) {
                w.addClass(ag_class);
                w_int.addClass(ag_class_i);
            }
            if (oka > 0) oka++;

            //aggl-uncert
            if (w.hasClass(au_class)) {
                if (oku == 0) {
                    oku = 1;
                }
                else {
                    oku = 0;
                    w.removeClass(au_class);
                    w.addClass(au_class+"-last");
                }
            }
            if (oku > 1) {
                w.addClass(au_class);
                w_int.addClass(au_class_i);
            }
            if (oku > 0) oku++;
        }
    },
    // Maiuscole dopo  . ? !
    setAfterPoint: function () {
        var pannel = $("#pannel_int_id");
        var pcs = $(pannel).find(".pc_ed_upc_int").toArray();
        for (var i = 0; i < pcs.length; i++) {
            var pc = $(pcs[i]);
            var nx = $(pc).next();
            var nxid = $(nx).prop('id');
            // non è in fondo riga
            if (!!nxid) continue;
            var prl = $(pc).parents('div.l')[0];
            var nxl = $(prl).next('div.l').first();
            var nxlid = $(nxl).prop('id');
            if (!nxlid) {
                var prlg = $(pc).parents('div.lg')[0];
                var nxlg = $(prlg).next('div.lg').first();
                nxl = $(nxlg).find('div.l').first();
            }
            var wf = $(nxl).find("div.w").first();
            $(wf).addClass('capitaiize_afp_int');
        }
    },
    // maiuscola la prima parola dell'episodio
    setBegEpisode: function () {
        var pannel = $("#pannel_int_id");
        var episode = $(pannel).find("div.div_text");
        var w = $(episode).find("div.w").first();
        $(w).addClass('episode_start_int');
    }
};

var UaBarVert = {
    eps_list: null,
    eps_array: null,
    pag_list: null,
    pag_used: null,
    init: function () {
        this.epsList();
        this.showEpsNum(0);
    },
    showPagPrev: function () {
        if (this.pag_used > 0)
            this.showPagNum(this.pag_used - 1);
    },
    showPagSucc: function () {
        if (this.pag_used < this.pag_list.length - 1)
            this.showPagNum(this.pag_used + 1);
    },
    showPagNum: function (n) {
        this.pag_used = n;
        var id = this.pag_list[n].pag_id;
        UaFl.showPagId(id);
        this.showPagUsed(id);
        $("#pannel_int_id").scrollTop(0);
        $("#pannel_dip_id").scrollTop(0);
    },
    showPagUsed: function (pag_id) {
        var pgs = $('#barv_text_id div.pag a').toArray();
        for (var i = 0; i < pgs.length; i++) {
            $(pgs[i]).removeClass('used');
            if (i == this.pag_used)
                $(pgs[i]).addClass('used');
        }
    },

    showEpsNum: function (n) {

        let call = function (rsp) {
            EpsMgr.removeAll();
            let h = rsp.responseText;
            $("#eps_id").html(h);
            let es = $("#eps_id").find('div.div_text').toArray();
            let hd = es[0].innerHTML;
            es[0].innerHTML = "";
            let hi = es[1].innerHTML;
            es[1].innerHTML = "";
            let ref = EpsMgr.ref_array[n];
            let pds = $('#pannel_dip_id  div.div_text').toArray();
            let pd = null;
            for (let i = 0; i < pds.length; i++) {
                if ($(pds[i]).attr('ref') == ref) {
                    pd = pds[i];
                    break;
                }
            }
            $(pd).html(hd);
            pds = $('#pannel_int_id  div.div_text').toArray();
            let pi = null;
            for (let i = 0; i < pds.length; i++) {
                if ($(pds[i]).attr('ref') == ref) {
                    pi = pds[i];
                    break;
                }
            }
            $(pi).html(hi);
            TeimedCss.init();
            UaFl.onSelectNote();
            UaFl.onSelectLine();
            UaFl.syncPannelScroll();
            ////
            UaFl.setEpsNum(n);
            UaBarVert.pagList(n);
            var h1 = UaBarVert.htmlEpsList(n);
            var h2 = UaBarVert.htmlPagList();
            var html = h1 + h2;
            $('#barv_text_id').html(html).show();
            UaBarVert.showPagNum(0);
            UaWait.hide();
        };

        var url = EpsMgr.getUrl(n);
        UaWait.show();
        UaRq.get(url, "", call, null, 'text');
    },
    epsList: function () {
        var eps = $('#pannel_dip_id').find('div.div_text').toArray();
        this.eps_array = eps;
        this.eps_list = [];
        for (var i = 0; i < eps.length; i++) {
            var type = $(eps[i]).attr('type');
            var ref = $(eps[i]).attr('ref');
            var item = {
                'i': i,
                'type': type,
                'ref': ref.replace('#', ''),
                'class': 'x'
            };
            this.eps_list.push(item);
        }
    },
    pagList: function (epn) {
        var ep = this.eps_array[epn];
        var pgs = $(ep).find('.pb').toArray();
        this.pag_list = [];
        for (var i = 0; i < pgs.length; i++) {
            var n = $(pgs[i]).attr('n');
            var id = $(pgs[i]).prop('id');
            var item = {
                'i': i,
                'n': n,
                'pag_id': id
            };
            this.pag_list.push(item);
        }
    },
    htmlEpsList: function (n) {
        this.eps_list[n].class = 'used';
        var template = '<li><a class="{class}" href="javascript:UaBarVert.showEpsNum({i})">{ref}</a></li>';
        var jt = UaJt();
        jt.append("<div><ul>");
        jt.appendList(template, this.eps_list);
        jt.append("</ul></div>");
        this.eps_list[n].class = 'x';
        return jt.text();
    },
    htmlPagList: function () {
        var template = '<li><a href="javascript:UaBarVert.showPagNum({i})">{n}</a></li>';
        var jt = UaJt();
        jt.append("<div class='pag'><ul>");
        jt.appendList(template, this.pag_list);
        jt.append("</ul></div>");
        return jt.text();
    }
};


var TeiHelp = {
    id: '#teimed_help_id',
    visible: false,
    show: function () {
        var h1 = '<div><div class="head" ><a href="javascript:TeiHelp.toggle();">x</a></div>';
        var h2 = "</div>";
        var call = function (rsp) {
            var html = h1 + rsp.responseText + h2;
            $(TeiHelp.id).addClass('teimed_help');
            $(TeiHelp.id).html(html);
            var ew = $(TeiHelp.id)[0];
            UaDrag(ew);
            TeiHelp.visible = true;
            $(TeiHelp.id).show();
        };
        var url = "html/flhelp.html";
        UaRq.get(url, "", call, null, 'text');
    },
    hide: function () {
        $(TeiHelp.id).html("");
        $(TeiHelp.id).hide();
        this.visible = false;
    },
    toggle: function () {
        if (this.visible) TeiHelp.hide();
        else TeiHelp.show();
    }
};


var TeiBarSpy = {
    id: '#teimed_bar_id',
    visible: false,
    init: function () {
        var html = `
<div>
<div class='close' ><div class='title'>Cockpit</div><a href="javascript:TeiBarSpy.hide();"">x</a></div>
<ul>
<li><a href="javascript:tei_class_reset();">reset</a></li>
<li class="sez">Scriptio</li>

<li><a href="javascript:tei_class_aggl_all();">aggl. (all)</a></li>
<li><a href="javascript:tei_class_aggl();">aggl. c.</a></li>
<li><a href="javascript:tei_class_aggl_uncert();">aggl. uc.</a></li>

<li><a href="javascript:tei_class_like('degl');">degl.</a></li>
<li><a href="javascript:tei_class_like('elis');">elis.</a></li>
<li><a href="javascript:tei_class_like('encl');">encl.</a></li>
<li><a href="javascript:tei_class_pc_ms();">pc. ms.</a></li>
<li><a href="javascript:tei_class_like('abrev');">abr.</a></li>
<li><a href="javascript:tei_class_like('sic');">sic</a></li>
<li><a href="javascript:tei_class_like('annotaz');">glossae</a></li>

<li class="sez">Genetic</li>
<li><a href="javascript:tei_class_like('subst');">subst.</a></li>
<li><a href="javascript:tei_class_like('add');">add.</a></li>
<li><a href="javascript:tei_class_like('del');">del.</a></li>
<li><a href="javascript:tei_class_like('app');">app.</a></li>

<li class="sez">Editorial</li>
<li><a href="javascript:tei_class_like('ramis');">ramiste</a></li>
<li><a href="javascript:tei_class_like('diacr');">diacr.</a></li>
<li><a href="javascript:tei_class_like('pc_ed');">pc. ed.</a></li>
<li><a href="javascript:tei_class_like('corr');">corr.</a></li>

<li class="sez">Analisys</li>
<li><a href="javascript:show_direct();">dialog.</a></li>
<li><a href="javascript:show_monolog();">monolog.</a></li>

<li class="sez">Index</li>
<li><a href="javascript:tei_class_like('persname');">persName</a></li>
<li><a href="javascript:tei_class_like('placename');">placeName</a></li>
<li><a href="javascript:tei_class_like('geogname');">geogName</a></li>

</ul>
</div>
`;
        $(TeiBarSpy.id).addClass('teimed_bar');
        $(TeiBarSpy.id).hide();
        $(TeiBarSpy.id).html(html);
        $(TeiBarSpy.id).find('a').click(function () {
            $(this).toggleClass('teibar_select');
        });
        var ew = $(TeiBarSpy.id)[0];
        this.visible = false;
        UaDrag(ew);
    },
    show: function () {
        var v = this.visible;
        if (this.visible) $(TeiBarSpy.id).hide();
        else $(TeiBarSpy.id).show();
        this.visible = !this.visible;
    },
    hide: function () {
        $(TeiBarSpy.id).hide();
        this.visible = false;
    }
};

var show_direct = function () {
    $("[class*=directspeech]").toggleClass("directspeech_spy");
};

var show_monolog = function () {
    $("[class*=monologue]").toggleClass("monologue_spy");
};

var tei_class_reset = function (cls) {
    $("*").removeClass("tei_spy");
    $('#teimed_bar_id a').removeClass("teibar_select");
};

var tei_class_like = function (cls) {
    $("[class*=" + cls + "]").toggleClass("tei_spy");
};

var tei_class_eql = function (cls) {
    $("[class=" + cls + "]").toggleClass("tei_spy");
};


var tei_class_pc_ms = function (cls) {
    if (agl) $("[class*=pc_1hd]").addClass("tei_spy");
    if (agl) $("[class*=pc_2hd]").addClass("tei_spy");
};

var tei_class_aggl_all = function () {
    $("[class*=aggl]").toggleClass("tei_spy");
};

var tei_class_aggl = function () {
   $(".aggl,.aggl-last,.aggl_int,.aggl_int-last").toggleClass("tei_spy");
};

var tei_class_aggl_uncert = function () {
    $(".aggl-uncert,.aggl-uncert-last,.aggl-uncert_int,.aggluncert_int-last").toggleClass("tei_spy");
 };



var TeiBarAbr = {
    id: '#teimed_abr_id',
    visible: false,
    init: function () {
        var html = `
<div >
<div class='close' ><div class='title'>Abréviation</div><a href="javascript:TeiBarAbr.hide();"">x</a></div>
<ul>
<li><a href="javascript:TeiBarAbr.reset();">reset</a></li>
<li class="sez">Contraction</li>
<li><a href="javascript:TeiBarAbr.spy('ab-ctr-mlt');">mlt</a></li>
<li><a href="javascript:TeiBarAbr.spy2('ab-ctr-chr|ab-ctr-chrie');">chr/chrie</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-ctr-bn');">bn</a></li>
<li><a href="javascript:TeiBarAbr.spy2('ab-ctr-nre|ab-ctr-ure');">nre/ure</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-ctr-qt');">qt</a></li>
<li class="sez">Lettre Suscrite</li>
<li><a href="javascript:TeiBarAbr.spy4('ab-sus-qe|ab-sus-qi|ab-sus-qa|ab-sus-qo');">Sur q</a></li>
<li><a href="javascript:TeiBarAbr.spy3('ab-sus-pi|ab-sus-pe|ab-sus-po');">Sur p</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-sus-to');">Sur t</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-sus-gi');">Sur g</a></li>
<li class="sez">Tironiennes</li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-7');">7</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-7barr');">7 barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-7var');">7 var.</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-9');">9</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tir-est');">est</a></li>
<li class="sez">Signes Spéciaux</li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-nas');">Tilde de nasalité</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-ap');">Tilde apostrophe</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-ang');">Tilde brisé</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-ang-q');">Tilde brisé sur q</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-curb');">Tilde crochet</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-tild-q');">Tilde sur q</a></li>
<li class="sez">Lettre Modifiée</li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-pbarr-d');">p barré droit</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-pbarr-c');">p barré courbe</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-qbarr-d');">q barré droit</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-qbarr-c');">q barré courbe</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-dbarr');">d barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-lbarr');">l barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-sbarr');">s barré</a></li>
<li><a href="javascript:TeiBarAbr.spy('ab-lm-tap');">t apostrophe</a></li>
</ul>
</div>
`;
        $(TeiBarAbr.id).addClass('teimed_bar');
        $(TeiBarAbr.id).hide();
        $(TeiBarAbr.id).html(html);
        $(TeiBarAbr.id).find('a').click(function () {
            $(this).toggleClass('teibar_select');
        });
        var ew = $(TeiBarAbr.id)[0];
        this.visible = false;
        UaDrag(ew);
    },
    show: function () {
        var v = this.visible;
        if (this.visible) $(TeiBarAbr.id).hide();
        else $(TeiBarAbr.id).show();
        this.visible = !this.visible;
    },
    hide: function () {
        $(TeiBarAbr.id).hide();
        this.visible = false;
    },
    reset: function () {
        //$("abrev").removeClass("tei_spy");
        $("[class*= abrev]").removeClass("tei_spy");
        $(TeiBarAbr.id + ' a').removeClass("teibar_select");
    },
    spy: function (cls) {
        $("[class*=" + cls + "]").toggleClass("tei_spy");
    },
    spy2: function (cls) {
        var cl = cls.split('|');
        $("[class*=" + cl[0] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[1] + "]").toggleClass("tei_spy");
    },
    spy3: function (cls) {
        var cl = cls.split('|');
        $("[class*=" + cl[0] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[1] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[2] + "]").toggleClass("tei_spy");
    },
    spy4: function (cls) {
        var cl = cls.split('|');
        $("[class*=" + cl[0] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[1] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[2] + "]").toggleClass("tei_spy");
        $("[class*=" + cl[3] + "]").toggleClass("tei_spy");
    },

};