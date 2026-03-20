document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addGraphicForm');
    const ui = window.AdminUI;
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';

            const formData = new FormData(form);
            await ui.apiRequest('/api/graphics', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Graphic added successfully.', 'success');
            window.location.href = '/admin/graphics';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to add graphic.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
