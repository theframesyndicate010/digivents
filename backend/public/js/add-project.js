document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addProjectForm');
    const ui = window.AdminUI;
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';

            const formData = new FormData(form);
            await ui.apiRequest('/api/projects', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Project created successfully.', 'success');
            window.location.href = '/admin/projects';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to create project.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});