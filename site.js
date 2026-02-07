(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a=>{
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

  const slider = document.getElementById('damage');
  const label = document.getElementById('damageLabel');
  const svg = document.getElementById('cdViz');

  if(slider && svg){
    const crack = svg.querySelector('#cracks');
    const cracks2 = svg.querySelector('#cracks2');
    const voidLayer = svg.querySelector('#voidLayer');
    const boundary = svg.querySelector('#boundaryRing');
    const warnPulse = svg.querySelector('#warnPulse');
    const flow = svg.querySelector('#flowCore');
    const flow2 = svg.querySelector('#flowSpray');

    const apply = (d)=>{
      if(label) label.textContent = Math.round(d*100) + '%';
      const sat = 1 - 0.85*d;
      flow.setAttribute('opacity', String(0.85 - 0.40*d));
      flow2.setAttribute('opacity', String(Math.max(0.05, 0.65 - 0.55*d)));

      crack.setAttribute('opacity', String(Math.max(0, (d-0.15)/0.85)));
      cracks2.setAttribute('opacity', String(Math.max(0, (d-0.45)/0.55)));

      crack.querySelectorAll('path').forEach(p=>{
        p.style.strokeWidth = (1.0 + 3.2*Math.max(0, d-0.4)) + 'px';
      });
      cracks2.querySelectorAll('path').forEach(p=>{
        p.style.strokeWidth = (0.8 + 2.4*Math.max(0, d-0.65)) + 'px';
      });

      boundary.style.strokeWidth = (8 - 4*d) + 'px';
      boundary.setAttribute('opacity', String(0.55 - 0.35*d));

      voidLayer.setAttribute('opacity', String(Math.max(0, (d-0.7)/0.3)));

      const warn = (d>0.35 && d<0.75) ? 1 : 0;
      warnPulse.setAttribute('opacity', String(warn * (0.35 + 0.35*Math.sin(Date.now()/350))));

      svg.style.filter = 'saturate(' + (0.95*sat + 0.05) + ')';
    };

    apply(parseFloat(slider.value));
    slider.addEventListener('input', ()=> apply(parseFloat(slider.value)));

    const tick = ()=>{ apply(parseFloat(slider.value)); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
})();
