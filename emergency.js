window.addEventListener("error", function(e) {
    if (e.message && e.message.includes("c3main")) {
        console.warn("Redirecting loader...");
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('click-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            this.style.display = 'none';
            console.log("User interacted, game resuming...");
        });
    }
});