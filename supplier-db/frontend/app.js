const API = "http://localhost:5000/api/suppliers";
;

// UI refs
const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const categoryList = document.getElementById('categoryList');
const totalCount = document.getElementById('totalCount');
const catCount = document.getElementById('catCount');
const perPageEl = document.getElementById('perPage');
const paginationEl = document.getElementById('pagination');

let state = { page:1, limit:6, q:'', category:'' , total:0, categories:[] , editingId: null };

async function fetchSuppliers() {
  const params = new URLSearchParams();
  if (state.q) params.set('q', state.q);
  if (state.category) params.set('category', state.category);
  params.set('page', state.page);
  params.set('limit', state.limit);

  const res = await fetch(API + '/all?' + params.toString());
  const data = await res.json();
  state.total = data.total;
  state.categories = data.categories || [];
  renderSuppliers(data.suppliers || []);
  renderCategories(state.categories);
  renderStats();
  renderPagination();
}

function renderSuppliers(items) {
  listEl.innerHTML = '';
  if (!items.length) { listEl.innerHTML = '<p>No suppliers found.</p>'; return; }
  items.forEach(s => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <h4>${escapeHtml(s.name)}</h4>
      <p>${escapeHtml(s.company)} · ${escapeHtml(s.category)}</p>
      <p>${escapeHtml(s.address)}</p>
      <div class="meta">
        <small>${escapeHtml(s.phone)}</small>
        <div>
          <button onclick="onEdit('${s._id}')">Edit</button>
          <button onclick="onDelete('${s._id}')">Delete</button>
        </div>
      </div>
    `;
    listEl.appendChild(el);
  });
}

function renderCategories(categories) {
  categoryList.innerHTML = '';
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(c => {
    const it = document.createElement('div');
    it.className = 'category-item';
    it.innerHTML = `<span>${escapeHtml(c.category)}</span><strong>${c.count}</strong>`;
    it.onclick = () => { state.category = c.category; state.page = 1; fetchSuppliers(); };
    categoryList.appendChild(it);

    const opt = document.createElement('option');
    opt.value = c.category;
    opt.textContent = c.category + ' ('+c.count+')';
    categoryFilter.appendChild(opt);
  });
  catCount.textContent = categories.length;
}

function renderStats(){
  totalCount.textContent = state.total || 0;
}

function renderPagination(){
  paginationEl.innerHTML = '';
  const pages = Math.ceil(state.total / state.limit) || 1;
  for(let i=1;i<=pages;i++){
    const btn = document.createElement('button');
    btn.textContent = i;
    if(i===state.page) btn.disabled = true;
    btn.onclick = ()=>{ state.page = i; fetchSuppliers(); };
    paginationEl.appendChild(btn);
  }
}

// Escape helper
function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

// Actions
async function onDelete(id){
  if(!confirm('Delete supplier?')) return;
  await fetch(API + '/delete/' + id, { method: 'DELETE' });
  fetchSuppliers();
}

// Modal form
const modal = document.getElementById('modal');
const supplierForm = document.getElementById('supplierForm');
const newBtn = document.getElementById('newBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');

newBtn.onclick = ()=> openModal();
cancelBtn.onclick = ()=> closeModal();

async function onEdit(id){
  const res = await fetch(API + '/' + id);
  const data = await res.json();
  document.getElementById('name').value = data.name;
  document.getElementById('company').value = data.company;
  document.getElementById('phone').value = data.phone;
  document.getElementById('address').value = data.address;
  document.getElementById('category').value = data.category || '';
  state.editingId = id;
  modalTitle.textContent = 'Edit Supplier';
  openModal();
}

function openModal(){ modal.classList.remove('hidden'); }
function closeModal(){ modal.classList.add('hidden'); supplierForm.reset(); state.editingId = null; modalTitle.textContent = 'Add Supplier'; }

supplierForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value.trim(),
    company: document.getElementById('company').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    category: document.getElementById('category').value.trim() || 'General'
  };
  if(state.editingId){
    await fetch(API + '/update/' + state.editingId, {
      method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
  } else {
    await fetch(API + '/add', {
      method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
  }
  closeModal();
  fetchSuppliers();
});

// search & filters
searchEl.addEventListener('input', (e)=>{ state.q = e.target.value; state.page = 1; setTimeout(()=>fetchSuppliers(), 200); });
categoryFilter.addEventListener('change', (e)=>{ state.category = e.target.value; state.page = 1; fetchSuppliers(); });
perPageEl.addEventListener('change', (e)=>{ state.limit = parseInt(e.target.value); state.page = 1; fetchSuppliers(); });

// initial load
fetchSuppliers();
