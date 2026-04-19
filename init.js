window.C3_PROJECT_DATA_PATH = "data.json";
self.C3_PROJECT_DATA_PATH = "data.json";

(function () {
    // Keep app startup logic happy by returning a valid "active contest" shape.
    const OFFLINE_CONTEST_RESPONSE = {
        status: "success",
        data: {
            id: "offline-local-contest",
            name: "Offline Contest",
            start_time: "2026-01-01T00:00:00Z",
            end_time: "2035-01-01T00:00:00Z",
            type: "recent"
        }
    };

    function isSwigshotRequest(url) {
        if (!url) return false;

        try {
            const parsed = new URL(String(url), window.location.href);
            const host = parsed.hostname.toLowerCase();

            // Only intercept real remote API hosts.
            // Do NOT intercept local assets like "swigshot.svg".
            return host === "api.swigshot.swigdrinks.com" || host.endsWith(".swigdrinks.com");
        } catch (_err) {
            return false;
        }
    }

    function getOfflinePayload() {
        return JSON.stringify(OFFLINE_CONTEST_RESPONSE);
    }

    function patchDataJsonUrl(url) {
        if (typeof url === "string" && url.includes("data.json") && typeof chrome !== "undefined" && chrome.runtime?.getURL) {
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
            this._isSwigshotRequest = isSwigshotRequest(url);
            return open.apply(this, [method, patchDataJsonUrl(url)]);
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

        return originalFetch.call(this, patchDataJsonUrl(resource), init);
    };
})();
