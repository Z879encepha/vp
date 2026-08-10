(function(){
  const allData=Array.isArray(window.VP_DIRECTORY_DATA)?window.VP_DIRECTORY_DATA:[];
  const data=allData.filter(item=>item.residentHidden!==true);

  const search=document.querySelector('[data-resident-directory-search]');
  const categorySelect=document.querySelector('[data-resident-directory-category]');
  const scopeSelect=document.querySelector('[data-resident-directory-scope]');
  const clear=document.querySelector('[data-resident-directory-clear]');
  const count=document.querySelector('[data-resident-directory-count]');
  const residentResults=document.querySelector('[data-resident-supplied-results]');
  const realEstateResults=document.querySelector('[data-real-estate-results]');
  const publicResults=document.querySelector('[data-public-resource-results]');
  const otherResults=document.querySelector('[data-other-resource-results]');
  const emergency=document.querySelector('[data-resident-emergency]');
  const management=document.querySelector('[data-resident-management]');
  const notary=document.querySelector('[data-resident-notary]');

  if(!search||!categorySelect||!scopeSelect||!clear||!count||
     !residentResults||!realEstateResults||!publicResults||!otherResults||
     !emergency||!management||!notary)return;

  const residentCategories=['Handyman','Plumbing','Electrical','HVAC & Appliances','Garage & Locksmith','Cleaning'];
  const publicCategories=['Government','Schools & Family','Transportation','Consumer Verification'];
  const otherCategories=['Home Services','Auto & Mobility','Health & Wellness','Shopping & Dining','Pets','Transportation & Travel'];
  const categoryOrder=['Notary',...residentCategories,'Real Estate','Village Pointe & Management','Emergency & Safety',...publicCategories,...otherCategories];
  const discovered=Array.from(new Set(data.map(item=>item.category).filter(Boolean)));
  const categories=[...categoryOrder.filter(c=>discovered.includes(c)),...discovered.filter(c=>!categoryOrder.includes(c)).sort((a,b)=>a.localeCompare(b))];

  categories.forEach(category=>{
    const option=document.createElement('option');
    option.value=category;
    option.textContent=category;
    categorySelect.appendChild(option);
  });

  function escapeHtml(value){
    return String(value??'').replace(/[&<>'"]/g,char=>({
      '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
    }[char]));
  }
  function digits(phone){return String(phone||'').replace(/\D/g,'');}
  function phoneHref(phone){return 'tel:'+String(phone||'').replace(/[^0-9+]/g,'');}
  function whatsappHref(phone){const n=digits(phone);return n?'https://wa.me/'+(n.length===10?'1'+n:n):'';}
  function smsHref(phone){const n=digits(phone);return n?'sms:+'+(n.length===10?'1'+n:n):'';}
  function externalIcon(){return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M19 5l-9 9"/><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';}
  function phoneIcon(){return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 4h3l1.2 4-2 1.5a14 14 0 0 0 5.3 5.3l1.5-2L20 14v3c0 1.1-.9 2-2 2C10.8 19 5 13.2 5 6c0-1.1.9-2 2-2Z"/></svg>';}
  function smsIcon(){return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15a4 4 0 0 1-4 4H8l-5 3 1.5-4.5A4 4 0 0 1 3 14V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z"/><path d="M8 10h8M8 14h5"/></svg>';}
  function whatsappIcon(){return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z"/><path d="M9.2 8.4c.4 2.2 2.1 4 4.4 4.7"/><path d="M13.7 13.1l1.2-1.1"/></svg>';}
  function mailIcon(){return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>';}
  function find(title){return data.find(item=>item.title===title);}

  function renderPrioritySections(){
    const e911=find('Emergency 911');
    const police=find('Edison Police Nonemergency Dispatch');
    emergency.innerHTML=`
      <div class="resident-priority-row">
        <span class="resident-priority-label">Emergency</span>
        <a class="resident-priority-value emergency-value" href="${phoneHref(e911?.phones?.[0]||'911')}">${escapeHtml(e911?.phones?.[0]||'911')}</a>
      </div>
      <div class="resident-priority-row">
        <div>
          <span class="resident-priority-label">Non-Emergency</span>
          <strong>Edison Police</strong>
        </div>
        <div class="resident-priority-actions">
          <a class="resident-priority-value" href="${phoneHref(police?.phones?.[0]||'732-248-7400')}">${escapeHtml(police?.phones?.[0]||'732-248-7400')}</a>
          ${police?.url?`<a class="resident-priority-link" href="${escapeHtml(police.url)}" target="_blank" rel="noopener">Police Department ${externalIcon()}</a>`:''}
        </div>
      </div>`;

    const vpca=find('VPCA - Village Pointe Condominium Association');
    const mgr=find('Village Pointe Site Property Manager');
    const company=find('Impac Property Management');
    const emergencyPhones=(mgr?.emergencyPhones||[]).map((phone,index)=>
      `<a href="${phoneHref(phone)}"><span>${index===0?'Emergency':'Alternate'}</span>${escapeHtml(phone)}</a>`
    ).join('');
    management.innerHTML=`
      <div class="resident-management-block">
        <strong>VPCA - Village Pointe Condominium Association</strong>
        <span>${escapeHtml(vpca?.address||'45 Edinburgh Ct, Edison, NJ 08820')}</span>
      </div>
      <div class="resident-management-block">
        <strong>Village Pointe Site Property Manager</strong>
        ${mgr?.phones?.[0]?`<a href="${phoneHref(mgr.phones[0])}"><span>On Site</span>${escapeHtml(mgr.phones[0])}</a>`:''}
        ${mgr?.email?`<a href="mailto:${escapeHtml(mgr.email)}"><span>Email</span>${escapeHtml(mgr.email)}</a>`:''}
        ${emergencyPhones}
        ${mgr?.officeHours?`<small>${escapeHtml(mgr.officeHours)}</small>`:''}
      </div>
      <div class="resident-management-block resident-company-block">
        <span>Property Management Company</span>
        <strong>${escapeHtml(company?.title||'Impac Property Management')}</strong>
      </div>`;

    const n=find('Notary Public in VP');
    const number=n?.phones?.[0]||'732-649-6410';
    notary.innerHTML=`
      <div class="resident-notary-main">
        <strong>Notary Public in VP</strong>
        <a href="${phoneHref(number)}">${escapeHtml(number)}</a>
      </div>
      <div class="resident-notary-actions">
        <a class="resident-action" href="${phoneHref(number)}">${phoneIcon()}<span>Call</span></a>
        <a class="resident-action" href="${smsHref(n?.sms||number)}">${smsIcon()}<span>Text</span></a>
        <a class="resident-action" href="${whatsappHref(n?.whatsapp||number)}" target="_blank" rel="noopener">${whatsappIcon()}<span>WhatsApp</span></a>
      </div>
      <small>Contact directly for availability and requirements.</small>`;
  }

  function searchableText(item){
    return [item.title,item.category,item.type,item.description,item.caution,item.address,item.email,item.officeHours,
      ...(item.services||[]),...(item.phones||[]),...(item.emergencyPhones||[]),...(item.searchTerms||[])
    ].filter(Boolean).join(' ').toLowerCase();
  }
  function scopeMatches(item,scope){
    if(scope==='All')return true;
    if(scope==='resident')return item.residentCurated===true || item.category==='Notary' || item.category==='Village Pointe & Management' || item.category==='Real Estate';
    return item.scope===scope;
  }
  function contactCell(item){
    const pieces=[];
    (item.phones||[]).forEach(phone=>pieces.push(`<a class="resident-contact-link" href="${phoneHref(phone)}"><span>${escapeHtml(item.phoneLabel||'Phone')}</span>${escapeHtml(phone)}</a>`));
    (item.emergencyPhones||[]).forEach((phone,index)=>pieces.push(`<a class="resident-contact-link resident-contact-emergency" href="${phoneHref(phone)}"><span>${index===0?'Emergency':'Alternate'}</span>${escapeHtml(phone)}</a>`));
    if(item.email)pieces.push(`<a class="resident-contact-link" href="mailto:${escapeHtml(item.email)}"><span>Email</span>${escapeHtml(item.email)}</a>`);
    if(item.address)pieces.push(`<span class="resident-contact-link resident-contact-static"><span>Address</span>${escapeHtml(item.address)}</span>`);
    if(!pieces.length && item.url)pieces.push('<span class="resident-contact-muted">Website resource</span>');
    return pieces.join('');
  }
  function actionCell(item){
    const actions=[];
    const primaryPhone=(item.phones||[])[0];
    if(primaryPhone)actions.push(`<a class="resident-action" href="${phoneHref(primaryPhone)}">${phoneIcon()}<span>Call</span></a>`);
    if(item.sms)actions.push(`<a class="resident-action" href="${smsHref(item.sms)}">${smsIcon()}<span>Text</span></a>`);
    if(item.whatsapp)actions.push(`<a class="resident-action" href="${whatsappHref(item.whatsapp)}" target="_blank" rel="noopener">${whatsappIcon()}<span>WhatsApp</span></a>`);
    if(item.email)actions.push(`<a class="resident-action" href="mailto:${escapeHtml(item.email)}">${mailIcon()}<span>Email</span></a>`);
    if(item.url)actions.push(`<a class="resident-action" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${externalIcon()}<span>Website</span></a>`);
    return actions.join('');
  }
  function detailsCell(item){
    const tags=(item.services||[]).slice(0,4).map(service=>`<span>${escapeHtml(service)}</span>`).join('');
    const desc=item.description?`<p>${escapeHtml(item.description)}</p>`:'';
    const hours=item.officeHours?`<small>${escapeHtml(item.officeHours)}</small>`:'';
    return `${tags?`<div class="resident-table-tags">${tags}</div>`:''}${desc}${hours}`;
  }
  function row(item){
    return `<tr>
      <td data-label="Contact"><strong class="resident-resource-title">${escapeHtml(item.title)}</strong>${item.type?`<span class="resident-resource-type">${escapeHtml(item.type)}</span>`:''}</td>
      <td data-label="Services">${detailsCell(item)}</td>
      <td data-label="Contact"><div class="resident-contact-stack">${contactCell(item)}</div></td>
      <td data-label="Actions"><div class="resident-action-list">${actionCell(item)}</div></td>
    </tr>`;
  }
  function table(title,items){
    if(!items.length)return '';
    return `<section class="resident-directory-group">
      <div class="resident-directory-group-heading"><h3>${escapeHtml(title)}</h3><span>${items.length} ${items.length===1?'contact':'contacts'}</span></div>
      <div class="resident-table-wrap"><table class="resident-directory-table">
        <thead><tr><th>Contact</th><th>Services</th><th>Contact</th><th>Actions</th></tr></thead>
        <tbody>${items.map(row).join('')}</tbody>
      </table></div>
    </section>`;
  }
  function filterItems(items){
    const q=search.value.trim().toLowerCase();
    const category=categorySelect.value;
    const scope=scopeSelect.value;
    return items.filter(item=>(category==='All'||item.category===category)&&scopeMatches(item,scope)&&(!q||searchableText(item).includes(q)))
      .sort((a,b)=>(a.priority??50)-(b.priority??50)||String(a.title||'').localeCompare(String(b.title||'')));
  }
  function render(){
    const residentItems=filterItems(data.filter(item=>item.residentCurated===true&&residentCategories.includes(item.category)));
    const realEstateItems=filterItems(data.filter(item=>item.category==='Real Estate'));
    const publicItems=filterItems(data.filter(item=>publicCategories.includes(item.category)));
    const otherItems=filterItems(data.filter(item=>otherCategories.includes(item.category)));

    residentResults.innerHTML=residentCategories.map(cat=>table(cat,residentItems.filter(i=>i.category===cat))).join('')||'<div class="notice">No matching resident supplied contacts.</div>';
    realEstateResults.innerHTML=realEstateItems.map(item=>`<div class="resident-real-estate-panel">
      <h3>Buying, Selling, Renting or Investing?</h3>
      <p>${escapeHtml(item.description||'')}</p>
      ${item.email?`<a class="resident-email-feature" href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a>`:''}
      ${item.caution?`<p class="resident-essential-note">${escapeHtml(item.caution)}</p>`:''}
    </div>`).join('')||'<div class="notice">No matching real estate resource.</div>';
    publicResults.innerHTML=publicCategories.map(cat=>table(cat,publicItems.filter(i=>i.category===cat))).join('')||'<div class="notice">No matching public resources.</div>';
    otherResults.innerHTML=otherCategories.map(cat=>table(cat,otherItems.filter(i=>i.category===cat))).join('')||'<div class="notice">No matching local or regional resources.</div>';
    count.textContent=residentItems.length+realEstateItems.length+publicItems.length+otherItems.length;
  }

  search.addEventListener('input',render);
  categorySelect.addEventListener('change',render);
  scopeSelect.addEventListener('change',render);
  clear.addEventListener('click',()=>{search.value='';categorySelect.value='All';scopeSelect.value='All';render();search.focus();});

  renderPrioritySections();
  render();
})();