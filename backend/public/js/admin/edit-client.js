document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editClientForm');
    const ui = window.AdminUI;
    if (!form) return;

    const id = window.location.pathname.split('/').pop();
    if (!id) return;

    loadClient();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            const payload = {
                name: form.name.value,
                website: form.website.value,
                instagramLink: form.instagramLink.value,
                facebookLink: form.facebookLink.value,
                tiktokLink: form.tiktokLink.value
            };

            await ui.apiRequest('/api/clients/' + encodeURIComponent(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Client updated successfully.', 'success');
            window.location.href = '/admin/clients';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to update client.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    async function loadClient() {
        try {
            const result = await ui.apiRequest('/api/clients/' + encodeURIComponent(id), { credentials: 'include' });
            const client = result.data || {};
            form.name.value = client.name || '';
            form.website.value = client.website || '';
            form.instagramLink.value = client.instagram_link || '';
            form.facebookLink.value = client.facebook_link || '';
            form.tiktokLink.value = client.tiktok_link || '';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to load client.', 'error');
        }
    }
});
