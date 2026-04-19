window.C3_PROJECT_DATA_PATH = "data.json";
self.C3_PROJECT_DATA_PATH = "data.json";

(function () {

    };

    function isSwigshotRequest(url) {
        if (!url) return false;
        const str = String(url).toLowerCase();
        return str.includes("swigshot") || str.includes("swigdrinks.com");
    }

    function getOfflinePayload() {

            return chrome.runtime.getURL("data.json");
        }

        return url;
    }

    const OriginalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
        const xhr = new OriginalXHR();
        const open = xhr.open;
        const send = xhr.send;

        xhr.open = function (method, url) {
n
        };

        xhr.send = function () {
            if (this._isSwigshotRequest) {
                const payload = getOfflinePayload();

                setTimeout(() => {
                    Object.defineProperties(this, {
                        status: { value: 200 },
                        readyState: { value: 4 },
                        responseText: { value: payload },
                        response: { value: payload },
                        getAllResponseHeaders: {
                            value: function () {
                                return "Content-Type: application/json\r\n";
                            }
                        }
                    });

                    this.dispatchEvent(new Event("readystatechange"));
                    this.dispatchEvent(new Event("load"));
                    this.dispatchEvent(new Event("loadend"));
                    if (typeof this.onload === "function") this.onload();
                }, 0);

                return;
            }

            return send.apply(this, arguments);
        };

        return xhr;
    };

    const originalFetch = window.fetch;
    window.fetch = async function (resource, init) {
        const url = typeof resource === "string" ? resource : resource?.url;

        if (isSwigshotRequest(url)) {
            return new Response(getOfflinePayload(), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }


})();
