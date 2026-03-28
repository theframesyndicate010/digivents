(function() {
    'use strict';
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileMenuOverlay');
    const MOBILE_BREAKPOINT = 768;

    /**
     * Toggle mobile menu visibility
     */
    function toggleMobileMenu() {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        }
    }

    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    }

    /**
     * Handle menu button clicks
     */
    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-toggle-mobile-menu]');
        if (btn) {
            e.preventDefault();
            toggleMobileMenu();
        }
    });

    /**
     * Close menu when overlay is clicked
     */
    if (overlay) {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                closeMobileMenu();
            }
        });
    }

    /**
     * Close menu when a navigation link is clicked
     */
    const navLinks = sidebar.querySelectorAll('a[href^="/admin"]');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < MOBILE_BREAKPOINT) {
                closeMobileMenu();
            }
        });
    });

    /**
     * Initialize on page load
     */
    document.addEventListener('DOMContentLoaded', () => {
        closeMobileMenu();
    });

    /**
     * Handle window resize
     */
    window.addEventListener('resize', () => {
        if (window.innerWidth >= MOBILE_BREAKPOINT) {
            closeMobileMenu();
        }
    });

    /**
     * Expose functions globally for testing
     */
    window.mobileMenuAPI = {
        toggle: toggleMobileMenu,
        close: closeMobileMenu
    };
})();