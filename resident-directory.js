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
  const order=['Notary','Handyman','Plumbing','Electrical','HVAC & Appliances','Garage & Locksmith','Cleaning'];
  const categories=order.filter(category=>data.some(item=>item.category===category));
  categories.forEach(category=>{const option=document.createElement('option');option.value=category;option.textContent=category;select.appendChild(option);});
  function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
  function phoneHref(phone){return 'tel:'+String(phone).replace(/[^0-9+]/g,'');}
  function digits(phone){return String(phone||'').replace(/\D/g,'');}
  function whatsappHref(phone){const number=digits(phone);return number?'https://wa.me/'+(number.length===10?'1'+number:number):'';}
  function smsHref(phone){const number=digits(phone);return number?'sms:+'+(number.length===10?'1'+number:number):'';}
  function whatsappIcon(){return '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z"/><path d="M9.2 8.4c.4 2.2 2.1 4 4.4 4.7"/><path d="M13.7 13.1l1.2-1.1"/></svg>';}
  function smsIcon(){return '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.5-4.5A4 4 0 0 1 3 14V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 10h8M8 14h5"/></svg>';}
  function card(item){
    const tags=(item.services||[]).map(service=>`<span>${escapeHtml(service)}</span>`).join('');
    const phones=(item.phones||[]).map(phone=>`<a class="contact-phone" href="${phoneHref(phone)}"><span>${escapeHtml(item.phoneLabel||'Call')}</span>${escapeHtml(phone)}</a>`).join('');
    const whatsapp=item.whatsapp?`<a class="contact-phone" href="${whatsappHref(item.whatsapp)}" target="_blank" rel="noopener" aria-label="WhatsApp ${escapeHtml(item.title)}">${whatsappIcon()}<span>WhatsApp</span></a>`:'';
    const sms=item.sms?`<a class="contact-phone" href="${smsHref(item.sms)}" aria-label="Text ${escapeHtml(item.title)}">${smsIcon()}<span>Text</span></a>`:'';
    return `<article class="curated-contact-card">
      <div class="curated-card-top"><div><div class="listing-badge curated">Village Pointe Curated</div><h3>${escapeHtml(item.title)}</h3></div><div class="curated-category">${escapeHtml(item.category)}</div></div>
      ${tags?`<div class="service-tags">${tags}</div>`:''}
      <p>${escapeHtml(item.description)}</p>
      <div class="phone-list">${phones}${whatsapp}${sms}</div>
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
