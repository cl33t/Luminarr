const THEME_KEY = 'luminarr_theme';
const THEMES = ['light', 'dark', 'morph'];
const CLASS_MAP = {
    light: '',
    dark: 'dark-theme',
    morph: 'morph-theme'
};
function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(saved);
}
function setTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'light';
    document.body.classList.remove('dark-theme', 'morph-theme');
    const cls = CLASS_MAP[theme];
    if (cls) document.body.classList.add(cls);
    document.querySelectorAll('.theme-segmented button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    localStorage.setItem(THEME_KEY, theme);
}
document.querySelectorAll('.theme-segmented button').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
function toggleMenu() {
    const isActive = mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars', !isActive);
    icon.classList.toggle('fa-times', isActive);
}
mobileMenuBtn?.addEventListener('click', toggleMenu);
menuOverlay?.addEventListener('click', toggleMenu);
mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMenu);
});
const screenshotModal = document.getElementById('screenshotModal');
const screenshotModalTitle = document.getElementById('screenshotModalTitle');
const screenshotModalImage = document.getElementById('screenshotModalImage');
const closeScreenshotModal = document.getElementById('closeScreenshotModal');
function openScreenshotModal(title, imageSrc) {
    screenshotModalTitle.textContent = title;
    screenshotModalImage.src = imageSrc;
    screenshotModalImage.alt = title;
    screenshotModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeScreenshotModalFunc() {
    screenshotModal.classList.remove('active');
    document.body.style.overflow = '';
    screenshotModalImage.src = '';
}
closeScreenshotModal?.addEventListener('click', closeScreenshotModalFunc);
screenshotModal?.addEventListener('click', (e) => {
    if (e.target === screenshotModal) closeScreenshotModalFunc();
});
const googlePlayModal = document.getElementById('googlePlayModal');
const googlePlayButton = document.getElementById('googlePlayButton');
const closeGooglePlayModal = document.getElementById('closeGooglePlayModal');
const closeGooglePlayModalBtn = document.getElementById('closeGooglePlayModalBtn');
function openModal() {
    googlePlayModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    googlePlayModal.classList.remove('active');
    document.body.style.overflow = '';
}
googlePlayButton?.addEventListener('click', openModal);
closeGooglePlayModal?.addEventListener('click', closeModal);
closeGooglePlayModalBtn?.addEventListener('click', closeModal);
googlePlayModal?.addEventListener('click', (e) => {
    if (e.target === googlePlayModal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (screenshotModal?.classList.contains('active')) {
            closeScreenshotModalFunc();
        }
        if (googlePlayModal?.classList.contains('active')) {
            closeModal();
        }
    }
});
function initGrain() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const v = Math.random() * 255;
            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
            data[i + 3] = 8;
        }
        ctx.putImageData(imageData, 0, 0);
    }
    let frame = 0;
    function animate() {
        frame++;
        if (frame % 3 === 0) draw();
        requestAnimationFrame(animate);
    }
    animate();
}
async function loadVersion() {
    const versionEl = document.getElementById('appVersion');
    if (!versionEl) return;
    try {
        const response = await fetch('info.md');
        if (!response.ok) throw new Error('Failed to load');
        const text = await response.text();
        versionEl.textContent = text.trim();
    } catch (err) {
        versionEl.textContent = 'v2.1.0-beta';
    }
}
async function loadFeatures() {
    const grid = document.getElementById('featuresGrid');
    const featuresList = document.getElementById('featuresList');
    if (!grid) return;
    try {
        const response = await fetch('features.json');
        if (!response.ok) throw new Error('Failed to load');
        const features = await response.json();
        grid.innerHTML = features.map((f, i) => {
            const num = String(i + 1).padStart(2, '0');
            return `
                <div class="feature-card" data-title="${f.title}" data-image="${f.picture}">
                    <div class="feature-number">${num}</div>
                    <h3 class="feature-title">${f.title}</h3>
                    <p class="feature-desc">${f.summary}</p>
                    <div class="feature-thumb">
                        <img src="${f.picture}" alt="${f.title}" loading="lazy">
                    </div>
                </div>
            `;
        }).join('');
        if (featuresList) {
            const titles = features.map(f => f.title.toLowerCase().replace(/\s+/g, '-'));
            featuresList.textContent = '["' + titles.join('", "') + '"]';
        }
        grid.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => {
                const title = card.dataset.title;
                const image = card.dataset.image;
                if (title && image) {
                    openScreenshotModal(title, image);
                }
            });
        });
    } catch (err) {
        grid.innerHTML = '<div class="feature-card"><p class="feature-desc">Failed to load features.</p></div>';
        if (featuresList) featuresList.textContent = '[error]';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initGrain();
    loadVersion();
    loadFeatures();
});
