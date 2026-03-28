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
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        // Remove Content-Type header for FormData
        if (mergedOptions.body instanceof FormData) {
            delete mergedOptions.headers['Content-Type'];
        }
        
        const response = await fetch(url, mergedOptions);
        let text;
        try {
            text = await response.text();
        } catch (e) {
            throw new Error('Failed to read response body');
        }
        
        let payload;
        try {
            payload = text ? JSON.parse(text) : {};
        } catch (e) {
            const error = new Error(`[Status ${response.status}] Invalid API response: ${text.substring(0, 100)}`);
            error.status = response.status;
            throw error;
        }

        if (!response.ok || payload.success === false) {
            const fallbackMsg = `[Status ${response.status}] Request failed. Raw parsed payload: ${JSON.stringify(payload)}`;
            const error = new Error(payload.message || fallbackMsg);
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

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 shadow-lg transition-opacity ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    window.AdminUI = {
        apiRequest: apiRequest,
        escapeHtml: escapeHtml,
        formatDate: formatDate,
        setElementText: setElementText,
        showElement: showElement,
        hideElement: hideElement,
        setFormAlert: setFormAlert,
        showToast: showToast
    };
})();