const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const THEME_KEY = 'luminarr_theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        if (savedTheme === DARK_THEME) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    } 
    else if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-theme');
        localStorage.setItem(THEME_KEY, DARK_THEME);
    } else {
        localStorage.setItem(THEME_KEY, LIGHT_THEME);
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem(THEME_KEY, LIGHT_THEME);
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem(THEME_KEY, DARK_THEME);
    }
    updateToggleVisuals();
}

function updateToggleVisuals() {
    const isDark = document.body.classList.contains('dark-theme');
    const toggles = [themeToggle, mobileThemeToggle];
    
    toggles.forEach(toggle => {
        if (toggle) {
            const sunIcon = toggle.querySelector('.sun-icon');
            const moonIcon = toggle.querySelector('.moon-icon');
            
            if (isDark) {
                sunIcon.style.color = 'var(--md-sys-color-on-surface-variant)';
                moonIcon.style.color = '#1C1B1F';
            } else {
                sunIcon.style.color = 'var(--md-sys-color-on-primary)';
                moonIcon.style.color = 'var(--md-sys-color-on-surface-variant)';
            }
        }
    });
}

loadTheme();
updateToggleVisuals();

themeToggle.addEventListener('click', toggleTheme);
mobileThemeToggle.addEventListener('click', toggleTheme);

const previewModal = document.getElementById('previewModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');

function openPreviewModal(title, imageSrc) {
    modalTitle.textContent = title;
    modalImage.src = imageSrc;
    modalImage.alt = title;
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.querySelector('.modal-content').style.opacity = 1;
    }, 10);
}

function closePreviewModal() {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
}

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    const expandBtn = card.querySelector('.feature-expand');
    const imageContainer = card.querySelector('.feature-image-container');
    const chevron = expandBtn ? expandBtn.querySelector('i') : null;
    const featureHeader = card.querySelector('.feature-header');
    
    featureHeader.addEventListener('click', function(e) {
        if (window.innerWidth > 768) {
            const title = card.getAttribute('data-title');
            const imageSrc = card.getAttribute('data-image');
            openPreviewModal(title, imageSrc);
        } 
        else {
            featureCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    const otherContainer = otherCard.querySelector('.feature-image-container');
                    const otherChevron = otherCard.querySelector('.feature-expand i');
                    
                    otherContainer.style.maxHeight = null;
                    otherChevron.style.transform = 'rotate(0deg)';
                    otherCard.classList.remove('expanded');
                }
            });
            
            if (card.classList.contains('expanded')) {
                imageContainer.style.maxHeight = null;
                if (chevron) chevron.style.transform = 'rotate(0deg)';
                card.classList.remove('expanded');
            } else {
                imageContainer.style.maxHeight = imageContainer.scrollHeight + 'px';
                if (chevron) chevron.style.transform = 'rotate(180deg)';
                card.classList.add('expanded');
            }
        }
    });
    
    if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            featureCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    const otherContainer = otherCard.querySelector('.feature-image-container');
                    const otherChevron = otherCard.querySelector('.feature-expand i');
                    
                    otherContainer.style.maxHeight = null;
                    otherChevron.style.transform = 'rotate(0deg)';
                    otherCard.classList.remove('expanded');
                }
            });
            
            if (card.classList.contains('expanded')) {
                imageContainer.style.maxHeight = null;
                chevron.style.transform = 'rotate(0deg)';
                card.classList.remove('expanded');
            } else {
                imageContainer.style.maxHeight = imageContainer.scrollHeight + 'px';
                chevron.style.transform = 'rotate(180deg)';
                card.classList.add('expanded');
            }
        });
    }
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.feature-card.expanded')) {
            featureCards.forEach(card => {
                if (card.classList.contains('expanded')) {
                    const container = card.querySelector('.feature-image-container');
                    const chevron = card.querySelector('.feature-expand i');
                    
                    container.style.maxHeight = null;
                    if (chevron) chevron.style.transform = 'rotate(0deg)';
                    card.classList.remove('expanded');
                }
            });
        }
    }
});

closeModal.addEventListener('click', closePreviewModal);
previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        closePreviewModal();
    }
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 20 + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const left = 5 + Math.random() * 90;
        const top = 5 + Math.random() * 90;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
}

const header = document.getElementById('mainHeader');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

mobileMenuBtn.addEventListener('click', toggleMobileMenu);
menuOverlay.addEventListener('click', toggleMobileMenu);

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
});

function setColorVariables() {
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue('--md-sys-color-primary');
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
        root.style.setProperty('--md-sys-color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setColorVariables();
});
// Google Play Modal Logic
const googlePlayModal = document.getElementById('googlePlayModal');
const closeGooglePlayModal = document.getElementById('closeGooglePlayModal');
const closeGooglePlayModalBtn = document.getElementById('closeGooglePlayModalBtn');
const googlePlayButton = document.getElementById('googlePlayButton');

function openGooglePlayModal() {
    googlePlayModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.querySelector('.google-play-content').style.opacity = 1;
    }, 10);
}

function closeGooglePlayModalFunc() {
    googlePlayModal.classList.remove('active');
    document.body.style.overflow = '';
}

googlePlayButton.addEventListener('click', function(e) {
    e.preventDefault();
    openGooglePlayModal();
});

closeGooglePlayModal.addEventListener('click', closeGooglePlayModalFunc);
closeGooglePlayModalBtn.addEventListener('click', closeGooglePlayModalFunc);
googlePlayModal.addEventListener('click', (e) => {
    if (e.target === googlePlayModal) {
        closeGooglePlayModalFunc();
    }
});