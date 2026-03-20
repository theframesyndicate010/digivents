document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addClientForm');
    const ui = window.AdminUI;
    if (!form) return;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';

            const payload = {
                name: form.name.value,
                website: form.website.value,
                instagramLink: form.instagramLink.value,
                facebookLink: form.facebookLink.value,
                tiktokLink: form.tiktokLink.value
            };

            await ui.apiRequest('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Client added successfully.', 'success');
            window.location.href = '/admin/clients';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to add client.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
