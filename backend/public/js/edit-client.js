document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editClientForm');
    const logoInput = document.getElementById('logoInput');
    const logoImage = document.getElementById('logoImage');
    const logoPlaceholder = document.getElementById('logoPlaceholder');
    const ui = window.AdminUI;

    if (!form) return;

    const id = window.location.pathname.split('/').pop();
    if (!id) return;

    loadClient();

    if (logoInput) {
        logoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];

            if (!file) {
                // Restore the saved logo (or the placeholder if there is none)
                const saved = form.dataset.logo || '';
                if (saved) {
                    logoImage.src = saved;
                    logoImage.classList.remove('hidden');
                    logoPlaceholder.classList.add('hidden');
                } else {
                    logoImage.classList.add('hidden');
                    logoPlaceholder.classList.remove('hidden');
                    logoImage.src = '';
                }
                return;
            }

            if (!file.type.startsWith('image/')) {
                ui.setFormAlert('formAlert', 'Please select a valid image file.', 'error');
                logoInput.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                ui.setFormAlert('formAlert', 'Image size must be less than 5MB.', 'error');
                logoInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                logoImage.src = event.target.result;
                logoImage.classList.remove('hidden');
                logoPlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            const formData = new FormData(form);
            formData.set('name', form.name.value);
            formData.set('website', form.website.value);
            formData.set('instagramLink', form.instagramLink.value);
            formData.set('facebookLink', form.facebookLink.value);
            formData.set('tiktokLink', form.tiktokLink.value);
            // No new file selected -> omit `photo` so the backend keeps the stored logo.

            await ui.apiRequest('/api/clients/' + encodeURIComponent(id), {
                method: 'PUT',
                body: formData,
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

            if (client.logo) {
                form.dataset.logo = client.logo;
                logoImage.src = client.logo;
                logoImage.classList.remove('hidden');
                logoPlaceholder.classList.add('hidden');
            }
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to load client.', 'error');
        }
    }
});