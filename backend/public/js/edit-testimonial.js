document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editTestimonialForm');
    const photoInput = document.getElementById('photoInput');
    const photoImage = document.getElementById('photoImage');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    const ui = window.AdminUI;

    if (!form) return;

    const id = window.location.pathname.split('/').pop();
    if (!id) return;

    loadTestimonial();

    if (photoInput) {
        photoInput.addEventListener('change', function (e) {
            const file = e.target.files[0];

            if (!file) {
                const saved = form.dataset.avatar || '';
                if (saved) {
                    photoImage.src = saved;
                    photoImage.classList.remove('hidden');
                    photoPlaceholder.classList.add('hidden');
                } else {
                    photoImage.classList.add('hidden');
                    photoPlaceholder.classList.remove('hidden');
                    photoImage.src = '';
                }
                return;
            }

            if (!file.type.startsWith('image/')) {
                ui.setFormAlert('formAlert', 'Please select a valid image file.', 'error');
                photoInput.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                ui.setFormAlert('formAlert', 'Image size must be less than 5MB.', 'error');
                photoInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                photoImage.src = event.target.result;
                photoImage.classList.remove('hidden');
                photoPlaceholder.classList.add('hidden');
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
            formData.set('text', form.text.value);
            formData.set('position', form.position.value);
            formData.set('is_active', form.is_active.value);
            // No new file selected -> omit `photo` so the backend keeps the stored photo.

            await ui.apiRequest('/api/testimonials/' + encodeURIComponent(id), {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Testimonial updated successfully.', 'success');
            window.location.href = '/admin/testimonials';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to update testimonial.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    async function loadTestimonial() {
        try {
            const result = await ui.apiRequest('/api/testimonials/' + encodeURIComponent(id), { credentials: 'include' });
            const t = result.data || {};

            form.name.value = t.name || '';
            form.text.value = t.text || '';
            form.position.value = t.position != null ? t.position : 0;
            form.is_active.value = t.is_active ? 'true' : 'false';

            if (t.avatar) {
                form.dataset.avatar = t.avatar;
                photoImage.src = t.avatar;
                photoImage.classList.remove('hidden');
                photoPlaceholder.classList.add('hidden');
            }
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to load testimonial.', 'error');
        }
    }
});