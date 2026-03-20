document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addCreatorForm');
    const ui = window.AdminUI;
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';

            const formData = new FormData(form);
            await ui.apiRequest('/api/creators', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Creator added successfully.', 'success');
            window.location.href = '/admin/creators';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to add creator.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
