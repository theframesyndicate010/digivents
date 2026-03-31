document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editCreatorForm');
    const photoInput = document.getElementById('photoInput');
    const photoImage = document.getElementById('photoImage');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    const ui = window.AdminUI;
    if (!form) return;

    const id = window.location.pathname.split('/').pop();
    if (!id) return;

    // Photo preview functionality
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    ui.setFormAlert('formAlert', 'Please select a valid image file.', 'error');
                    photoInput.value = '';
                    return;
                }

                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    ui.setFormAlert('formAlert', 'Image size must be less than 5MB.', 'error');
                    photoInput.value = '';
                    return;
                }

                // Create preview
                const reader = new FileReader();
                reader.onload = function(event) {
                    photoImage.src = event.target.result;
                    photoImage.classList.remove('hidden');
                    photoPlaceholder.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

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
            
            // Show existing photo if available
            if (creator.photo) {
                photoImage.src = creator.photo;
                photoImage.classList.remove('hidden');
                photoPlaceholder.classList.add('hidden');
            }
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to load creator.', 'error');
        }
    }
});