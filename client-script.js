// Simple client portal script (demo only, not production auth)
(function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    const loginForm = document.getElementById('client-login-form');
    const gallerySection = document.getElementById('client-gallery');
    const galleryGrid = document.getElementById('client-gallery-grid');
    const downloadSelectedBtn = document.getElementById('download-selected');
    const orderPrintsBtn = document.getElementById('order-prints');
    const logoutBtn = document.getElementById('logout-btn');

    const printModal = document.getElementById('print-order-modal');
    const modalClose = printModal ? printModal.querySelector('.modal-close') : null;
    const cancelOrder = document.getElementById('cancel-order');
    const proceedToCheckout = document.getElementById('proceed-to-checkout');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');

    // Demo credentials (replace with real auth)
    const DEMO_USER = { email: 'client@example.com', password: 'demo1234' };

    // Demo gallery data
    const clientPhotos = Array.from({ length: 24 }).map((_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/client${i+1}/600/400`,
        tags: i % 4 === 0 ? ['portraits'] : i % 3 === 0 ? ['details'] : ['candids'],
        favorite: i % 5 === 0
    }));

    let selectedPhotoIds = new Set();
    let currentPage = 1;
    const pageSize = 12;
    let currentFilter = 'all';

    function paginate(items) {
        const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
        currentPage = Math.min(currentPage, totalPages);
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return { items: items.slice(start, end), totalPages };
    }

    function getFiltered() {
        if (currentFilter === 'all') return clientPhotos;
        if (currentFilter === 'favorites') return clientPhotos.filter(p => p.favorite);
        return clientPhotos.filter(p => p.tags.includes(currentFilter));
    }

    function renderGallery() {
        if (!galleryGrid) return;
        const filtered = getFiltered();
        const { items, totalPages } = paginate(filtered);
        galleryGrid.innerHTML = '';
        items.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'client-photo';
            if (selectedPhotoIds.has(photo.id)) card.classList.add('selected');
            card.innerHTML = `
                <img src="${photo.url}" alt="Client photo ${photo.id}" loading="lazy" />
                <div class="select-checkbox">${selectedPhotoIds.has(photo.id) ? '✓' : ''}</div>
            `;
            card.addEventListener('click', () => toggleSelect(photo.id, card));
            galleryGrid.appendChild(card);
        });
        updatePagination(totalPages);
        updateFilterButtons();
    }

    function toggleSelect(photoId, cardEl) {
        if (selectedPhotoIds.has(photoId)) {
            selectedPhotoIds.delete(photoId);
            cardEl.classList.remove('selected');
            cardEl.querySelector('.select-checkbox').textContent = '';
        } else {
            selectedPhotoIds.add(photoId);
            cardEl.classList.add('selected');
            cardEl.querySelector('.select-checkbox').textContent = '✓';
        }
    }

    function updatePagination(totalPages) {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const currentPageEl = document.getElementById('current-page');
        const totalPagesEl = document.getElementById('total-pages');
        if (!prevBtn || !nextBtn || !currentPageEl || !totalPagesEl) return;
        currentPageEl.textContent = String(currentPage);
        totalPagesEl.textContent = String(totalPages);
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
        prevBtn.onclick = () => { currentPage = Math.max(1, currentPage - 1); renderGallery(); };
        nextBtn.onclick = () => { currentPage = Math.min(totalPages, currentPage + 1); renderGallery(); };
    }

    function updateFilterButtons() {
        const buttons = document.querySelectorAll('.gallery-filters .filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        const active = document.querySelector(`.gallery-filters .filter-btn[data-filter="${currentFilter}"]`);
        if (active) active.classList.add('active');
    }

    function showModal() { if (printModal) printModal.style.display = 'block'; }
    function hideModal() { if (printModal) printModal.style.display = 'none'; }

    function recalcOrder() {
        if (!orderItems || !orderTotal) return;
        const qtyInputs = document.querySelectorAll('.quantity-input');
        let total = 0;
        let list = '';
        qtyInputs.forEach(input => {
            const qty = parseInt(input.value || '0', 10);
            const price = parseFloat(input.dataset.price || '0');
            const size = input.dataset.size || '';
            if (qty > 0) {
                const line = qty * price;
                total += line;
                list += `<div>${qty} x ${size} - $${line.toFixed(2)}</div>`;
            }
        });
        orderItems.innerHTML = list || '<em>No items yet</em>';
        orderTotal.textContent = total.toFixed(2);
    }

    function handleDownloadSelected() {
        if (selectedPhotoIds.size === 0) {
            alert('Please select at least one photo.');
            return;
        }
        alert(`Preparing ${selectedPhotoIds.size} photo(s) for download. (Demo)`);
        // In production, request a ZIP from the server
    }

    function loginSuccess() {
        const container = document.querySelector('.login-container');
        if (container) container.style.display = 'none';
        if (gallerySection) gallerySection.style.display = 'block';
        renderGallery();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(loginForm);
            const email = String(fd.get('email') || '').trim().toLowerCase();
            const password = String(fd.get('password') || '').trim();
            if (email === DEMO_USER.email && password === DEMO_USER.password) {
                sessionStorage.setItem('clientLoggedIn', '1');
                loginSuccess();
            } else {
                alert('Invalid credentials (use client@example.com / demo1234 for demo)');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('clientLoggedIn');
            location.href = 'client-login.html';
        });
    }

    if (downloadSelectedBtn) downloadSelectedBtn.addEventListener('click', handleDownloadSelected);

    if (orderPrintsBtn) {
        orderPrintsBtn.addEventListener('click', () => {
            showModal();
            recalcOrder();
        });
    }
    if (modalClose) modalClose.addEventListener('click', hideModal);
    if (cancelOrder) cancelOrder.addEventListener('click', hideModal);
    if (proceedToCheckout) {
        proceedToCheckout.addEventListener('click', () => {
            alert('Checkout flow would start here. (Demo)');
            hideModal();
        });
    }

    document.addEventListener('input', (e) => {
        if ((e.target instanceof HTMLElement) && e.target.classList.contains('quantity-input')) {
            recalcOrder();
        }
    });

    // Filters
    const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter') || 'all';
        currentPage = 1;
        renderGallery();
    }));

    // Auto-login if already in session
    if (sessionStorage.getItem('clientLoggedIn') === '1') {
        loginSuccess();
    }
})();


