document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');

     const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(element => {
            element.textContent = '';
        });
        successMessage.style.display = 'none';
        successMessage.textContent = '';
    };

    const displayError = (fieldId, message) => {
        document.getElementById(fieldId + 'Error').textContent = message;
    };


     const validateForm = () => {
        clearErrors(); 

        let isValid = true;

        const performerName = document.getElementById('performerName').value.trim();
        if (performerName === '') {
            displayError('performerName', 'שם מבצע הוא שדה חובה.');
            isValid = false;
        }

        const email = document.getElementById('email').value.trim();
        if (email === '') {
            displayError('email', 'אימייל הוא שדה חובה.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) { 
            displayError('email', 'פורמט אימייל לא תקין.');
            isValid = false;
        }

         const wingType = document.getElementById('wingType').value;
        if (wingType === '') {
            displayError('wingType', 'יש לבחור סוג כנפיים.');
            isValid = false;
        }

         const musicalStyle = document.getElementById('musicalStyle').value.trim();
        if (musicalStyle === '') {
            displayError('musicalStyle', 'סגנון מוזיקלי הוא שדה חובה.');
            isValid = false;
        }

         const chosenSong = document.getElementById('chosenSong').value.trim();
        if (chosenSong === '') {
            displayError('chosenSong', 'שיר נבחר הוא שדה חובה.');
            isValid = false;
        }

        const experience = document.getElementById('experience').value.trim();
        if (experience === '') {
            displayError('experience', 'ניסיון קודם הוא שדה חובה.');
            isValid = false;
        } else if (isNaN(experience) || parseInt(experience) < 0) {
            displayError('experience', 'ניסיון קודם חייב להיות מספר חיובי.');
            isValid = false;
        }

        return isValid;
    };

     registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); ///////

        if (validateForm()) {
            successMessage.textContent = 'ההרשמה נשלחה בהצלחה!';
            successMessage.style.display = 'block';
            registrationForm.reset(); 
        } else {
            successMessage.style.display = 'none';
        }
    });
});