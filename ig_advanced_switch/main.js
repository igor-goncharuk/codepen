// main.js
document.addEventListener('DOMContentLoaded', () => {
    const switches = document.querySelectorAll('compass-switch');

    // Обработчик события change
    switches.forEach(sw => {
        sw.addEventListener('change', (e) => {
            console.log('Switch changed:', e.detail.active);
        });
    });

    // Обработчик клика
    switches.forEach(compassSwitch => {
        compassSwitch.addEventListener('click', () => {
            compassSwitch.active = !compassSwitch.active;
        });
    });
});
