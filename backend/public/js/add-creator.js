document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addCreatorForm');
    const ui = window.AdminUI;

    if (!form) return;

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