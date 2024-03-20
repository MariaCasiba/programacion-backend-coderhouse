document.addEventListener('DOMContentLoaded', () => {
    const btnRestorePassword = document.getElementById('btnRestorePassword');

    btnRestorePassword.addEventListener('click', async () => {
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('api/sessions/restore-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(data.message); 
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            const restoreErrorMessage = document.getElementById('restoreErrorMessage');
            restoreErrorMessage.textContent = error.message;
            restoreErrorMessage.style.display = 'block';
        }
    });
});

