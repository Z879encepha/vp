(function(){
  const all=Array.isArray(window.VP_DIRECTORY_DATA)?window.VP_DIRECTORY_DATA:[];
  const data=all.filter(item=>item.residentCurated===true);
  const form=document.querySelector('[data-resident-directory-form]');
  const search=document.querySelector('[data-resident-directory-search]');
  const select=document.querySelector('[data-resident-directory-category]');
  const results=document.querySelector('[data-resident-directory-results]');
  const count=document.querySelector('[data-resident-directory-count]');
  const clear=document.querySelector('[data-resident-directory-clear]');
  if(!form||!search||!select||!results||!count||!clear)return;
  const order=['Handyman','Plumbing','Electrical','HVAC & Appliances','Garage & Locksmith','Cleaning'];
  const categories=order.filter(category=>data.some(item=>item.category===category));
  categories.forEach(category=>{const option=document.createElement('option');option.value=category;option.textContent=category;select.appendChild(option);});
  function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
  function phoneHref(phone){return 'tel:'+String(phone).replace(/[^0-9+]/g,'');}
  function card(item){
    const tags=(item.services||[]).map(service=>`<span>${escapeHtml(service)}</span>`).join('');
    const phones=(item.phones||[]).map(phone=>`<a class="contact-phone" href="${phoneHref(phone)}"><span>Call</span>${escapeHtml(phone)}</a>`).join('');
    return `<article class="curated-contact-card">
      <div class="curated-card-top"><div><div class="listing-badge curated">Village Pointe Curated</div><h3>${escapeHtml(item.title)}</h3></div><div class="curated-category">${escapeHtml(item.category)}</div></div>
      ${tags?`<div class="service-tags">${tags}</div>`:''}
      <p>${escapeHtml(item.description)}</p>
      <div class="phone-list">${phones}</div>
      <div class="listing-caution">${escapeHtml(item.caution)}</div>
    </article>`;
  }
  function render(){
    const q=search.value.trim().toLowerCase();
    const category=select.value;
    const filtered=data.filter(item=>(category==='All'||item.category===category)&&(!q||[item.title,item.category,item.description,(item.services||[]).join(' '),(item.phones||[]).join(' '),(item.searchTerms||[]).join(' ')].join(' ').toLowerCase().includes(q)));
    count.textContent=filtered.length;
    if(!filtered.length){results.innerHTML='<div class="notice"><strong>No matching curated contact.</strong> Try a broader term or choose All categories.</div>';return;}
    const grouped=categories.map(cat=>({cat,items:filtered.filter(item=>item.category===cat)})).filter(group=>group.items.length);
    results.innerHTML=grouped.map(group=>`<section class="curated-group"><div class="curated-group-heading"><h3>${escapeHtml(group.cat)}</h3><span>${group.items.length} contact${group.items.length===1?'':'s'}</span></div><div class="curated-contact-grid">${group.items.map(card).join('')}</div></section>`).join('');
  }
  search.addEventListener('input',render);
  select.addEventListener('change',render);
  clear.addEventListener('click',()=>{search.value='';select.value='All';render();search.focus();});
  form.addEventListener('submit',event=>event.preventDefault());
  render();
})();
