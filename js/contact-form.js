const form = document.querySelector('.contact-form');
const status = document.getElementById('contact-status');

// Keep the assignment form local: validate without sending or storing personal data.
form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Your message is ready. This practice form has not sent it; use the email link above to contact me.';
});

form.addEventListener('input', () => {
    status.textContent = '';
});
