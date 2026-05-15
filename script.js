const THEME_KEY = 'luminarr_theme';
const THEMES = ['light', 'dark', 'amoled'];
const CLASS_MAP = {
    light: '',
    dark: 'dark-theme',
    amoled: 'amoled-theme'
};

function loadTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(saved);
}

function setTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'light';

    document.body.classList.remove('dark-theme', 'amoled-theme');

    const cls = CLASS_MAP[theme];
    if (cls) document.body.classList.add(cls);

    document.querySelectorAll('.theme-segmented button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });

    localStorage.setItem(THEME_KEY, theme);
}

// Segmented toggle handlers
document.querySelectorAll('.theme-segmented button').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

// Mobile menu
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

// Screenshot modal
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

// Google Play modal
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

// Escape to close modals
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

// Load version from info.md
async function loadVersion() {
    const versionEl = document.getElementById('appVersion');
    if (!versionEl) return;

    try {
        const response = await fetch('info.md');
        if (!response.ok) throw new Error('Failed to load');
        const text = await response.text();
        versionEl.textContent = text.trim();
    } catch (err) {
        versionEl.textContent = '?';
    }
}

// Load features from features.json
async function loadFeatures() {
    const grid = document.getElementById('featuresGrid');
    const featuresList = document.getElementById('featuresList');
    if (!grid) return;

    try {
        const response = await fetch('features.json');
        if (!response.ok) throw new Error('Failed to load');
        const features = await response.json();

        // Render feature cards
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

        // Update terminal features list
        if (featuresList) {
            const titles = features.map(f => f.title.toLowerCase().replace(/\s+/g, '-'));
            featuresList.textContent = '["' + titles.join('", "') + '"]';
        }

        // Attach click handlers
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

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadVersion();
    loadFeatures();
});