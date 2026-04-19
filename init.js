window.C3_PROJECT_DATA_PATH = "data.json";
self.C3_PROJECT_DATA_PATH = "data.json";

(function() {
    const OriginalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();
        const open = xhr.open;
        xhr.open = function(method, url) {
            let finalUrl = url;
            if (url.includes('data.json')) {
                finalUrl = chrome.runtime.getURL("data.json");
            }
            return open.apply(this, [method, finalUrl]);
        };
        return xhr;
    };

    window.addEventListener('DOMContentLoaded', () => {
        const ov = document.getElementById('overlay');
        if (ov) {
            ov.onclick = () => {
                ov.style.display = 'none';
                window.dispatchEvent(new Event('resize'));
            };
        }
    });
})();