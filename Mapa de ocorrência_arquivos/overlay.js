google.maps.__gjsload__('overlay', function(_){var bv=_.na("g"),cv=_.n(),dv=function(a){a.If=a.If||new cv;return a.If},ev=function(a){this.P=new _.ng(function(){var b=a.If;if(a.getPanes()){if(a.getProjection()){if(!b.g&&a.onAdd)a.onAdd();b.g=!0;a.draw()}}else{if(b.g)if(a.onRemove)a.onRemove();else a.remove();b.g=!1}},0)},fv=function(a,b){function c(){return _.og(e.P)}var d=dv(a),e=d.qe;e||(e=d.qe=new ev(a));_.C(d.S||[],_.S.removeListener);var f=d.$=d.$||new _.Ql,g=b.__gm;f.bindTo("zoom",g);f.bindTo("offset",g);f.bindTo("center",g,"projectionCenterQ");
f.bindTo("projection",b);f.bindTo("projectionTopLeft",g);f=d.Eh=d.Eh||new bv(f);f.bindTo("zoom",g);f.bindTo("offset",g);f.bindTo("projection",b);f.bindTo("projectionTopLeft",g);a.bindTo("projection",f,"outProjection");a.bindTo("panes",g);d.S=[_.S.addListener(a,"panes_changed",c),_.S.addListener(g,"zoom_changed",c),_.S.addListener(g,"offset_changed",c),_.S.addListener(b,"projection_changed",c),_.S.addListener(g,"projectioncenterq_changed",c)];c();b instanceof _.we&&(_.Um(b,"Ox"),_.Wm("Ox","-p",a))},
iv=function(a){if(a){var b=a.getMap(),c=a.__gmop;if(c){if(c.map==b)return;a.__gmop=null;c.Pf()}if(b&&b instanceof _.we){var d=b.__gm;d.overlayLayer?a.__gmop=new gv(b,a,d.overlayLayer):d.g.then(function(e){e=e.na;var f=new hv(b,e);e.pa(f);d.overlayLayer=f;iv(a)})}}},gv=function(a,b,c){this.map=a;this.ka=b;this.sl=c;this.ae=!1;_.Um(this.map,"Ox");_.Wm("Ox","-p",this.ka);c.h.push(this);c.g&&jv(this,c.g);c.i.zf()},jv=function(a,b){a.ka.get("projection")!=b&&(a.ka.bindTo("panes",a.map.__gm),a.ka.set("projection",
b))},hv=function(a,b){this.j=a;this.i=b;this.g=null;this.h=[]};_.A(bv,_.T);bv.prototype.changed=function(a){"outProjection"!=a&&(a=!!(this.get("offset")&&this.get("projectionTopLeft")&&this.get("projection")&&_.M(this.get("zoom"))),a==!this.get("outProjection")&&this.set("outProjection",a?this.g:null))};_.A(ev,_.T);gv.prototype.draw=function(){this.ae||(this.ae=!0,this.ka.onAdd&&this.ka.onAdd());this.ka.draw&&this.ka.draw()};gv.prototype.Pf=function(){_.Xm("Ox","-p",this.ka);this.ka.unbindAll();this.ka.set("panes",null);this.ka.set("projection",null);_.hb(this.sl.h,this);this.ae&&(this.ae=!1,this.ka.onRemove?this.ka.onRemove():this.ka.remove())};hv.prototype.dispose=_.n();
hv.prototype.vb=function(a,b,c,d,e,f){var g=this.g=this.g||new _.Qm(this.j,this.i,_.n());g.vb(a,b,c,d,e,f);a=_.Ca(this.h);for(b=a.next();!b.done;b=a.next())b=b.value,jv(b,g),b.draw()};_.Oe("overlay",{wg:function(a){if(a){var b=a.getMap();if(b&&b instanceof _.we||a.__gmop)iv(a);else{b=a.getMap();var c=dv(a),d=c.Jk;c.Jk=b;d&&(c=dv(a),(d=c.$)&&d.unbindAll(),(d=c.Eh)&&d.unbindAll(),a.unbindAll(),a.set("panes",null),a.set("projection",null),_.C(c.S,_.S.removeListener),c.S=null,c.qe&&(c.qe.P.Ha(),c.qe=null),_.Xm("Ox","-p",a));b&&fv(a,b)}}},preventMapHitsFrom:function(a){_.Kn(a,{onClick:function(b){return _.bn(b.event)},Ca:function(b){return _.Zm(b)},Vb:function(b){return _.$m(b)},Pa:function(b){return _.$m(b)},
Ga:function(b){return _.an(b)}}).rc(!0)},preventMapHitsAndGesturesFrom:function(a){a.addEventListener("click",_.Nd);a.addEventListener("contextmenu",_.Nd);a.addEventListener("dblclick",_.Nd);a.addEventListener("mousedown",_.Nd);a.addEventListener("mousemove",_.Nd);a.addEventListener("MSPointerDown",_.Nd);a.addEventListener("pointerdown",_.Nd);a.addEventListener("touchstart",_.Nd);a.addEventListener("wheel",_.Nd)}});});
