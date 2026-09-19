(function(){
  var SB='https://zilmaasikrkjgvyuikja.supabase.co';
  var K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppbG1hYXNpa3Jramd2eXVpa2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODA1OTcsImV4cCI6MjEwMjg1NjU5N30.GH-gyARlolXgxdlbasKAW9PbEkWfSGVgsGhpS-6FOl4';
  var q=new URLSearchParams(location.search);
  var camp=q.get('camp')||q.get('utm_campaign')||'';
  var v=(q.get('v')||'a').toLowerCase();
  var owner=(camp==='owner-check');
  var utm={}; ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src'].forEach(function(k){ if(q.get(k)) utm[k]=q.get(k); });
  utm.v=v;
  var sid=null; try{ sid=sessionStorage.getItem('tb_sid'); if(!sid){ sid=Math.random().toString(36).slice(2)+Date.now().toString(36); sessionStorage.setItem('tb_sid',sid);} }catch(e){ sid='na'; }
  var ref=''; try{ ref=document.referrer||''; }catch(e){}
  if(ref) utm.referrer=ref.slice(0,200);
  function ev(name,label){
    if(owner) return;
    try{
      fetch(SB+'/rest/v1/tb_events',{method:'POST',headers:{'apikey':K,'Authorization':'Bearer '+K,'Content-Type':'application/json','Prefer':'return=minimal'},
        body:JSON.stringify({event:name,label:label||null,camp:camp,utm:utm,page:location.pathname+'?v='+v,session_id:sid,user_agent:navigator.userAgent.slice(0,200)}),keepalive:true}).catch(function(){});
    }catch(e){}
  }
  window.TK={ev:ev,v:v,camp:camp};
  // 見出しの差し替え（?v=a/b/c）
  document.addEventListener('DOMContentLoaded',function(){
    var box=document.querySelectorAll('[data-v]');
    for(var i=0;i<box.length;i++){ box[i].hidden = (box[i].getAttribute('data-v')!==v); }
    ev('page_view', v);
  });
  // 押した所を全部記録
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('[data-ev]');
    if(el) ev(el.getAttribute('data-ev'), (el.getAttribute('data-label')||el.textContent||'').trim().slice(0,60));
  });
  // どこまで読んだか
  var hit={};
  window.addEventListener('scroll',function(){
    var h=document.documentElement;
    var p=(h.scrollTop+window.innerHeight)/h.scrollHeight;
    [0.5,0.9].forEach(function(t){ if(p>=t && !hit[t]){ hit[t]=1; ev('scroll', Math.round(t*100)+'%'); } });
  },{passive:true});
})();
// 固定バーは「1画面目のボタンが画面から消えたら」出す（塗りボタンは常に1つ）
(function(){
  function start(){
    var bar=document.querySelector('.fixbar');
    if(!bar) return;
    var cta=document.querySelector('.hero .appbtns')||document.querySelector('.hero .btn');
    if(cta && 'IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        if(es[0].isIntersecting){ bar.classList.remove('on'); } else { bar.classList.add('on'); }
      },{threshold:0}).observe(cta);
      return;
    }
    function f(){ if(window.scrollY>640){ bar.classList.add('on'); } else { bar.classList.remove('on'); } }
    f(); window.addEventListener('scroll',f,{passive:true});
  }
  document.addEventListener('DOMContentLoaded',start);
})();
// 住所をコピー
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.getElementById('copyBtn'), a=document.getElementById('addr');
    if(!b||!a) return;
    b.addEventListener('click',function(){
      var t=a.innerText.replace(/\n/g,' ').trim();
      function done(){ b.textContent='コピーしました'; b.classList.add('done');
        setTimeout(function(){ b.textContent='この住所をコピー'; b.classList.remove('done'); },2000); }
      if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done,function(){}); }
      else { var e=document.createElement('textarea'); e.value=t; document.body.appendChild(e); e.select();
        try{ document.execCommand('copy'); done(); }catch(x){} document.body.removeChild(e); }
    });
  });
})();
// ストアへのリンクに「どこから来たか」の印を付ける
// （Google Play の Install Referrer で、広告 → インストール → 登録 をつなぐため）
(function(){
  function stamp(){
    var c = (window.TK && window.TK.camp) || '';
    if(!c || c === 'owner-check') return;
    var ref = 'utm_source%3Dtoriiku_lp'
            + '%26utm_medium%3Dlp'
            + '%26utm_campaign%3D' + encodeURIComponent(c)
            + '%26camp%3D' + encodeURIComponent(c);
    var as = document.querySelectorAll('a[href*="play.google.com/store/apps/details"]');
    for(var i=0;i<as.length;i++){
      var h = as[i].getAttribute('href') || '';
      if(h.indexOf('referrer=') >= 0) continue;
      as[i].setAttribute('href', h + (h.indexOf('?') >= 0 ? '&' : '?') + 'referrer=' + ref);
    }
    var ios = document.querySelectorAll('a[href*="apps.apple.com"]');
    for(var j=0;j<ios.length;j++){
      var g = ios[j].getAttribute('href') || '';
      if(g.indexOf('ct=') >= 0) continue;
      ios[j].setAttribute('href', g + (g.indexOf('?') >= 0 ? '&' : '?') + 'ct=' + encodeURIComponent(c) + '&mt=8');
    }
  }
  document.addEventListener('DOMContentLoaded', stamp);
})();
