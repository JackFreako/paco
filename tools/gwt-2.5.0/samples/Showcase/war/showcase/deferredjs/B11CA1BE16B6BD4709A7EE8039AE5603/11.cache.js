function h4b(){}
function l4b(){}
function a4b(a,b){a.b=b}
function b4b(a){if(a==S3b){return true}ZE();return a==V3b}
function c4b(a){if(a==R3b){return true}ZE();return a==Q3b}
function j4b(a){this.b=(W5b(),R5b).a;this.d=(b6b(),a6b).a;this.a=a}
function d4b(){W3b();a$b.call(this);this.b=(W5b(),R5b);this.c=(b6b(),a6b);this.e[BGc]=0;this.e[CGc]=0}
function $3b(a,b){var c;c=eU(a.ab,98);c.b=b.a;!!c.c&&(c.c[zGc]=b.a,undefined)}
function _3b(a,b){var c;c=eU(a.ab,98);c.d=b.a;!!c.c&&MWb(c.c,AGc,b.a)}
function W3b(){W3b=Nzc;P3b=new h4b;S3b=new h4b;R3b=new h4b;Q3b=new h4b;T3b=new h4b;U3b=new h4b;V3b=new h4b}
function X3b(a,b,c){var d;if(c==P3b){if(b==a.a){return}else if(a.a){throw new mpc('Only one CENTER widget may be added')}}rj(b);Rhc(a.j,b);c==P3b&&(a.a=b);d=new j4b(c);b.ab=d;$3b(b,a.b);_3b(b,a.c);Z3b(a);tj(b,a)}
function Y3b(a,b){var c,d,e,f,g,i,j;phc(a.cb,nCc,b);i=new qxc;j=new aic(a.j);while(j.a<j.b.c-1){c=$hc(j);g=eU(c.ab,98).a;e=eU(i.ie(g),144);d=!e?1:e.a;f=g==T3b?'north'+d:g==U3b?'south'+d:g==V3b?'west'+d:g==Q3b?'east'+d:g==S3b?'linestart'+d:g==R3b?'lineend'+d:sGc;phc(ur(c.cb),b,f);i.ke(g,Bpc(d+1))}}
function Z3b(a){var b,c,d,e,f,g,i,j,k,n,o,p,q,r,s,t;b=a.d;while(ZXb(b)>0){br(b,YXb(b,0))}q=1;e=1;for(i=new aic(a.j);i.a<i.b.c-1;){d=$hc(i);f=eU(d.ab,98).a;f==T3b||f==U3b?++q:(f==Q3b||f==V3b||f==S3b||f==R3b)&&++e}r=VT(bdb,Tzc,99,q,0);for(g=0;g<q;++g){r[g]=new l4b;r[g].b=$doc.createElement(xGc);DWb(b,r[g].b)}k=0;n=e-1;o=0;s=q-1;c=null;for(i=new aic(a.j);i.a<i.b.c-1;){d=$hc(i);j=eU(d.ab,98);t=$doc.createElement(yGc);j.c=t;j.c[zGc]=j.b;MWb(j.c,AGc,j.d);j.c[PCc]=nCc;j.c[NCc]=nCc;if(j.a==T3b){FWb(r[o].b,t,r[o].a);DWb(t,d.cb);t[pIc]=n-k+1;++o}else if(j.a==U3b){FWb(r[s].b,t,r[s].a);DWb(t,d.cb);t[pIc]=n-k+1;--s}else if(j.a==P3b){c=t}else if(b4b(j.a)){p=r[o];FWb(p.b,t,p.a++);DWb(t,d.cb);t[oJc]=s-o+1;++k}else if(c4b(j.a)){p=r[o];FWb(p.b,t,p.a);DWb(t,d.cb);t[oJc]=s-o+1;--n}}if(a.a){p=r[o];FWb(p.b,c,p.a);DWb(c,a.a.cb)}}
oeb(746,1,HAc);_.lc=function _Bb(){var a,b,c;Ygb(this.a,(a=new d4b,a.cb[OCc]='cw-DockPanel',a.e[BGc]=4,a4b(a,(W5b(),Q5b)),X3b(a,new o2b(gJc),(W3b(),T3b)),X3b(a,new o2b(hJc),U3b),X3b(a,new o2b(iJc),Q3b),X3b(a,new o2b(jJc),V3b),X3b(a,new o2b(kJc),T3b),X3b(a,new o2b(lJc),U3b),b=new o2b("Voici un <code>panneau de d\xE9filement<\/code> situ\xE9 au centre d'un <code>panneau d'ancrage<\/code>. Si des contenus relativement volumineux sont ins\xE9r\xE9s au milieu de ce panneau \xE0 d\xE9filement et si sa taille est d\xE9finie, il prend la forme d'une zone dot\xE9e d'une fonction de d\xE9filement \xE0 l'int\xE9rieur de la page, sans l'utilisation d'un IFRAME.<br><br>Voici un texte encore plus obscur qui va surtout servir \xE0 faire d\xE9filer cet \xE9l\xE9ment jusqu'en bas de sa zone visible. Sinon, il vous faudra r\xE9duire ce panneau \xE0 une taille minuscule pour pouvoir afficher ces formidables barres de d\xE9filement!"),c=new h_b(b),c.cb.style[PCc]=mJc,c.cb.style[NCc]=nJc,X3b(a,c,P3b),Y3b(a,'cwDockPanel'),a))};oeb(1051,1007,Xzc,d4b);_.Db=function e4b(a){Y3b(this,a)};_.Wb=function f4b(a){var b;b=RYb(this,a);if(b){a==this.a&&(this.a=null);Z3b(this)}return b};_.a=null;var P3b,Q3b,R3b,S3b,T3b,U3b,V3b;oeb(1052,1,{},h4b);oeb(1053,1,{98:1},j4b);_.a=null;_.c=null;oeb(1054,1,{99:1},l4b);_.a=0;_.b=null;var w7=Xoc(pHc,'DockPanel',1051),v7=Xoc(pHc,'DockPanel$TmpRow',1054),bdb=Woc(wHc,'DockPanel$TmpRow;',1382,v7),t7=Xoc(pHc,'DockPanel$DockLayoutConstant',1052),u7=Xoc(pHc,'DockPanel$LayoutData',1053);uBc(wn)(11);