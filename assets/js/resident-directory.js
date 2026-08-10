(function(){
  const data=Array.isArray(window.VP_DIRECTORY_DATA)?window.VP_DIRECTORY_DATA:[];
  const form=document.querySelector('[data-resident-directory-form]');
  const search=document.querySelector('[data-resident-directory-search]');
  const categorySelect=document.querySelector('[data-resident-directory-category]');
  const scopeSelect=document.querySelector('[data-resident-directory-scope]');
  const results=document.querySelector('[data-resident-directory-results]');
  const count=document.querySelector('[data-resident-directory-count]');
  const clear=document.querySelector('[data-resident-directory-clear]');
  const essential=document.querySelector('[data-resident-essential-cards]');
  if(!form||!search||!categorySelect||!scopeSelect||!results||!count||!clear||!essential)return;

  const preferredOrder=[
    'Notary',
    'Emergency & Safety',
    'Village Pointe & Management',
    'Real Estate',
    'Handyman',
    'Plumbing',
    'Electrical',
    'HVAC & Appliances',
    'Garage & Locksmith',
    'Cleaning',
    'Government',
    'Schools & Family',
    'Transportation',
    'Consumer Verification',
    'Home Services',
    'Auto & Mobility',
    'Health & Wellness',
    'Shopping & Dining',
    'Pets',
    'Transportation & Travel'
  ];
  const discovered=Array.from(new Set(data.map(item=>item.category).filter(Boolean)));
  const categories=[
    ...preferredOrder.filter(category=>discovered.includes(category)),
    ...discovered.filter(category=>!preferredOrder.includes(category)).sort((a,b)=>a.localeCompare(b))
  ];
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
  function whatsappHref(phone){
    const number=digits(phone);
    return number?'https://wa.me/'+(number.length===10?'1'+number:number):'';
  }
  function smsHref(phone){
    const number=digits(phone);
    return number?'sms:+'+(number.length===10?'1'+number:number):'';
  }
  function externalIcon(){
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 5h5v5M19 5l-9 9"/><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  }
  function phoneIcon(){
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 4h3l1.2 4-2 1.5a14 14 0 0 0 5.3 5.3l1.5-2L20 14v3c0 1.1-.9 2-2 2C10.8 19 5 13.2 5 6c0-1.1.9-2 2-2Z"/></svg>';
  }
  function smsIcon(){
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15a4 4 0 0 1-4 4H8l-5 3 1.5-4.5A4 4 0 0 1 3 14V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z"/><path d="M8 10h8M8 14h5"/></svg>';
  }
  function whatsappIcon(){
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z"/><path d="M9.2 8.4c.4 2.2 2.1 4 4.4 4.7"/><path d="M13.7 13.1l1.2-1.1"/></svg>';
  }
  function mailIcon(){
    return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>';
  }

  function find(title){return data.find(item=>item.title===title);}

  function renderEssentialCards(){
    const emergency=find('Emergency 911');
    const police=find('Edison Police Nonemergency Dispatch');
    const association=find('Village Pointe Condominium Association');
    const management=find('Impac Property Management');
    const realEstate=find('Village Pointe Real Estate Interest');

    const emergencyHtml=`<article class="resident-essential-card emergency-card">
      <div class="resident-card-kicker">Emergency & Public Safety</div>
      <h3>Edison Emergency</h3>
      ${emergency?`<a class="resident-hero-contact emergency-number" href="${phoneHref(emergency.phones?.[0]||'911')}"><span>Emergency</span><strong>${escapeHtml(emergency.phones?.[0]||'911')}</strong></a>`:''}
      ${police?`<div class="resident-essential-sub">
        <strong>Edison Police Nonemergency</strong>
        <a href="${phoneHref(police.phones?.[0])}">${escapeHtml(police.phones?.[0])}</a>
        ${police.url?`<a class="resident-card-link" href="${escapeHtml(police.url)}" target="_blank" rel="noopener">Official Edison Police Website ${externalIcon()}</a>`:''}
      </div>`:''}
    </article>`;

    const managementPhones=(management?.emergencyPhones||[]).map(phone=>
      `<a href="${phoneHref(phone)}">${escapeHtml(phone)}</a>`
    ).join('<span class="resident-contact-separator">·</span>');
    const vpHtml=`<article class="resident-essential-card vp-card">
      <div class="resident-card-kicker">Village Pointe</div>
      <h3>VPCA & Property Management</h3>
      ${association?`<div class="resident-essential-block">
        <strong>Village Pointe Condominium Association</strong>
        <span>${escapeHtml(association.address||'')}</span>
      </div>`:''}
      ${management?`<div class="resident-essential-block">
        <strong>${escapeHtml(management.title)}</strong>
        <a href="${phoneHref(management.phones?.[0])}"><span class="resident-inline-label">${escapeHtml(management.phoneLabel||'Phone')}</span>${escapeHtml(management.phones?.[0]||'')}</a>
        <a href="mailto:${escapeHtml(management.email||'')}">${escapeHtml(management.email||'')}</a>
        <div><span class="resident-inline-label">Emergency</span>${managementPhones}</div>
      </div>`:''}
    </article>`;

    const realEstateHtml=`<article class="resident-essential-card real-estate-essential-card">
      <div class="resident-card-kicker">Real Estate Interest</div>
      <h3>Buying, Selling, Renting or Investing?</h3>
      <p>${escapeHtml(realEstate?.description||'For general public inquiries about buying, selling, renting, or investing at Village Pointe.')}</p>
      ${realEstate?.email?`<a class="resident-email-feature" href="mailto:${escapeHtml(realEstate.email)}">${escapeHtml(realEstate.email)}</a>`:''}
      <p class="resident-essential-note">${escapeHtml(realEstate?.caution||'')}</p>
    </article>`;

    essential.innerHTML=emergencyHtml+vpHtml+realEstateHtml;
  }

  function scopeMatches(item,scope){
    if(scope==='All')return true;
    if(scope==='resident'){
      return item.residentCurated===true ||
        item.category==='Village Pointe & Management' ||
        item.category==='Real Estate' ||
        item.category==='Notary';
    }
    return item.scope===scope;
  }

  function searchableText(item){
    return [
      item.title,item.category,item.type,item.description,item.caution,item.address,item.email,item.officeHours,
      ...(item.services||[]),...(item.phones||[]),...(item.emergencyPhones||[]),...(item.searchTerms||[])
    ].filter(Boolean).join(' ').toLowerCase();
  }

  function contactCell(item){
    const pieces=[];
    (item.phones||[]).forEach(phone=>{
      pieces.push(`<a class="resident-contact-link" href="${phoneHref(phone)}"><span>${escapeHtml(item.phoneLabel||'Phone')}</span>${escapeHtml(phone)}</a>`);
    });
    (item.emergencyPhones||[]).forEach(phone=>{
      pieces.push(`<a class="resident-contact-link resident-contact-emergency" href="${phoneHref(phone)}"><span>${escapeHtml(item.emergencyPhoneLabel||'Emergency')}</span>${escapeHtml(phone)}</a>`);
    });
    if(item.email)pieces.push(`<a class="resident-contact-link" href="mailto:${escapeHtml(item.email)}"><span>Email</span>${escapeHtml(item.email)}</a>`);
    if(item.address)pieces.push(`<span class="resident-contact-link resident-contact-static"><span>Address</span>${escapeHtml(item.address)}</span>`);
    if(!pieces.length && item.url)pieces.push('<span class="resident-contact-muted">Website resource</span>');
    return pieces.join('');
  }

  function actionCell(item){
    const actions=[];
    const primaryPhone=(item.phones||[])[0];
    if(primaryPhone){
      actions.push(`<a class="resident-action" href="${phoneHref(primaryPhone)}" aria-label="Call ${escapeHtml(item.title)}">${phoneIcon()}<span>Call</span></a>`);
    }
    if(item.sms){
      actions.push(`<a class="resident-action" href="${smsHref(item.sms)}" aria-label="Text ${escapeHtml(item.title)}">${smsIcon()}<span>Text</span></a>`);
    }
    if(item.whatsapp){
      actions.push(`<a class="resident-action" href="${whatsappHref(item.whatsapp)}" target="_blank" rel="noopener" aria-label="WhatsApp ${escapeHtml(item.title)}">${whatsappIcon()}<span>WhatsApp</span></a>`);
    }
    if(item.email){
      actions.push(`<a class="resident-action" href="mailto:${escapeHtml(item.email)}" aria-label="Email ${escapeHtml(item.title)}">${mailIcon()}<span>Email</span></a>`);
    }
    if(item.url){
      actions.push(`<a class="resident-action" href="${escapeHtml(item.url)}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(item.title)} website">${externalIcon()}<span>Website</span></a>`);
    }
    return actions.join('');
  }

  function detailsCell(item){
    const tags=(item.services||[]).slice(0,4).map(service=>`<span>${escapeHtml(service)}</span>`).join('');
    const description=escapeHtml(item.description||'');
    const hours=item.officeHours?`<small>${escapeHtml(item.officeHours)}</small>`:'';
    return `${tags?`<div class="resident-table-tags">${tags}</div>`:''}${description?`<p>${description}</p>`:''}${hours}`;
  }

  function row(item){
    return `<tr>
      <td data-label="Resource">
        <strong class="resident-resource-title">${escapeHtml(item.title)}</strong>
        <span class="resident-resource-type">${escapeHtml(item.type||item.category||'Resource')}</span>
      </td>
      <td data-label="Details">${detailsCell(item)}</td>
      <td data-label="Contact"><div class="resident-contact-stack">${contactCell(item)}</div></td>
      <td data-label="Actions"><div class="resident-action-list">${actionCell(item)}</div></td>
    </tr>`;
  }

  function groupSection(category,items){
    return `<section class="resident-directory-group">
      <div class="resident-directory-group-heading">
        <h3>${escapeHtml(category)}</h3>
        <span>${items.length} ${items.length===1?'resource':'resources'}</span>
      </div>
      <div class="resident-table-wrap">
        <table class="resident-directory-table">
          <thead><tr><th>Resource</th><th>Details</th><th>Contact</th><th>Actions</th></tr></thead>
          <tbody>${items.map(row).join('')}</tbody>
        </table>
      </div>
    </section>`;
  }

  function render(){
    const q=search.value.trim().toLowerCase();
    const category=categorySelect.value;
    const scope=scopeSelect.value;
    const filtered=data.filter(item=>
      (category==='All'||item.category===category) &&
      scopeMatches(item,scope) &&
      (!q||searchableText(item).includes(q))
    ).sort((a,b)=>
      (a.priority??50)-(b.priority??50) ||
      String(a.title||'').localeCompare(String(b.title||''))
    );
    count.textContent=filtered.length;
    if(!filtered.length){
      results.innerHTML='<div class="notice"><strong>No matching resource.</strong> Try a broader search term or choose All categories and All resources.</div>';
      return;
    }
    const grouped=categories.map(cat=>({
      cat,
      items:filtered.filter(item=>item.category===cat)
    })).filter(group=>group.items.length);
    results.innerHTML=grouped.map(group=>groupSection(group.cat,group.items)).join('');
  }

  search.addEventListener('input',render);
  categorySelect.addEventListener('change',render);
  scopeSelect.addEventListener('change',render);
  clear.addEventListener('click',()=>{
    search.value='';
    categorySelect.value='All';
    scopeSelect.value='All';
    render();
    search.focus();
  });
  form.addEventListener('submit',event=>event.preventDefault());

  renderEssentialCards();
  render();
})();