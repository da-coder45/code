console.log("INTERACTION SCRIPT LOADED");

window.addEventListener('mousedown', function() {
    const overlay = document.getElementById('click-overlay');
    if (overlay) overlay.style.display = 'none';

    // Force focus so the engine catches the click
    window.focus();
    
    // Trigger a resize to force the canvas to draw
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);

    console.log("BOOM: Engine poked. Order should be fixed now.");
}, { once: true });