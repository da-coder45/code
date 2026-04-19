window.C3_PROJECT_DATA_PATH = "data.json";
self.C3_PROJECT_DATA_PATH = "data.json";

(function () {
    // School-safe mode: never contact remote SwigShot services.
    const DISABLE_LEADERBOARD = true;

    const OFFLINE_CONTEST_RESPONSE = {
        status: "disabled",
        message: "Leaderboard is disabled in this offline extension build.",
        data: null
    };

    function isSwigshotRequest(url) {
        if (!url) return false;
        const str = String(url).toLowerCase();
        return str.includes("swigshot") || str.includes("swigdrinks.com");
    }

    function getOfflinePayload() {
        if (DISABLE_LEADERBOARD) {
            return JSON.stringify(OFFLINE_CONTEST_RESPONSE);
        }

        return JSON.stringify({
            status: "success",
            data: {
                id: "offline-local-contest",
                name: "Offline Contest",
                start_time: "2026-01-01T00:00:00Z",
                end_time: "2030-01-01T00:00:00Z",
                type: "recent"
            }
        });
    }

    function maybePatchLocalDataUrl(url) {
        if (typeof url === "string" && url.includes("data.json")) {
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
            this._originalUrl = url;
            this._isSwigshotRequest = isSwigshotRequest(url);
            return open.apply(this, [method, maybePatchLocalDataUrl(url)]);
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

        return originalFetch.call(this, maybePatchLocalDataUrl(resource), init);
    };

    window.addEventListener("DOMContentLoaded", () => {
        const ov = document.getElementById("overlay");
        if (!ov) return;

        ov.onclick = () => {
            ov.style.display = "none";
            window.dispatchEvent(new Event("resize"));
        };
    });
})();
