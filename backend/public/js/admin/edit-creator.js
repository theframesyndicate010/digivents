document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editCreatorForm');
    const ui = window.AdminUI;
    if (!form) return;

    const id = window.location.pathname.split('/').pop();
    if (!id) return;

    loadCreator();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            const formData = new FormData(form);
            await ui.apiRequest('/api/creators/' + encodeURIComponent(id), {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Creator updated successfully.', 'success');
            window.location.href = '/admin/creators';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to update creator.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    async function loadCreator() {
        try {
            const result = await ui.apiRequest('/api/creators/' + encodeURIComponent(id), { credentials: 'include' });
            const creator = result.data || {};
            form.name.value = creator.name || '';
            form.role.value = creator.role || '';
            form.description.value = creator.description || '';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to load creator.', 'error');
        }
    }
});
