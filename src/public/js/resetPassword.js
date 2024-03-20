
document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('reset-password-form');
    const token = window.location.pathname.split('/').pop();

    resetPasswordForm.action = `/api/sessions/reset-password/${token}`;
    

    resetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        
        const formData = {
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };


        try {
            const response = await fetch(resetPasswordForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });


            if (response.ok) {
                const successMessage = document.getElementById('reset-password-success-message');
                successMessage.textContent = 'Contraseña restablecida con éxito. Serás redirigido al inicio de sesión en unos segundos.';
                successMessage.style.display = 'block';

                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 5000); 
            } else {
                const errorData = await response.json();
                if (errorData.error === "SamePasswordError") {
                    alert(errorData.message);
                } else {
                    alert("Ocurrió un error al restablecer la contraseña. Por favor, inténtalo de nuevo.")
                }
            } 
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            alert('Ocurrió un error al restablecer la contraseña. Por favor, inténtalo de nuevo más tarde.');
        }
    });
}); 


