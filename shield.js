(function() {
    const OriginalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new OriginalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        xhr.open = function(method, url) {
            this._url = url;
            this._isLeaderboard = url && url.includes('swigshot');
            return originalOpen.apply(this, arguments);
        };

        xhr.send = function() {
            if (this._isLeaderboard) {
                console.log("SHIELD: Mirroring Jazz vs Wizards Data...");
                setTimeout(() => {
                    // EXACT MIRROR of the data you found
                    const fakeData = JSON.stringify({
                        "status": "success",
                        "data": {
                            "id": "ed48931a-e6fb-4980-91a4-b39986eb6511",
                            "name": "Washington @ Utah Jazz",
                            "start_time": "2026-03-26T01:00:00Z",
                            "end_time": "2026-03-27T03:30:00Z", // Extended to ensure it stays "active"
                            "type": "recent"
                        }
                    });

                    Object.defineProperties(this, {
                        'status': { value: 200 },
                        'readyState': { value: 4 },
                        'responseText': { value: fakeData },
                        'response': { value: fakeData },
                        'getAllResponseHeaders': { 
                            value: function() { return "Content-Type: application/json\r\n"; } 
                        }
                    });

                    this.dispatchEvent(new Event('readystatechange'));
                    this.dispatchEvent(new Event('load'));
                    this.dispatchEvent(new Event('loadend'));
                    if (this.onload) this.onload();
                }, 10);
                return;
            }
            return originalSend.apply(this, arguments);
        };
        return xhr;
    };
})();