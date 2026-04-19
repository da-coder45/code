(function() {
    console.log("PATCH: System Online.");

    // 1. LEADEREBOARD SPOOF (The Jazz Data)
    var OriginalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        var xhr = new OriginalXHR();
        var originalOpen = xhr.open;
        var originalSend = xhr.send;
        xhr.open = function(method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };
        xhr.send = function() {
            if (this._url && this._url.includes('swigshot')) {
                var self = this;
                setTimeout(function() {
                    var jazzData = JSON.stringify({
                        "status": "success",
                        "data": {
                            "id": "ed48931a-e6fb-4980-91a4-b39986eb6511",
                            "name": "Washington @ Utah Jazz",
                            "start_time": "2026-03-26T01:00:00Z",
                            "end_time": "2026-03-27T03:30:00Z",
                            "type": "recent"
                        }
                    });
                    Object.defineProperties(self, {
                        'status': { value: 200 },
                        'readyState': { value: 4 },
                        'responseText': { value: jazzData },
                        'response': { value: jazzData }
                    });
                    self.dispatchEvent(new Event('load'));
                }, 10);
                return;
            }
            return originalSend.apply(this, arguments);
        };
        return xhr;
    };

    // 2. CLICK HANDLER (Replaces the inline onclick)
    window.addEventListener('DOMContentLoaded', function() {
        var ov = document.getElementById('click-overlay');
        if (ov) {
            ov.addEventListener('mousedown', function() {
                ov.style.display = 'none';
                console.log("PATCH: Overlay Hidden, waking engine...");
                window.focus();
                window.dispatchEvent(new Event('resize'));
            });
        }
    });
})();