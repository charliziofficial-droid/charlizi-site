// check-deploy.js
fetch('https://api.github.com/repos/charliziofficial-droid/charlizi-site/deployments?per_page=1')
  .then(r => r.json())
  .then(async d => {
    const s = await fetch(d[0].statuses_url).then(r => r.json());
    const ok = s.filter(x => x.state === 'success')[0];
    if (!ok) { console.log('No successful deployment'); return; }
    const base = ok.target_url.replace(/\/$/, '');
    console.log('Deployment URL:', base);
    
    // Check dashboard
    const r = await fetch(base + '/dashboard');
    const text = await r.text();
    console.log('Dashboard:', text.length, 'chars');
    console.log('Has JS module:', text.includes('dashboard.astro_astro_type_script_index'));
    console.log('Has app div:', text.includes('id="app"'));
    console.log('Has picture:', text.includes('<picture>'));
    
    // Also check the prod URL
    const r2 = await fetch('https://charlizi-site.vercel.app/dashboard');
    const text2 = await r2.text();
    console.log('\nProd URL dashboard:', text2.length, 'chars');
    console.log('Has JS module:', text2.includes('dashboard.astro_astro_type_script_index'));
  })
  .catch(e => console.error('Error:', e.message));
