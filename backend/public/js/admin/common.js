(function initAdminUI() {
    if (window.AdminUI) return;

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDate(value) {
        if (!value) return '-';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '-';
        return date.toLocaleDateString();
    }

    async function apiRequest(url, options) {
        const response = await fetch(url, options || {});
        const payload = await response.json().catch(function () {
            return { success: false, message: 'Invalid API response' };
        });

        if (!response.ok || payload.success === false) {
            const error = new Error(payload.message || 'Request failed');
            error.payload = payload;
            error.status = response.status;
            throw error;
        }

        return payload;
    }

    function setElementText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value == null ? '' : value);
    }

    function showElement(id, message, className) {
        const el = document.getElementById(id);
        if (!el) return;
        if (message != null) el.textContent = message;
        if (className) el.className = className;
        el.classList.remove('hidden');
    }

    function hideElement(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    }

    function setFormAlert(id, message, type) {
        const el = document.getElementById(id);
        if (!el) return;
        const okClass = 'mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700';
        const errClass = 'mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700';
        el.className = type === 'error' ? errClass : okClass;
        el.textContent = message;
        el.classList.remove('hidden');
    }

    window.AdminUI = {
        apiRequest: apiRequest,
        escapeHtml: escapeHtml,
        formatDate: formatDate,
        setElementText: setElementText,
        showElement: showElement,
        hideElement: hideElement,
        setFormAlert: setFormAlert
    };
})();
