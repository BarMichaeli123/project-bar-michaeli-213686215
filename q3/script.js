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
                errorElement.textContent = message;
            }
        };


        const validateForm = () => {
            clearErrors();
            let isValid = true;

            const performerName = document.getElementById('performerName');
            if (performerName && performerName.value.trim() === '') {
                displayError('performerName', 'שם המבצע הוא שדה חובה.');
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
            if (validateForm()) { //אם הטופס שמולא תקין:
                const newRegistration = {
                    id: Date.now(),
                    performerName: document.getElementById('performerName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    wingType: document.getElementById('wingType').value,
                    musicalStyle: document.getElementById('musicalStyle').value.trim(),
                    chosenSong: document.getElementById('chosenSong').value.trim(),
                    experience: parseInt(document.getElementById('experience').value.trim()),
                    frontAudienceApproved: document.getElementById('frontAudienceApproved').checked,
                    status: 'pending'
                };

                const allRegistrations = loadRegistrations(); 
                allRegistrations.push(newRegistration); 
                saveRegistrations(allRegistrations); //עבור סעיף ב

                if (successMessage) {
                    
                    successMessage.innerHTML = `ההרשמה נשלחה בהצלחה ונשמרה! <a href="view.html" class="success-link">לחץ כאן לצפייה בכל הרשומות</a>`;
                    successMessage.style.display = 'block';
                    successMessage.classList.remove('error');
                    successMessage.classList.add('success');
                }

                registrationForm.reset(); //מאפס את כל השדות שבטופס

            } else //אם הטופס לא תקין:
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
            const loadedData = data ? JSON.parse(data) : []; //ממחרוזת לאובייקט מערך
            return loadedData.map(reg => ({
                ...reg, status: reg.status || 'pending' // וידוא שלכל רשומה שנטענה יש סטטוס
            }));
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
    const wingTypeFilter = document.getElementById('wingTypeFilter'); // האלמנט הסינון


    if (dataDisplay) {
        const updateItem = (id, changes) => {
            let registrations = loadRegistrations();
            const index = registrations.findIndex(reg => reg.id === id);
            if (index !== -1) { //אם הרשומה נמצאה:
                registrations[index] = { ...registrations[index], ...changes }; //חידוש הרשומה
                saveRegistrations(registrations);
            }
        };

        const deleteItem = (id) => {
            let registrations = loadRegistrations();
            registrations = registrations.filter(reg => reg.id !== id); //שימוש בפילטר כדי ליצור מעאך חדש שמכיל את כל הרשומות חוץ מזו שהתקבלה
            saveRegistrations(registrations);
            filterTable(); // קריאה לפילטר כדי לרענן את התצוגה אחרי מחיקה
        };

        const renderItems = (itemsToRender = null) => {
            const registrations = itemsToRender || loadRegistrations();

            if (registrations.length === 0) {
                dataDisplay.innerHTML = '<p>אין עדיין רשומות שמורות. אנא הירשמו בדף <a href="index.html">ההרשמה</a>.</p>';
                return;
            }

            //בניית טבלה דינאמית שמכילה את כל הרשומות:
            let htmlContent = '<table class="registrations-table"><thead><tr>';
            htmlContent += '<th>שם מבצע</th><th>אימייל</th><th>סוג כנף</th><th>סגנון</th><th>שיר</th><th>ניסיון</th><th>אושר ע"י נשר מוסמך</th><th>סטטוס</th><th>פעולות</th>';
            htmlContent += '</tr></thead><tbody>';

            registrations.forEach(reg => {
                htmlContent += `
                    <tr data-id="${reg.id}">
                        <td data-label="שם מבצע">${reg.performerName}</td>
                        <td data-label="אימייל">${reg.email}</td>
                        <td data-label="סוג כנף">${reg.wingType === 'feather' ? 'נוצה' : reg.wingType === 'leather' ? 'עור' : 'אור'}</td>
                        <td data-label="סגנון מוזיקלי">${reg.musicalStyle}</td>
                        <td data-label="שיר נבחר">${reg.chosenSong}</td>
                        <td data-label="ניסיון">${reg.experience}</td>
                        <td data-label="אושר ע"י נשר מוסמך">${reg.frontAudienceApproved ? 'כן' : 'לא'}</td>
                        <td data-label="סטטוס">
                            <span class="current-status status-${reg.status}">
                                ${reg.status === 'pending' ? 'ממתין' : reg.status === 'approved' ? 'אושר' : 'נדחה'}
                            </span>
                        </td>
                        <td data-label="פעולות">
                            <button class="delete-btn" data-id="${reg.id}">מחק</button>
                            <button class="update-status-toggle-btn" data-id="${reg.id}" data-current-status="${reg.status}">
                                עדכן סטטוס
                            </button>
                            <span class="action-message"></span>
                        </td>
                    </tr>
                `;
            });

            htmlContent += '</tbody></table>';
            dataDisplay.innerHTML = htmlContent;

       
            dataDisplay.addEventListener('click', (event) => {
                const target = event.target; //מצביע על האלמנט הספציפי שלחצו עליו
                const row = target.closest('tr');
                if (!row) return;

                const id = parseInt(row.dataset.id);
                const deleteButton = row.querySelector('.delete-btn');
                const updateButton = row.querySelector('.update-status-toggle-btn'); // הכפתור המקורי
                const actionMessage = row.querySelector('.action-message');

                // אם נלחץ כפתור מחיקה
                if (target.classList.contains('delete-btn')) {
                    deleteItem(id);
                    event.stopPropagation(); // מונע מהאירוע להפעיל מאזינים נוספים
                }
                // אם נלחץ כפתור "עדכן סטטוס"
                else if (target.classList.contains('update-status-toggle-btn')) {
                    const currentStatus = target.dataset.currentStatus;

                    deleteButton.classList.add('hidden');
                    updateButton.classList.add('hidden'); // הסתר את הכפתור המקורי

                    // יצירת אלמנט <select> חדש
                    const statusSelect = document.createElement('select');
                    statusSelect.className = 'status-selector';
                    statusSelect.dataset.id = id;

                    const options = [
                        { value: '', text: 'בחר סטטוס' },
                        { value: 'pending', text: 'ממתין' },
                        { value: 'approved', text: 'אושר' },
                        { value: 'rejected', text: 'נדחה' }
                    ];

                    options.forEach(optionData => {
                        const option = document.createElement('option');
                        option.value = optionData.value;
                        option.textContent = optionData.text;
                        statusSelect.appendChild(option);
                    });

                    statusSelect.value = currentStatus;
                    updateButton.parentNode.insertBefore(statusSelect, updateButton.nextSibling); // הכנס את הסלקט אחרי הכפתור המקורי
                    statusSelect.focus();

                    actionMessage.textContent = '';
                    actionMessage.style.color = '';

                    event.stopPropagation();
                }
            });

            dataDisplay.addEventListener('change', (event) => {
                const target = event.target;
                if (target.classList.contains('status-selector')) {
                    const row = target.closest('tr');
                    const idToUpdate = parseInt(target.dataset.id);
                    const selectedValue = target.value;
                    const messageElement = row.querySelector('.action-message');
                    const deleteButton = row.querySelector('.delete-btn');
                    const updateButton = row.querySelector('.update-status-toggle-btn'); // קבל את הכפתור המקורי

                    if (selectedValue === '') {
                        messageElement.textContent = 'יש לבחור סטטוס חוקי.';
                        messageElement.style.color = 'red';
                        // חוזר למצב כפתור אם נבחר ערך ריק
                        setTimeout(() => {
                            messageElement.textContent = '';
                            messageElement.style.color = '';
                            target.remove(); // הסר את הסלקט
                            updateButton.classList.remove('hidden'); // הצג את הכפתור המקורי
                            deleteButton.classList.remove('hidden'); // הצג את כפתור המחיקה
                        }, 1500);
                        return;
                    }

                    updateItem(idToUpdate, { status: selectedValue }); //קיר=אה לפונקציית העדכון
                    messageElement.textContent = 'הסטטוס עודכן בהצלחה!';
                    messageElement.style.color = 'green';

                    
                    const currentStatusSpan = row.querySelector('.current-status');
                    if (currentStatusSpan) {
                        currentStatusSpan.className = `current-status status-${selectedValue}`;
                        currentStatusSpan.textContent = selectedValue === 'pending' ? 'ממתין' : selectedValue === 'approved' ? 'אושר' : 'נדחה';
                        updateButton.dataset.currentStatus = selectedValue;
                    }

    
                    setTimeout(() => {
                        messageElement.textContent = '';
                        messageElement.style.color = '';
                        target.remove(); // הסר את הסלקט
                        updateButton.classList.remove('hidden'); // הצג את הכפתור העדכון
                        deleteButton.classList.remove('hidden'); // הצג את כפתור המחיקה
                    }, 1500);
                }
            });

            dataDisplay.addEventListener('blur', (event) => {
                const target = event.target;
                
                if (target.classList.contains('status-selector') && target.parentNode && target.parentNode.contains(target)) {
                    const row = target.closest('tr');
                    const deleteButton = row.querySelector('.delete-btn');
                    const updateButton = row.querySelector('.update-status-toggle-btn'); // קבל את הכפתור המקורי
                    const actionMessage = row.querySelector('.action-message');
                    const currentStatusFromSpan = row.querySelector('.current-status').className.replace('current-status status-', '');

                   
                    if (target.value === currentStatusFromSpan || (event.relatedTarget && !target.contains(event.relatedTarget))) {
                        target.remove(); 
                        updateButton.classList.remove('hidden'); 
                        deleteButton.classList.remove('hidden'); 
                        actionMessage.textContent = ''; 
                        actionMessage.style.color = '';
                    }
                }
            }, true); 

            //מאזין ללחיצות מקשים
            dataDisplay.addEventListener('keydown', (event) => {
                const target = event.target;
                if (event.key === 'Escape' && target.classList.contains('status-selector')) {
                    target.blur(); 
                }
            });
        }; 



        function filterTable() {
            const filterValue = document.getElementById('wingTypeFilter') ? document.getElementById('wingTypeFilter').value : 'all'; // קבלת אלמנט הסינון
            let items = loadRegistrations();

            let filteredItems = [];
            if (filterValue === 'all') {
                filteredItems = items; // אם נבחר "הכל", כל הפריטים יוצגו
            } else {
                filteredItems = items.filter(item => item.wingType === filterValue);
            }

            renderItems(filteredItems);
        }

        renderItems();

        if (wingTypeFilter) { //בדיקה אם אלמנט הסינון קיים בעמוד
            wingTypeFilter.addEventListener('change', filterTable);
        }

    } 
});