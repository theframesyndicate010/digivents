// Login form functionality
(function() {
    'use strict';

    function handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        
        if (!submitBtn || !btnText) {
            form.submit();
            return;
        }
        
        const originalText = btnText.innerHTML;

        // Disable button and show loading state
        submitBtn.disabled = true;
        btnText.innerHTML = '<span class="loading-spinner"></span>Signing in...';

        // Submit form after a brief delay for UX
        setTimeout(() => {
            form.submit();
        }, 300);
    }

    // Attach form submit handler
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleSubmit);
        }
    });
})();
