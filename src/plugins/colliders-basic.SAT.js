(function() {



var Colliders = {};

Colliders.types = ["Box", "Polygon", "Circle"];

Colliders.test = function(a, b, res) {
    if(a instanceof this.Box) var a = a.toPolygon();
    if(b instanceof this.Box) var b = b.toPolygon();

    if(a instanceof this.Polygon) {
        if(b instanceof this.Polygon) {
            return SAT.testPolygonPolygon(a, b, res);
        }
        else {
            return SAT.testPolygonCircle(a, b, res);
        }
    }
    else {
        if(b instanceof this.Polygon) {
            return SAT.testCirclePolygon(a, b, res);
        }
        else {
            return SAT.testCircleCircle(a, b, res);
        }
    }
}

Colliders.testAll= function(a, b, cb) {
    var res = new this.Response();
    var collision;

    for(var i = 0, len = b.length; i < len; i++) {
        collision = this.test(a, b[i], res);
        cb(res, collision);
        res.clear();
    }

    return this;
}








/* Include the excellent SAT.js (minified), which does the actual collision checks */
/* SAT.js - Version 0.4.1 - Copyright 2014 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */
function w(){function a(b,k){this.x=b||0;this.y=k||0}function e(b,k){this.pos=b||new a;this.points=k||[];this.angle=0;this.offset=new a;this.recalc()}function u(b,k,c){this.pos=b||new a;this.w=k||0;this.h=c||0}function v(){this.b=this.a=null;this.overlapN=new a;this.overlapV=new a;this.clear()}function z(b,k,c){for(var a=Number.MAX_VALUE,f=-Number.MAX_VALUE,h=b.length,l=0;l<h;l++){var g=b[l].d(k);g<a&&(a=g);g>f&&(f=g)}c[0]=a;c[1]=f}function A(b,k,c,a,f,h){var l=q.pop(),g=q.pop();b=d.pop().c(k).sub(b);
k=b.d(f);z(c,f,l);z(a,f,g);g[0]+=k;g[1]+=k;if(l[0]>g[1]||g[0]>l[1])return d.push(b),q.push(l),q.push(g),!0;h&&(c=0,l[0]<g[0]?(h.aInB=!1,l[1]<g[1]?(c=l[1]-g[0],h.bInA=!1):(c=l[1]-g[0],a=g[1]-l[0],c=c<a?c:-a)):(h.bInA=!1,l[1]>g[1]?(c=l[0]-g[1],h.aInB=!1):(c=l[1]-g[0],a=g[1]-l[0],c=c<a?c:-a)),a=Math.abs(c),a<h.overlap&&(h.overlap=a,h.overlapN.c(f),0>c&&h.overlapN.reverse()));d.push(b);q.push(l);q.push(g);return!1}function x(b,k){var c=b.e(),a=k.d(b);return 0>a?-1:a>c?1:0}function B(b,k,c){for(var a=
d.pop().c(k.pos).sub(b.pos),f=k.r,h=f*f,l=b.calcPoints,g=l.length,s=d.pop(),p=d.pop(),m=0;m<g;m++){var e=m===g-1?0:m+1,q=0===m?g-1:m-1,t=0,r=null;s.c(b.edges[m]);p.c(a).sub(l[m]);c&&p.e()>h&&(c.aInB=!1);var n=x(s,p);if(-1===n){s.c(b.edges[q]);e=d.pop().c(a).sub(l[q]);n=x(s,e);if(1===n){n=p.f();if(n>f)return d.push(a),d.push(s),d.push(p),d.push(e),!1;c&&(c.bInA=!1,r=p.normalize(),t=f-n)}d.push(e)}else if(1===n){if(s.c(b.edges[e]),p.c(a).sub(l[e]),n=x(s,p),-1===n){n=p.f();if(n>f)return d.push(a),d.push(s),
d.push(p),!1;c&&(c.bInA=!1,r=p.normalize(),t=f-n)}}else{e=s.g().normalize();n=p.d(e);q=Math.abs(n);if(0<n&&q>f)return d.push(a),d.push(e),d.push(p),!1;c&&(r=e,t=f-n,0<=n||t<2*f)&&(c.bInA=!1)}r&&c&&Math.abs(t)<Math.abs(c.overlap)&&(c.overlap=t,c.overlapN.c(r))}c&&(c.a=b,c.b=k,c.overlapV.c(c.overlapN).scale(c.overlap));d.push(a);d.push(s);d.push(p);return!0}function C(b,a,c){for(var d=b.calcPoints,f=d.length,h=a.calcPoints,l=h.length,g=0;g<f;g++)if(A(b.pos,a.pos,d,h,b.normals[g],c))return!1;for(g=0;g<
l;g++)if(A(b.pos,a.pos,d,h,a.normals[g],c))return!1;c&&(c.a=b,c.b=a,c.overlapV.c(c.overlapN).scale(c.overlap));return!0}var m={};m.Vector=a;m.V=a;a.prototype.copy=a.prototype.c=function(b){this.x=b.x;this.y=b.y;return this};a.prototype.clone=a.prototype.i=function(){return new a(this.x,this.y)};a.prototype.perp=a.prototype.g=function(){var b=this.x;this.x=this.y;this.y=-b;return this};a.prototype.rotate=a.prototype.rotate=function(b){var a=this.x,c=this.y;this.x=a*Math.cos(b)-c*Math.sin(b);this.y=
a*Math.sin(b)+c*Math.cos(b);return this};a.prototype.reverse=a.prototype.reverse=function(){this.x=-this.x;this.y=-this.y;return this};a.prototype.normalize=a.prototype.normalize=function(){var b=this.f();0<b&&(this.x/=b,this.y/=b);return this};a.prototype.add=a.prototype.add=function(b){this.x+=b.x;this.y+=b.y;return this};a.prototype.sub=a.prototype.sub=function(b){this.x-=b.x;this.y-=b.y;return this};a.prototype.scale=a.prototype.scale=function(b,a){this.x*=b;this.y*=a||b;return this};a.prototype.project=
a.prototype.j=function(b){var a=this.d(b)/b.e();this.x=a*b.x;this.y=a*b.y;return this};a.prototype.projectN=a.prototype.k=function(b){var a=this.d(b);this.x=a*b.x;this.y=a*b.y;return this};a.prototype.reflect=function(b){var a=this.x,c=this.y;this.j(b).scale(2);this.x-=a;this.y-=c;return this};a.prototype.reflectN=function(b){var a=this.x,c=this.y;this.k(b).scale(2);this.x-=a;this.y-=c;return this};a.prototype.dot=a.prototype.d=function(b){return this.x*b.x+this.y*b.y};a.prototype.len2=a.prototype.e=
function(){return this.d(this)};a.prototype.len=a.prototype.f=function(){return Math.sqrt(this.e())};m.Circle=function(b,k){this.pos=b||new a;this.r=k||0};m.Polygon=e;e.prototype.setPoints=function(b){this.points=b;this.recalc();return this};e.prototype.setAngle=function(b){this.angle=b;this.recalc();return this};e.prototype.setOffset=function(b){this.offset=b;this.recalc();return this};e.prototype.rotate=e.prototype.rotate=function(b){for(var a=this.points,c=a.length,d=0;d<c;d++)a[d].rotate(b);this.recalc();
return this};e.prototype.translate=e.prototype.translate=function(b,a){for(var c=this.points,d=c.length,f=0;f<d;f++)c[f].x+=b,c[f].y+=a;this.recalc();return this};e.prototype.recalc=e.prototype.recalc=function(){var b,k=this.calcPoints=[],c=this.edges=[],d=this.normals=[],f=this.points,h=this.offset,l=this.angle,g=f.length;for(b=0;b<g;b++){var e=f[b].i();k.push(e);e.x+=h.x;e.y+=h.y;0!==l&&e.rotate(l)}for(b=0;b<g;b++)f=(new a).c(b<g-1?k[b+1]:k[0]).sub(k[b]),h=(new a).c(f).g().normalize(),c.push(f),
d.push(h);return this};m.Box=u;u.prototype.toPolygon=u.prototype.l=function(){var b=this.pos,k=this.w,c=this.h;return new e(new a(b.x,b.y),[new a,new a(k,0),new a(k,c),new a(0,c)])};m.Response=v;v.prototype.clear=v.prototype.clear=function(){this.bInA=this.aInB=!0;this.overlap=Number.MAX_VALUE;return this};for(var d=[],r=0;10>r;r++)d.push(new a);for(var q=[],r=0;5>r;r++)q.push([]);var y=new v,D=(new u(new a,1,1)).l();m.pointInCircle=function(b,a){var c=d.pop().c(b).sub(a.pos),e=a.r*a.r,f=c.e();d.push(c);
return f<=e};m.pointInPolygon=function(b,a){D.pos.c(b);y.clear();var c=C(D,a,y);c&&(c=y.aInB);return c};m.testCircleCircle=function(b,a,c){var e=d.pop().c(a.pos).sub(b.pos),f=b.r+a.r,h=e.e();if(h>f*f)return d.push(e),!1;c&&(h=Math.sqrt(h),c.a=b,c.b=a,c.overlap=f-h,c.overlapN.c(e.normalize()),c.overlapV.c(e).scale(c.overlap),c.aInB=b.r<=a.r&&h<=a.r-b.r,c.bInA=a.r<=b.r&&h<=b.r-a.r);d.push(e);return!0};m.testPolygonCircle=B;m.testCirclePolygon=function(a,d,c){if((a=B(d,a,c))&&c){d=c.a;var e=c.aInB;c.overlapN.reverse();
c.overlapV.reverse();c.a=c.b;c.b=d;c.aInB=c.bInA;c.bInA=e}return a};m.testPolygonPolygon=C;return m}var SAT=w();


Colliders.SAT      = SAT;
Colliders.Vector   = SAT.Vector;
Colliders.V        = SAT.V;
Colliders.Box      = SAT.Box;
Colliders.Polygon  = SAT.Polygon;
Colliders.Circle   = SAT.Circle;
Colliders.Response = SAT.Response;



var Plugin = {
    name: "colliders-basic",
    id: "core.colliders-basic",
    variant: "SAT-included",
    path: "Colliders",
    content: Colliders
}
Game.plugins.push(Plugin);



})()