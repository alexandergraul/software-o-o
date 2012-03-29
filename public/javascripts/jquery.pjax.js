(function(b){function k(a,c,d){c&&d?d.container=c:d=b.isPlainObject(c)?c:{container:c};d.container&&(d.container=q(d.container));c=a.currentTarget;if("A"!==c.tagName.toUpperCase())throw"$.fn.pjax or $.pjax.click requires an anchor element";if(!(1<a.which||a.metaKey))if(!(location.protocol!==c.protocol||location.host!==c.host)&&!(c.hash&&c.href.replace(c.hash,"")===location.href.replace(location.hash,"")))return c={url:c.href,container:b(c).attr("data-pjax"),target:c,clickedElement:b(c),fragment:null},
b.pjax(b.extend({},c,d)),a.preventDefault(),!1}function n(a){return a.replace(/\?_pjax=true&?/,"?").replace(/_pjax=true&?/,"").replace(/[\?&]$/,"")}function s(a){var c=document.createElement("a");c.href=a;return c}function q(a){a=b(a);if(a.length){if(""!==a.selector&&a.context===document)return a;if(a.attr("id"))return b("#"+a.attr("id"));throw"cant get selector for pjax container!";}throw"no pjax container for "+a.selector;}b.fn.pjax=function(a,c){return this.live("click",function(b){return k(b,
a,c)})};var f=b.pjax=function(a){function c(a,c){var e=b.Event(a,{relatedTarget:d});p.trigger(e,c);return!e.isDefaultPrevented()}a=b.extend(!0,{},b.ajaxSettings,f.defaults,a);b.isFunction(a.url)&&(a.url=a.url());var d=a.target;!d&&a.clickedElement&&(d=a.clickedElement[0]);var e=a.url,r=s(e).hash,j=a.beforeSend,l=a.complete,k=a.success,i=a.error,p=a.context=q(a.container),o;a.beforeSend=function(b,d){e=n(d.url);if(d.timeout>0){o=setTimeout(function(){c("pjax:timeout",[b,a])&&b.abort("timeout")},d.timeout);
d.timeout=0}b.setRequestHeader("X-PJAX","true");var f;if(j){f=j.apply(this,arguments);if(f===false)return false}if(!c("pjax:beforeSend",[b,d]))return false;c("pjax:start",[b,a]);c("start.pjax",[b,a])};a.complete=function(b,d){o&&clearTimeout(o);l&&l.apply(this,arguments);c("pjax:complete",[b,d,a]);c("pjax:end",[b,a]);c("end.pjax",[b,a])};a.error=function(b,d,f){var h=b.getResponseHeader("X-PJAX-URL");h&&(e=n(h));i&&i.apply(this,arguments);h=c("pjax:error",[b,d,f,a]);if(d!=="abort"&&h)window.location=
e};a.success=function(d,l,i){var h=i.getResponseHeader("X-PJAX-URL");h&&(e=n(h));var g,h=document.title;if(a.fragment){g=b("<html>").html(d);var j=g.find(a.fragment);if(j.length){this.html(j.contents());g=g.find("title").text()||j.attr("title")||j.data("title")}else return window.location=e}else{if(!b.trim(d)||/<html/i.test(d))return window.location=e;this.html(d);g=this.find("title").remove().text()}if(g)document.title=b.trim(g);g={url:e,pjax:this.selector,fragment:a.fragment,timeout:a.timeout};
if(a.replace){f.active=true;window.history.replaceState(g,document.title,e)}else if(a.push){if(!f.active){window.history.replaceState(b.extend({},g,{url:null}),h);f.active=true}window.history.pushState(g,document.title,e)}(a.replace||a.push)&&window._gaq&&_gaq.push(["_trackPageview"]);if(r!=="")window.location.href=r;k&&k.apply(this,arguments);c("pjax:success",[d,l,i,a])};var m=f.xhr;m&&4>m.readyState&&(m.onreadystatechange=b.noop,m.abort());f.options=a;f.xhr=b.ajax(a);b(document).trigger("pjax",
[f.xhr,a]);return f.xhr};f.defaults={timeout:650,push:!0,replace:!1,data:{_pjax:!0},type:"GET",dataType:"html"};f.click=k;var i="state"in window.history,p=location.href;b(window).bind("popstate",function(a){var c=!i&&location.href==p;i=!0;if(!c&&(a=a.state)&&a.pjax)c=a.pjax,b(c+"").length?b.pjax({url:a.url||location.href,fragment:a.fragment,container:c,push:!1,timeout:a.timeout}):window.location=location.href});0>b.inArray("state",b.event.props)&&b.event.props.push("state");b.support.pjax=window.history&&
window.history.pushState&&window.history.replaceState&&!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/);b.support.pjax||(b.pjax=function(a){var c=b.isFunction(a.url)?a.url():a.url,d=a.type?a.type.toUpperCase():"GET",e=b("<form>",{method:"GET"===d?"GET":"POST",action:c,style:"display:none"});"GET"!==d&&"POST"!==d&&e.append(b("<input>",{type:"hidden",name:"_method",value:d.toLowerCase()}));a=a.data;if("string"===typeof a)b.each(a.split("&"),function(a,c){var d=c.split("=");
e.append(b("<input>",{type:"hidden",name:d[0],value:d[1]}))});else if("object"===typeof a)for(key in a)e.append(b("<input>",{type:"hidden",name:key,value:a[key]}));b(document.body).append(e);e.submit()},b.pjax.click=b.noop,b.fn.pjax=function(){return this})})(jQuery);
