(this.webpackJsonpregistros=this.webpackJsonpregistros||[]).push([[0],{117:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(20),o=a.n(c),l=(a(86),a(87),a(7)),i=a(6),s=a.n(i),u=a(9),m=a(15),p=function(){var e=Object(u.a)(s.a.mark((function e(){var t,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(m.a,"/api/users/auth"),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({token:document.cookie})});case 2:return t=e.sent,e.next=5,t.json();case 5:return a=e.sent,e.abrupt("return",{type:"auth_user",payload:a});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),d=a(19),g=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]&&arguments[2];function c(c){var o=Object(d.c)((function(e){return e.user})),l=Object(d.b)();return Object(n.useEffect)((function(){l(p()).then(function(){var e=Object(u.a)(s.a.mark((function e(n){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:!n.payload.isAuth&&t&&c.history.push("/login"),1!==n.payload.role&&a&&c.history.push("/login");case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}),[l,c.history]),r.a.createElement(e,Object.assign({},c,{user:o}))}return c},E=a(8),f=a(31);var h=function(){var e=Object(l.f)(),t=Object(n.useState)(""),a=Object(E.a)(t,2),c=a[0],o=a[1],i=Object(n.useState)(""),p=Object(E.a)(i,2),d=p[0],g=p[1],h=Object(n.useState)(""),x=Object(E.a)(h,2),b=x[0],y=x[1],v=Object(f.b)().executeRecaptcha;Object(n.useEffect)((function(){Object(u.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(v){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,v("");case 4:t=e.sent,y(t);case 6:case"end":return e.stop()}}),e)})))()}),[v]);var k=function(){var t=Object(u.a)(s.a.mark((function t(){var a,n,r,o;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("".concat(m.a,"/api/users/login"),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:c,password:d,recaptchaToken:b})});case 2:return r=t.sent,t.next=5,r.json();case 5:a=t.sent,n=a.loginSuccess,o=a.newtoken,document.cookie="newtoken = ".concat(o),console.log("\xc9xito en loguear:",n,"doc.cookie:",document.cookie),n?e.push("/index"):a.recaptchaFails?alert("Problemas, refresque la p\xe1gina"):a.disable?alert("Usuario aun no habilitado por el grupo de territorios... avisarles"):alert("Datos incorrectos");case 11:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return r.a.createElement("div",{className:"container",style:{maxWidth:"95%",marginTop:"50px"}},r.a.createElement("div",{className:"container",style:{paddingTop:"50px",marginBottom:"50px",border:"black 1px solid",borderRadius:"12px",maxWidth:"600px",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}},r.a.createElement("h2",{style:{textAlign:"center",textShadow:"0 0 1px gray"}}," INGRESAR "),r.a.createElement("div",{className:"container",style:{paddingTop:"35px",display:"block",margin:"auto",maxWidth:"500px"}},r.a.createElement("div",{style:{display:"block",margin:"auto"}},r.a.createElement("input",{className:"form-control",type:"email",name:"email",style:{marginBottom:"12px"},placeholder:"Correo electr\xf3nico",autoFocus:!0,onChange:function(e){return o(e.target.value)}}),r.a.createElement("input",{className:"form-control",type:"password",name:"password",style:{marginBottom:"30px"},placeholder:"Contrase\xf1a",onChange:function(e){return g(e.target.value)},onKeyDown:function(e){"Enter"===e.key&&k()}}),r.a.createElement("button",{className:"btn btn-success",style:{width:"100%",display:"block",margin:"auto"},onClick:function(){return k()}},"ENTRAR")),r.a.createElement("a",{href:"/register"},r.a.createElement("p",{style:{fontSize:"1rem",margin:"15px 0 30px",textAlign:"end"}},"Registrar una cuenta")))))},x=a(21),b=a.n(x);var y=function(){var e=Object(l.f)(),t=Object(n.useState)(""),a=Object(E.a)(t,2),c=a[0],o=a[1],i=Object(n.useState)(""),p=Object(E.a)(i,2),d=p[0],g=p[1],h=Object(n.useState)(""),x=Object(E.a)(h,2),y=x[0],v=x[1],k=Object(n.useState)(0),O=Object(E.a)(k,2),w=O[0],j=O[1],N=Object(f.b)().executeRecaptcha,A=Object(n.useState)(""),S=Object(E.a)(A,2),T=S[0],C=S[1];Object(n.useEffect)((function(){Object(u.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(N){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,N("");case 4:t=e.sent,C(t);case 6:case"end":return e.stop()}}),e)})))()}),[N]);var R=function(){var t=Object(u.a)(s.a.mark((function t(){var a,n;return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(c&&d&&y&&w){t.next=2;break}return t.abrupt("return",alert("Faltan datos"));case 2:if(!(d.length<8)){t.next=4;break}return t.abrupt("return",alert("La contrase\xf1a es demasiado corta (m\xedn 8)"));case 4:if(d===y){t.next=6;break}return t.abrupt("return",alert("La contrase\xf1a no coincide con su confirmaci\xf3n"));case 6:return t.next=8,b.a.post("".concat(m.a,"/api/users/register"),{email:c,password:d,group:w,recaptchaToken:T});case 8:return a=t.sent,t.next=11,a.data;case 11:n=t.sent,console.log("Lleg\xf3 en registrar:",a),n.recaptchaFails?alert("Problemas, refresque la p\xe1gina"):n.userExists?alert("Ya existe un usuario con ese correo"):n.regSuccess?(alert("Registrado con \xe9xito. Resta ser habilitado por el grupo de predicaci\xf3n."),e.push("/index")):alert("Algo sali\xf3 mal");case 14:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return r.a.createElement("div",{className:"container container2",style:{maxWidth:"95%",marginTop:"50px"}},r.a.createElement("div",{className:"container",style:{paddingTop:"30px",marginBottom:"50px",border:"gray 1px solid",borderRadius:"12px",maxWidth:"600px",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}},r.a.createElement("h2",{style:{textAlign:"center",textShadow:"0 0 1px gray"}}," REGISTRARSE "),r.a.createElement("div",{className:"container",style:{paddingTop:"35px",display:"block",margin:"auto",maxWidth:"500px"}},r.a.createElement("input",{className:"form-control",type:"email",style:{marginBottom:"12px"},placeholder:"Correo electr\xf3nico",autoFocus:!0,onChange:function(e){return o(e.target.value)}}),r.a.createElement("input",{className:"form-control",type:"password",style:{marginBottom:"12px"},placeholder:"Contrase\xf1a",onChange:function(e){return g(e.target.value)}}),r.a.createElement("input",{className:"form-control",type:"password",style:{marginBottom:"12px"},placeholder:"Confirmar Contrase\xf1a",onChange:function(e){return v(e.target.value)}}),r.a.createElement("input",{className:"form-control",type:"number",style:{marginBottom:"30px"},min:"1",placeholder:"N\xfamero de Grupo de Predicaci\xf3n",onChange:function(e){return j(e.target.value)}}),r.a.createElement("button",{className:"btn btn-danger",style:{width:"100%",height:"50px"},onClick:function(){return R()}},"REGISTRARSE"),r.a.createElement("a",{href:"/login"},r.a.createElement("p",{style:{fontSize:"1.1rem",margin:"15px 0 20px 0",textAlign:"end"}},"Volver a ingreso")))),r.a.createElement("p",{style:{fontSize:"0.9rem",paddingBottom:"12px",textAlign:"center",display:"block"}},"Luego de registrarse, se debe aguardar la autorizaci\xf3n del grupo de territorios"))},v=a(64);function k(){var e=Object(v.a)(["\n    text-align: center;\n    margin-top: 80px;\n"]);return k=function(){return e},e}var O=a(65).a.h1(k());var w=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(O,null," BIENVENIDOS "),r.a.createElement(O,null," misericordiaweb.com "))},j=a(122),N=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement(j.a,{animation:"grow",role:"status"})," \xa0 \xa0",r.a.createElement(j.a,{animation:"grow",role:"status"})," \xa0 \xa0",r.a.createElement(j.a,{animation:"grow",role:"status"})," \xa0 \xa0",r.a.createElement(j.a,{animation:"grow",role:"status"})," \xa0 \xa0",r.a.createElement(j.a,{animation:"grow",role:"status"}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("span",{style:{fontWeight:"bolder"}},"Cargando...")))},A=a(41),S=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{style:{position:"fixed",left:"0",marginLeft:"25px",marginTop:"5px",zIndex:1}},r.a.createElement(A.a,{size:"lg",variant:"danger",onClick:function(){return e.history.goBack()}}," VOLVER ")))};var T=function(e){var t=Object(d.c)((function(e){return e.user.userData})),a=Object(n.useState)([]),c=Object(E.a)(a,2),o=c[0],l=c[1];Object(n.useEffect)((function(){Object(u.a)(s.a.mark((function e(){var t,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,b.a.post("".concat(m.a,"/api/buildings/territorios"),{token:document.cookie});case 3:t=e.sent,(a=t.data.territorios).sort((function(e,t){return e-t})),l(a),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.log("No se pudieron recuperar los territorios asignados",e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})))()}),[]);var i={width:"120px",height:"100px",borderRadius:"15px",marginBottom:"40px"};return r.a.createElement(r.a.Fragment,null,S(e),r.a.createElement(O,null," SELECCIONE UN TERRITORIO "),r.a.createElement("div",{className:"container",style:{paddingTop:"40px",marginBottom:"50px"}},r.a.createElement("div",{className:"row",style:{padding:"40px",justifyContent:"space-evenly"}},function(){try{return t.isAuth?o.map((function(e,t){return r.a.createElement("a",{type:"button",className:"btn btn-danger",style:i,href:"/territorios/".concat(e),key:t},r.a.createElement("h2",{className:"h-100 align-middle",style:{padding:"22%",fontFamily:'"Arial Black", Gadget, sans-serif'}},e))})):r.a.createElement(N,null)}catch(e){return r.a.createElement(N,null)}}())))},C=a(123),R=a(124),I=a(126);var B=function(e){var t=Object(n.useState)({unterritorio:[]}),a=Object(E.a)(t,2),c=a[0],o=a[1],i=Object(n.useState)("1"),p=Object(E.a)(i,2),d=p[0],g=p[1],f=[{name:"Viendo no predicados",value:"1"},{name:"Ver todos",value:"2"},{name:"Ver estad\xedsticas",value:"3"}],h=Object(l.g)().territorio;return Object(n.useEffect)((function(){(function(){var e=Object(u.a)(s.a.mark((function e(t){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.a.post("".concat(m.a,"/api/buildings/getBuildings/").concat(t),{token:document.cookie});case 2:a=e.sent,o(a.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}})()(h)}),[h]),r.a.createElement(r.a.Fragment,null,S(e),r.a.createElement(O,{style:{textAlign:"center",margin:"80px 0px 30px 0"}}," TERRITORIOS "),r.a.createElement("h2",{style:{textAlign:"center"}}," TERRITORIO ",h," "),r.a.createElement("br",null),r.a.createElement("br",null),function(){if(c.unterritorio.length)return r.a.createElement("div",{style:{textAlign:"center"}},r.a.createElement(C.a,{toggle:!0},f.map((function(e,t){return r.a.createElement(R.a,{key:t,type:"radio",variant:"dark",name:"radio",value:e.value,checked:d===e.value,onChange:function(e){return g(e.currentTarget.value)}},e.name)}))),r.a.createElement("br",null),r.a.createElement("br",null))}(),c.unterritorio.length?c.unterritorio.map((function(e){return r.a.createElement("div",{className:"card",key:e.inner_id,style:{marginBottom:"50px"}},r.a.createElement("div",{className:"card-body",style:{paddingTop:"15px",paddingBottom:"15px"}},r.a.createElement("div",{className:"row",style:{margin:"25px"}},r.a.createElement("div",{className:"col-lg-2",style:{margin:"auto"}},r.a.createElement("h4",{style:{textAlign:"center",fontSize:"1.2rem"}},"Territorio ",e.territorio," ",r.a.createElement("br",null),"Manzana ",e.manzana," ",r.a.createElement("br",null),"Vivienda ",e.inner_id)),r.a.createElement("div",{className:"col-lg-4",style:{marginBottom:"10px"}},r.a.createElement("div",{className:"row",style:{paddingBottom:"20px"}},r.a.createElement("h4",{style:{textAlign:"center",display:"block",margin:"auto"}},"Direcci\xf3n: ",e.direccion)),r.a.createElement("div",{className:"row",style:{paddingTop:"20px",paddingBottom:"1%"}},r.a.createElement("h4",{style:{textAlign:"center",display:"block",margin:"auto"}},"Tel\xe9fono:",r.a.createElement("div",{style:{marginTop:"7px"}},r.a.createElement("a",{href:"tel:".concat(e.telefono)}," ",e.telefono," "))))),r.a.createElement("div",{className:"col-lg-3"},r.a.createElement("div",{className:"row",style:{textAlign:"center",height:"50%"}},r.a.createElement(I.a,{style:{width:"100%"}},r.a.createElement(I.a.Toggle,{variant:"success",id:"dropdown-basic",style:{width:"80%"}},e.estado),r.a.createElement(I.a.Menu,null,r.a.createElement(I.a.Item,{href:"#/action-1"},"No predicado"),r.a.createElement(I.a.Item,{href:"#/action-2"},"Contest\xf3"),r.a.createElement(I.a.Item,{href:"#/action-3",onClick:function(){alert("No contest\xf3")}},"No contest\xf3"),r.a.createElement(I.a.Item,{href:"#/action-4"},"A dejar carta"),r.a.createElement(I.a.Item,{href:"#/action-5"},"No llamar")))),r.a.createElement("div",{className:"row",style:{height:"50%"}},e.fechaUlt?r.a.createElement("div",{className:"card border-dark mb-3",style:{maxWidth:"18rem",backgroundColor:"rgb(214, 214, 214)",margin:"auto"}},r.a.createElement("div",{className:"card-header",style:{padding:"0.2rem 0.5rem"}},r.a.createElement("p",{className:"card-text"},"Se llam\xf3 el ",function(e){try{return new Date(parseInt(e)).toString().split("GMT")[0]}catch(t){}}(e.fechaUlt)))):r.a.createElement("div",null))),r.a.createElement("div",{className:"col-lg-3"},r.a.createElement("div",{className:"row",style:{textAlign:"center",height:"100%",marginLeft:"20px"}},r.a.createElement("div",{className:"form-check",style:{display:"block",margin:"auto"}},r.a.createElement("input",{className:"form-check-input",type:"checkbox",id:"checkbox{{inner_id}}",style:{marginTop:"0.5rem",transform:"scale(1.5)",padding:5,marginLeft:"0rem"},onClick:function(){return alert()}}),r.a.createElement("label",{className:"form-check-label",htmlFor:"defaultCheck1",style:{fontSize:"1.1rem",fontWeight:600}},"\xa0 \xa0 Tel\xe9fono no abonado en servicio")))))))})):r.a.createElement(N,null),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null))};var D=function(){return r.a.createElement(O,null," ESTAD\xcdSTICAS ")},z=a(129);var F=function(e){var t=Object(d.c)((function(e){return e.user.userData})),a=Object(n.useState)(!1),c=Object(E.a)(a,2),o=c[0],l=c[1];return r.a.createElement(r.a.Fragment,null,S(e),r.a.createElement(O,{style:{textAlign:"center"}}," Usuario "),r.a.createElement("br",null),r.a.createElement("br",null),t&&r.a.createElement(z.a,{style:{padding:"15px"}},"Usuario: ",t.email,r.a.createElement("div",{className:"d-inline-block"}," Territorios asignados: \xa0 \xa0",t.asign&&t.asign.map((function(e,t){return r.a.createElement("div",{key:t,className:"d-inline-block"}," ",e," \xa0 \xa0 ")})))),r.a.createElement("br",null),r.a.createElement("div",{style:{textAlign:"center"}},t&&t.actividad&&t.actividad.length&&r.a.createElement(A.a,{onClick:function(){return l(!o)},variant:"dark"},o?"Ocultar actividad":"Ver actividad")),r.a.createElement("div",{className:"row",style:{paddingTop:"40px",justifyContent:"space-evenly"}},t&&t.actividad&&t.actividad.map((function(e){return r.a.createElement(z.a,{key:e.fechaUlt,style:{display:o?"block":"none",width:"230px",margin:"15px",padding:"15px",backgroundColor:"#b4e999"}},r.a.createElement("h6",null," ",e.fechaUlt?function(e){var t=new Date(e),a=t.getFullYear(),n=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][t.getMonth()];return t.getDate()+" "+n+" "+a+" - "+t.getHours()+":"+(t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes())+" hs"}(e.fechaUlt):""," "),r.a.createElement("h5",null," Territorio ",e.territorio," ",e.manzana?"manz ".concat(e.manzana):""," "),r.a.createElement("h5",null," ",e.direccion," "),r.a.createElement("h5",null," ",e.telefono," "),r.a.createElement("h5",null," ",e.estado," "),r.a.createElement("h5",null," ",e.noAbonado?"Tel\xe9fono no abonado":""," "))}))))};var L=function(e){var t=Object(n.useState)({usuarios:[]}),a=Object(E.a)(t,2),c=a[0],o=a[1];return Object(n.useEffect)((function(){Object(u.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.a.post("".concat(m.a,"/api/users/getUsers"),{token:document.cookie});case 2:t=e.sent,o({usuarios:t.data.users});case 4:case"end":return e.stop()}}),e)})))()}),[]),r.a.createElement(r.a.Fragment,null,S(e),r.a.createElement(O,null," ADMINISTRADORES "),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("div",{style:{display:"block",margin:"auto"}},!c.usuarios.length&&r.a.createElement(N,null),c.usuarios&&c.usuarios.map((function(e,t){return r.a.createElement(z.a,{key:t,style:{width:"25rem",margin:"30px auto"}},r.a.createElement(z.a.Body,null,r.a.createElement(z.a.Title,{style:{textAlign:"center"}}," ",e.email," "),r.a.createElement("br",null),r.a.createElement(z.a.Text,{style:{textAlign:"center",fontSize:"1.2rem",fontWeight:600}},"Grupo: ",e.group," \xa0",r.a.createElement(A.a,{variant:"success",style:{}},"CAMBIAR GRUPO")),r.a.createElement("hr",null),r.a.createElement(z.a.Text,{style:{fontWeight:500,fontSize:"1.2rem",textAlign:"center"}},"Territorios asignados: \xa0",e.asign&&e.asign.map((function(e){return r.a.createElement("span",{key:e,className:"d-inline-block"}," ",e," \xa0 ")}))),r.a.createElement(A.a,{block:!0,variant:"success",style:{marginTop:"10px"}},"Cambiar asignaciones"),r.a.createElement("hr",null),r.a.createElement(A.a,{block:!0,variant:"activado"===e.estado?"danger":"primary"},"activado"===e.estado?"DESACTIVAR":"ACTIVAR"),r.a.createElement("br",null),r.a.createElement(A.a,{block:!0,variant:1===e.role?"danger":"primary"},1===e.role?"QUITAR ADMIN":"HACER ADMIN")))}))))};var _=function(){return r.a.createElement("h2",null," Rooms Page ")},U=a(128),M=a(125),W=a(127),V=a(77);var G=function(){console.log("document.cookie desde navbar:",document.cookie);var e=Object(d.c)((function(e){return e.user.userData})),t=Object(l.f)(),a=function(){var e=Object(u.a)(s.a.mark((function e(){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.a.post("".concat(m.a,"/api/users/logout"),{token:document.cookie});case 2:a=e.sent,"ok"===a.data.response?(alert("Sesi\xf3n de usuario cerrada con \xe9xito"),t.push("/login")):alert("Algo fall\xf3 y no cerr\xf3 sesi\xf3n");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return r.a.createElement("div",{style:{position:"fixed",width:"100%",zIndex:2}},r.a.createElement(W.a,{bg:"dark",variant:"dark",collapseOnSelect:!0,expand:"lg"},r.a.createElement(W.a.Brand,{href:"/"},"\xa0 INICIO"),r.a.createElement(W.a.Toggle,{"aria-controls":"responsive-navbar-nav"}),r.a.createElement(W.a.Collapse,{id:"responsive-navbar-nav"},r.a.createElement(U.a,{className:"mr-auto"},function(){try{return e.isAuth?r.a.createElement(U.a.Link,{href:"/index"},"\xa0 \xa0Territorios\xa0 \xa0"):r.a.createElement(U.a.Link,{href:"/login"},"\xa0 \xa0Entrar\xa0 \xa0")}catch(t){return r.a.createElement(U.a.Link,{href:"/login"},"\xa0 \xa0Entrar\xa0 \xa0")}}(),function(){try{if(1===e.role)return r.a.createElement(r.a.Fragment,null,r.a.createElement(U.a.Link,{href:"/estadisticas"},"\xa0 \xa0Estad\xedsticas\xa0 \xa0"),window.screen.width<989?"<br/>":"",window.screen.width<989?"<br/>":"",window.screen.width<989?"<br/>":"",r.a.createElement(U.a.Link,{href:"/admins"},"\xa0 \xa0Administradores\xa0 \xa0"))}catch(t){}}()),function(){try{if(e.isAuth)return r.a.createElement(r.a.Fragment,null,r.a.createElement(U.a.Link,{href:"/user",style:{display:"flex",alignItems:"center",marginBottom:window.screen.width<992?"12px":"0"}},r.a.createElement(V.a,{size:"17px",color:"gray"}),"\xa0 Mi Usuario \xa0"),r.a.createElement(U.a,null,r.a.createElement(M.a,{inline:!0},r.a.createElement(A.a,{variant:"outline-info",onClick:function(){return a()}},"CERRAR SESI\xd3N"))))}catch(t){}}())),e&&e.isAuth&&r.a.createElement("div",{style:{position:"fixed",right:"0",marginRight:"18px",marginTop:"5px",zIndex:1}},r.a.createElement("p",{style:{textAlign:"right",marginBottom:"0"}}," ",e.email," "),r.a.createElement("p",{style:{textAlign:"right",marginBottom:"0"}}," Grupo: ",e.group," "),r.a.createElement("p",{style:{textAlign:"right"}}," ",e.role?"Administrador":""," ")))};var P=function(){var e={fontSize:window.screen.width>767?"1.8rem":"1rem",paddingTop:"20px",paddingBottom:"20px",backgroundColor:"#343a40",height:"100px",marginTop:"200px"};return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:"main-footer",style:e},r.a.createElement("div",{style:{display:"flex",height:"100%",margin:"auto",textAlign:"center",alignItems:"center",justifyContent:"center"}},r.a.createElement("a",{href:"https://misericordiaweb.com/",style:{color:"white",fontWeight:"bolder"}},"misericordiaweb.com"))))};a(112);var J=function(){return r.a.createElement(n.Suspense,{fallback:r.a.createElement("div",null," Cargando... ")},r.a.createElement(f.a,{reCaptchaKey:"6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9"},r.a.createElement(G,null),r.a.createElement("div",{style:{maxWidth:"90%",paddingTop:"75px",margin:"auto",minHeight:"calc(100vh - 80px)"}},r.a.createElement(l.c,null,r.a.createElement(l.a,{exact:!0,path:"/",component:g(w,!1)}),r.a.createElement(l.a,{exact:!0,path:"/login",component:g(h,!1)}),r.a.createElement(l.a,{exact:!0,path:"/register",component:g(y,!1)}),r.a.createElement(l.a,{exact:!0,path:"/index",component:g(T,!0)}),r.a.createElement(l.a,{exact:!0,path:"/territorios/:territorio",component:g(B,!0)}),r.a.createElement(l.a,{exact:!0,path:"/estadisticas",component:g(D,!0,!0)}),r.a.createElement(l.a,{exact:!0,path:"/user",component:g(F,!0)}),r.a.createElement(l.a,{exact:!0,path:"/admins",component:g(L,!0,!0)}),r.a.createElement(l.a,{exact:!0,path:"/salas",component:g(_,!0)}),r.a.createElement(l.a,{path:"/",component:g(h,!1)}))),r.a.createElement(P,null)))},H=a(30),X=a(29),q=a(79),K=Object(X.c)({user:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"auth_user":return Object(q.a)({},e,{userData:t.payload});default:return e}}}),Y=a(74),Z=a(75),Q=a.n(Z),$=Object(X.a)(Q.a,Y.a)(X.d);o.a.render(r.a.createElement(d.a,{store:$(K,window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__())},r.a.createElement(H.a,null,r.a.createElement(J,null))),document.getElementById("root"))},15:function(e){e.exports=JSON.parse('{"a":"https://registros-rest-api.herokuapp.com"}')},81:function(e,t,a){e.exports=a(117)},86:function(e,t,a){},87:function(e,t,a){}},[[81,1,2]]]);
//# sourceMappingURL=main.f97122b5.chunk.js.map