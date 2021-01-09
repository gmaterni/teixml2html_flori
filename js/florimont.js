
var teimed = function(sign) {
    getTeiMed(sign);
};

var florimon_init = function(url) {
    menuh_init();
    pag(url);
};

var pag = function(pag) {
  var url="./pag/"+pag;
    var call = function(rsp) {
        $('#ua').html(rsp.responseText);
    };
    UaRq.get(url, "", call, null, 'text');
};

var menuh_init = function() {
    var mvav = null;

    $(".title,.last ,#head,#ua").mouseenter(function() {
        $(".menuv").hide();
        $(".mvdv").hide();
    });

    $("a.mvah").mouseenter(function() {
        $(".menuv").hide();
        $(".mvdv").hide();
        $("a.mvah").removeClass('active');
        var li = $(this).parents('li')[0];
        $(li).find('div').show();
        $(li).find('a.mvah').addClass('active');
    });

    $("a.mvav").mouseenter(function() {
        $(".menuv").hide();
        $("a.mvah").removeClass('active');
        $("a.mvav").removeClass('active');
        var li = $(this).parents('li')[0];
        $(li).find('a.mvah').addClass('active');
        var x = this;
        mvav = x;
        var id = $(x).attr('mv');
        var d = $(x).parents('div')[0];
        var p = $(d).position();
        var tp = (x.offsetTop + 75).toString() + "px";
        var l = $(d).css("left");
        var w = $(d).css("width");
        var lf;
        var lf = (parseInt(l) + parseInt(w)).toString() + "px";
        var lfr=parseInt(lf);
        if(lfr > 1200)
            lf = (parseInt(l) - parseInt(w) -98).toString() + "px";
        $(".menuv ").hide();
        $('#' + id).show();
        $(".menuvs").css("left", lf);
        $(".menuvs").css("top", tp);
    });

    $(".menuv ul li a ").mouseenter(function() {
        $(mvav).addClass('active');
    });

    $(".mvav ").click(function() {
        $(".menuv").hide();
        $(".mvdv").hide();
    });

    $(".menuv ul li a ").click(function() {
        $(".menuv").hide();
        $(".mvdv").hide();
    });
};


// _blank, _parent,  _self,  _top
var wop;
var FlSynOpen= function(){
    var url = "flsyn.html";
    var op = `width=1200,height=900, top=100,left=100,
    scrollbars=1,
    resizable=1,
    toolbar=0,
    status=0,
    menubar=0,
    titlebar=0 `;
    wop = window.open("", "", op);
    wop.location.href = url
}

FlSynClose=function(){
wop.close();
}

var woppag;
var open_pag= function(url){
    var op = `width=1200,height=900, top=100,left=100,
    scrollbars=1,
    resizable=1,
    toolbar=0,
    status=0,
    menubar=0,
    titlebar=0 `;
    woppag = window.open("", "", op);
    woppag.location.href = url
}

close_pag=function(){
  woppag.close();
}