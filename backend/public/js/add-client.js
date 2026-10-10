document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addClientForm');
    const logoInput = document.getElementById('logoInput');
    const logoImage = document.getElementById('logoImage');
    const logoPlaceholder = document.getElementById('logoPlaceholder');
    const ui = window.AdminUI;

    if (!form) return;

    if (logoInput) {
        logoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];

            if (!file) {
                logoImage.classList.add('hidden');
                logoPlaceholder.classList.remove('hidden');
                logoImage.src = '';
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
            submitBtn.textContent = 'Adding...';

            // multipart/form-data so the logo file rides along.
            // Do NOT set Content-Type; the browser sets the multipart boundary.
            const formData = new FormData(form);
            formData.set('name', form.name.value);
            formData.set('website', form.website.value);
            formData.set('instagramLink', form.instagramLink.value);
            formData.set('facebookLink', form.facebookLink.value);
            formData.set('tiktokLink', form.tiktokLink.value);

            await ui.apiRequest('/api/clients', {
                method: 'POST',
                body: formData,
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