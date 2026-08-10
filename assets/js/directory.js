(function(){
  const data=Array.isArray(window.VP_DIRECTORY_DATA)?window.VP_DIRECTORY_DATA.slice():[];
  const form=document.querySelector('[data-directory-form]'),search=document.querySelector('[data-directory-search]'),select=document.querySelector('[data-directory-category]'),scope=document.querySelector('[data-directory-scope]'),results=document.querySelector('[data-directory-results]'),count=document.querySelector('[data-directory-count]'),clear=document.querySelector('[data-directory-clear]');
  if(!form||!search||!select||!scope||!results||!count||!clear)return;
  const categories=['All',...Array.from(new Set(data.map(item=>item.category))).sort((a,b)=>a.localeCompare(b))];
  categories.slice(1).forEach(category=>{const option=document.createElement('option');option.value=category;option.textContent=category;select.appendChild(option);});
  const params=new URLSearchParams(location.search);search.value=params.get('q')||'';const requested=params.get('category');if(requested&&categories.includes(requested))select.value=requested;const requestedScope=params.get('scope');if(requestedScope&&['All','curated','official','area'].includes(requestedScope))scope.value=requestedScope;
  function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
  function phoneHref(phone){return 'tel:'+String(phone).replace(/[^0-9+]/g,'');}
  function badge(item){if(item.scope==='curated')return ['Village Pointe Curated','curated'];if(item.scope==='official')return ['Official Source','official'];return ['Area Directory','area'];}
  function card(item){
    const [badgeText,badgeClass]=badge(item);
    const tags=(item.services||[]).map(service=>`<span>${escapeHtml(service)}</span>`).join('');
    const phones=(item.phones||[]).map(phone=>`<a class="contact-phone" href="${phoneHref(phone)}"><span>Call</span>${escapeHtml(phone)}</a>`).join('');
    const external=item.url?`<a class="directory-action" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.label||'Open resource')} <span aria-hidden="true">↗</span></a>`:'';
    const caution=item.caution?`<div class="listing-caution">${escapeHtml(item.caution)}</div>`:'';
    return `<article class="directory-card is-${escapeHtml(item.scope||'area')}">
      <div class="listing-badge ${badgeClass}">${badgeText}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <div class="directory-category">${escapeHtml(item.category)}</div>
      ${tags?`<div class="service-tags">${tags}</div>`:''}
      <p>${escapeHtml(item.description)}</p>
      ${phones?`<div class="phone-list">${phones}</div>`:''}
      ${external}
      ${caution}
      
    </article>`;
  }
  const groupInfo={curated:{title:'Village Pointe Curated Contacts',copy:'Resident supplied contacts shown first for convenience. Curated does not mean approved, licensed, insured, or endorsed.'},official:{title:'Official and Public Resources',copy:'Government, transportation, safety, and consumer verification sources.'},area:{title:'Broader Local Search',copy:'Search links for additional providers and services across Edison and surrounding areas.'}};
  function render(){
    const q=search.value.trim().toLowerCase(),category=select.value,scopeValue=scope.value;
    const filtered=data.filter(item=>(category==='All'||item.category===category)&&(scopeValue==='All'||item.scope===scopeValue)&&(!q||[item.title,item.category,item.type,item.description,(item.services||[]).join(' '),(item.phones||[]).join(' '),(item.searchTerms||[]).join(' ')].join(' ').toLowerCase().includes(q))).sort((a,b)=>(a.priority||99)-(b.priority||99)||a.title.localeCompare(b.title));
    count.textContent=filtered.length;
    if(!filtered.length){results.innerHTML='<div class="notice"><strong>No matching resource.</strong> Try a broader word, another category, or All listing types.</div>';return;}
    const scopes=['curated','official','area'];
    results.innerHTML=scopes.map(key=>{const items=filtered.filter(item=>item.scope===key);if(!items.length)return '';return `<section class="directory-result-group"><div class="directory-result-heading"><div><h3>${groupInfo[key].title}</h3><p>${groupInfo[key].copy}</p></div><span>${items.length} result${items.length===1?'':'s'}</span></div><div class="directory-grid">${items.map(card).join('')}</div></section>`;}).join('');
  }
  search.addEventListener('input',render);select.addEventListener('change',render);scope.addEventListener('change',render);clear.addEventListener('click',()=>{search.value='';select.value='All';scope.value='All';render();search.focus();});form.addEventListener('submit',event=>event.preventDefault());render();
})();
