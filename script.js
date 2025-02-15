document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlistForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // Here we'll use Google Forms as a simple backend
        // Replace this URL with your actual Google Form submission URL
        const googleFormUrl = 'YOUR_GOOGLE_FORM_SUBMISSION_URL';

        try {
            // In a real implementation, you would send the data to your backend
            // For now, we'll just show the confirmation message
            form.style.display = 'none';
            confirmationMessage.classList.remove('hidden');
            
            // Optional: Actually submit to Google Forms
            // await fetch(googleFormUrl, {
            //     method: 'POST',
            //     mode: 'no-cors',
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //     },
            //     body: new URLSearchParams({
            //         'entry.XXXXX': name,  // Replace XXXXX with your form field IDs
            //         'entry.YYYYY': email,
            //     })
            // });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting the form. Please try again.');
        }
    });
}); 