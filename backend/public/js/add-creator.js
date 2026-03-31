document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addCreatorForm');
    const photoInput = document.getElementById('photoInput');
    const photoImage = document.getElementById('photoImage');
    const photoPlaceholder = document.getElementById('photoPlaceholder');
    const ui = window.AdminUI;

    if (!form) return;

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
            } else {
                // Reset to placeholder if no file selected
                photoImage.classList.add('hidden');
                photoPlaceholder.classList.remove('hidden');
                photoImage.src = '';
            }
        });
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';

            const formData = new FormData(form);

            // 🔍 DEBUG: check what is being sent
            for (let [key, value] of formData.entries()) {
                console.log('FormData:', key, value);
            }

            const response = await fetch('/api/creators', {
                method: 'POST',
                body: formData,
                credentials: 'include'
                // ❌ DO NOT set Content-Type here
            });

            // 🔍 DEBUG
            console.log('Response status:', response.status);

            let data;
            const contentType = response.headers.get('content-type');

            // ✅ Safely parse response
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned invalid response');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add creator');
            }

            ui.setFormAlert('formAlert', 'Creator added successfully.', 'success');

            // Small delay for UX
            setTimeout(() => {
                window.location.href = '/admin/creators';
            }, 800);

        } catch (error) {
            console.error('Upload Error:', error);
            ui.setFormAlert(
                'formAlert',
                error.message || 'Failed to add creator.',
                'error'
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});