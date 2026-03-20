document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('editProjectForm');
    const ui = window.AdminUI;
    if (!form) return;

    const id = window.location.pathname.split('/').pop();
    if (!id) return;

    loadProject();

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            const formData = new FormData(form);
            await ui.apiRequest('/api/projects/' + encodeURIComponent(id), {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });

            ui.setFormAlert('formAlert', 'Project updated successfully.', 'success');
            window.location.href = '/admin/projects';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to update project.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    async function loadProject() {
        try {
            const result = await ui.apiRequest('/api/projects/' + encodeURIComponent(id), { credentials: 'include' });
            const project = result.data || {};
            form.name.value = project.name || '';
            form.client.value = project.client || '';
            form.description.value = project.description || '';
            form.contact.value = project.contact || '';
            form.tag.value = project.tag || '';
            form.instagramLink.value = project.instagramLink || '';
            form.facebookLink.value = project.facebookLink || '';
            form.tiktokLink.value = project.tiktokLink || '';
            form.youtubeLink.value = project.youtubeLink || '';
        } catch (error) {
            ui.setFormAlert('formAlert', error.message || 'Failed to load project.', 'error');
        }
    }
});
