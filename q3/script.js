document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');

    if (registrationForm) { 

        const clearErrors = () => {
            document.querySelectorAll('.error-message').forEach(element => {
                element.textContent = '';
            });
            if (successMessage) { 
                successMessage.style.display = 'none';
                successMessage.textContent = '';
                successMessage.classList.remove('success', 'error'); 
            }
        };

    const displayError = (fieldId, message) => {
        const errorElement = document.getElementById(fieldId + 'Error');
            if (errorElement) { 
                errorElement.textContent = message;}
    };


     const validateForm = () => {
        clearErrors(); 

        let isValid = true;

        const performerName = document.getElementById('performerName');
            if (performerName && performerName.value.trim() === '') {
                displayError('performerName', 'שם מבצע הוא שדה חובה.');
                isValid = false;
            }

        const email = document.getElementById('email');
            if (email && email.value.trim() === '') {
                displayError('email', 'אימייל הוא שדה חובה.');
                isValid = false;
            } else if (email && !/\S+@\S+\.\S+/.test(email.value.trim())) { 
                displayError('email', 'פורמט אימייל לא תקין.');
                isValid = false;
            }


         const wingType = document.getElementById('wingType');
            if (wingType && wingType.value === '') {
                displayError('wingType', 'יש לבחור סוג כנפיים.');
                isValid = false;
            }

            const musicalStyle = document.getElementById('musicalStyle');
            if (musicalStyle && musicalStyle.value.trim() === '') {
                displayError('musicalStyle', 'סגנון מוזיקלי הוא שדה חובה.');
                isValid = false;
            }

            const chosenSong = document.getElementById('chosenSong');
            if (chosenSong && chosenSong.value.trim() === '') {
                displayError('chosenSong', 'שיר נבחר הוא שדה חובה.');
                isValid = false;
            }

         const experience = document.getElementById('experience');
            if (experience) { 
                const experienceValue = experience.value.trim();
                if (experienceValue === '') {
                    displayError('experience', 'ניסיון קודם הוא שדה חובה.');
                    isValid = false;
                } else if (isNaN(experienceValue) || parseInt(experienceValue) < 0) {
                    displayError('experience', 'ניסיון קודם חייב להיות מספר חיובי.');
                    isValid = false;
                }
            }
            
            return isValid;
        };

      registrationForm.addEventListener('submit', (event) => {
            event.preventDefault(); //מונע טעינת דף חדש בעת שליחת טופס

            if (validateForm()) {
                const newRegistration = {
                    id: Date.now(), 
                    performerName: document.getElementById('performerName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    wingType: document.getElementById('wingType').value,
                    musicalStyle: document.getElementById('musicalStyle').value.trim(),
                    chosenSong: document.getElementById('chosenSong').value.trim(),
                    experience: parseInt(document.getElementById('experience').value.trim()),
                    frontAudienceApproved: document.getElementById('frontAudienceApproved').checked
                };
             const allRegistrations = loadRegistrations(); 
                allRegistrations.push(newRegistration); 
                saveRegistrations(allRegistrations); 

                if (successMessage) { 
                    successMessage.innerHTML = `ההרשמה נשלחה בהצלחה ונשמרה! <a href="view.html" class="success-link">לחץ כאן לצפייה בכל הרשומות</a>`;
                    successMessage.style.display = 'block';
                    successMessage.classList.remove('error'); 
                    successMessage.classList.add('success'); 
                }
                
                registrationForm.reset(); //מאפס את כל השדות שבטופס

            } 
            else //אם הטופס לא תקין:
            {
                if (successMessage) { 
                    successMessage.innerHTML = 'אנא תקן את השגיאות בטופס.';
                    successMessage.style.display = 'block';
                    successMessage.classList.remove('success'); 
                    successMessage.classList.add('error'); 
                }
            }
        });
    }



   //סעיף ב:
  const STORAGE_KEY = 'festivalRegistrations'; 

    const loadRegistrations = () => { 
        const data = localStorage.getItem(STORAGE_KEY); //המידע השמור כמחרוזת
        try {
            return data ? JSON.parse(data) : []; //ממחרוזת לאובייקט מערך
        } 
        catch (e) {
            console.error("שגיאה בטעינת נתונים מ-localStorage:", e);
            return [];
        }
     };

    const saveRegistrations = (registrations) => { 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations)); //חזרה למחרוזת
     };

    
    const dataDisplay = document.getElementById('dataDisplay');

    if (dataDisplay) { 

        const renderItems = () => { 
            const registrations = loadRegistrations(); 

            if (registrations.length === 0) {
                dataDisplay.innerHTML = '<p>אין עדיין רשומות שמורות. אנא הירשמו בדף <a href="index.html">ההרשמה</a>.</p>';
                return;
            }

            //בניית טבלה דינאמית שמכילה את כל הרשומות:
            let htmlContent = '<table class="registrations-table"><thead><tr>';
            htmlContent += '<th>שם מבצע</th><th>אימייל</th><th>סוג כנף</th><th>סגנון</th><th>שיר</th><th>ניסיון</th><th>קהל קדמי</th><th>פעולות</th>';
            htmlContent += '</tr></thead><tbody>';

            registrations.forEach(reg => {
                htmlContent += `
                    <tr data-id="${reg.id}">
                        <td>${reg.performerName}</td>
                        <td>${reg.email}</td>
                        <td>${reg.wingType === 'feather' ? 'נוצה' : reg.wingType === 'leather' ? 'עור' : 'אור'}</td>
                        <td>${reg.musicalStyle}</td>
                        <td>${reg.chosenSong}</td>
                        <td>${reg.experience}</td>
                        <td>${reg.frontAudienceApproved ? 'כן' : 'לא'}</td>
                        <td>
                            <button class="delete-btn" data-id="${reg.id}">מחק</button>
                            </td>
                    </tr>
                `;
            });

            htmlContent += '</tbody></table>';
            dataDisplay.innerHTML = htmlContent;

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const idToDelete = parseInt(event.target.dataset.id);
                    deleteItem(idToDelete);
                });
            });
        };

        const deleteItem = (id) => {
            let registrations = loadRegistrations();
            registrations = registrations.filter(reg => reg.id !== id); //שימוש בפילטר כדי ליצור מעאך חדש שמכיל את כל הרשומות חוץ מזו שהתקבלה
            saveRegistrations(registrations);
            renderItems(); 
        };

        const updateItem = (id, changes) => {
            let registrations = loadRegistrations();
            const index = registrations.findIndex(reg => reg.id === id);
            if (index !== -1) {
                registrations[index] = { ...registrations[index], ...changes };
                saveRegistrations(registrations);
                renderItems();
            }
        };

        renderItems();
    }
    

});
