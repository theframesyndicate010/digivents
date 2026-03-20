document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editGraphicForm');
    const ui = window.AdminUI;
    if (!form) return;

    const id = window.location.pathname.split('/').pop();
    if (!id) return;

    loadGraphic();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            const formData = new FormData(form);
            await ui.apiRequest('/api/graphics/' + encodeURIComponent(id), {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Graphic updated successfully.', 'success');
            window.location.href = '/admin/graphics';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to update graphic.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    async function loadGraphic() {
        try {
            const result = await ui.apiRequest('/api/graphics/' + encodeURIComponent(id), { credentials: 'include' });
            const graphic = result.data || {};
            form.name.value = graphic.name || '';
            form.description.value = graphic.description || '';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to load graphic.', 'error');
        }
    }
});
