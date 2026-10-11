var ids=["m0","m1","m2","m3","s0","s1","s2","s3"];
var KEY="compte-du-jour";
function fmt(n){return Math.abs(n).toLocaleString("fr-FR").replace(/\u202f|\u00a0/g," ")+" FCFA"}
function val(id){var v=document.getElementById(id).value.replace(/\D/g,"");return v?parseInt(v,10):0}
function filled(p){return [0,1,2,3].some(function(i){return document.getElementById(p+i).value.trim()!==""})}
function save(){try{var o={};ids.forEach(function(i){o[i]=document.getElementById(i).value});localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function calc(){
  var tm=0,ts=0;
  for(var i=0;i<4;i++){tm+=val("m"+i);ts+=val("s"+i)}
  document.getElementById("tm").textContent=fmt(tm);
  document.getElementById("ts").textContent=fmt(ts);
  var r=document.getElementById("res");
  if(!filled("m")||!filled("s")){
    r.className="res";
    r.innerHTML='<div class="big">Remplis les montants</div><small>Le résultat s\'affichera ici</small>';
  }else{
    var d=ts-tm;
    if(d===0){r.className="res ok";r.innerHTML='<div class="badge"><b>✓</b></div><div class="big">Le compte est bon !</div><small>Matin et soir sont égaux</small>'}
    else if(d<0){r.className="res warn";r.innerHTML='<div class="badge"><b>!</b></div><div class="big">Il y a un manque de</div><div class="amt">'+fmt(d)+'</div><small>Vérifie tes opérations de la journée</small>'}
    else{r.className="res sur";r.innerHTML='<div class="badge"><b>+</b></div><div class="big">Il y a un surplus de</div><div class="amt">'+fmt(d)+'</div><small>Vérifie tes opérations de la journée</small>'}
  }
  save();
}
ids.forEach(function(i){
  var el=document.getElementById(i);
  el.addEventListener("input",function(){
    var d=el.value.replace(/\D/g,"");
    el.value=d?parseInt(d,10).toLocaleString("fr-FR").replace(/\u202f|\u00a0/g," "):"";
    calc();
  });
});
document.getElementById("reset").addEventListener("click",function(){
  if(confirm("Effacer tous les montants pour une nouvelle journée ?")){
    ids.forEach(function(i){document.getElementById(i).value=""});
    calc();
  }
});
try{
  var s=JSON.parse(localStorage.getItem(KEY)||"null");
  if(s){ids.forEach(function(i){if(s[i])document.getElementById(i).value=s[i]})}
}catch(e){}
calc();
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(function(){})}
