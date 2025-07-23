document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Functionality for Success Stories ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get the target tab ID from data-tab attribute
            const targetTabId = button.dataset.tab;
            const targetPane = document.getElementById(targetTabId);

            // Add active class to the corresponding tab pane
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Automatically activate the first tab on load if none is active
    if (!document.querySelector('.tab-btn.active') && tabButtons.length > 0) {
        tabButtons[0].click();
    }


    // --- Daily Motivation Quotes ---
    const quotes = [
        "Today is another opportunity to take care of yourself and live fully.",
        "Your strength is not measured by the absence of challenges, but by your ability to overcome them.",
        "Every day is a new chance to grow, heal, and find joy.",
        "Living well with HIV means prioritizing your health and well-being.",
        "You are resilient, capable, and deserving of a full and vibrant life.",
        "Take one step at a time, celebrate small victories, and never give up on yourself."
    ];

    const dailyQuoteElement = document.getElementById('daily-quote');
    const newQuoteButton = document.getElementById('new-quote');

    // Function to display a random quote
    function displayRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        dailyQuoteElement.textContent = quotes[randomIndex];
    }

    // Display an initial random quote when the page loads
    displayRandomQuote();

    // Event listener for the "New Inspiration" button
    newQuoteButton.addEventListener('click', displayRandomQuote);


    // --- New Accessibility Widget Functionality ---
    const accessibilityToggleBtn = document.getElementById('accessibilityToggleBtn');
    const accessibilityOptions = document.getElementById('accessibilityOptions');
    const closeAccessibilityBtn = document.getElementById('closeAccessibility');
    const accessibilityWidget = document.getElementById('accessibilityWidget'); // Parent widget element

    const readPageAloudBtn = document.getElementById('readPageAloudBtn');
    const toggleSignLanguageBtn = document.getElementById('toggleSignLanguageBtn');
    const signLanguageVideoPlayer = document.getElementById('signLanguageVideoPlayer');
    const signLanguageVideo = document.getElementById('signLanguageVideo');
    const closeVideoBtn = document.getElementById('closeVideoBtn');

    let isReading = false; // To track if text-to-speech is active

    if (accessibilityToggleBtn && accessibilityOptions && closeAccessibilityBtn && accessibilityWidget) {
        // Toggle options menu
        accessibilityToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling up to document and closing immediately
            accessibilityOptions.classList.toggle('show');
            // Ensure video player is hidden when options pop up
            if (signLanguageVideoPlayer) {
                signLanguageVideoPlayer.style.display = 'none';
                signLanguageVideo.pause(); // Pause video if open
            }
        });

        // Close options menu
        closeAccessibilityBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling up
            accessibilityOptions.classList.remove('show');
        });

        // Close options if user clicks outside of the widget
        document.addEventListener('click', (event) => {
            if (!accessibilityWidget.contains(event.target) && accessibilityOptions.classList.contains('show')) {
                accessibilityOptions.classList.remove('show');
            }
        });

        // --- Text-to-Speech (Read Page Aloud) ---
        if (readPageAloudBtn && 'speechSynthesis' in window) {
            let utterance = null;

            readPageAloudBtn.addEventListener('click', () => {
                if (isReading) {
                    // If already reading, stop
                    speechSynthesis.cancel();
                    isReading = false;
                    readPageAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Page Aloud';
                } else {
                    // Start reading
                    let pageText = '';
                    // Collect text from main sections (adjust selectors as needed for other pages)
                    document.querySelectorAll('section, h1, h2, h3, p, li').forEach(element => {
                        // Exclude script, style, and widget content itself
                        if (!element.closest('.accessibility-widget') && !element.matches('script, style')) {
                            pageText += element.innerText + '.\n';
                        }
                    });

                    if (pageText.trim().length > 0) {
                        utterance = new SpeechSynthesisUtterance(pageText);
                        // Optional: Set voice, pitch, rate
                        // utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google US English'); // Example
                        utterance.pitch = 1; // 0 to 2
                        utterance.rate = 1;  // 0.1 to 10

                        utterance.onend = () => {
                            isReading = false;
                            readPageAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Page Aloud';
                        };

                        utterance.onerror = (event) => {
                            console.error('SpeechSynthesisUtterance.onerror', event);
                            isReading = false;
                            readPageAloudBtn.innerHTML = '<i class="fas fa-volume-up"></i> Read Page Aloud';
                            alert('Text-to-speech failed or was interrupted.');
                        };

                        speechSynthesis.speak(utterance);
                        isReading = true;
                        readPageAloudBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Stop Reading';
                    } else {
                        alert('No text found on this page to read.');
                    }
                }
                accessibilityOptions.classList.remove('show'); // Close options after clicking
            });

            // Stop reading if the user navigates away or closes tab
            window.addEventListener('beforeunload', () => {
                if (isReading) {
                    speechSynthesis.cancel();
                }
            });

        } else if (readPageAloudBtn) {
            // Disable button if Web Speech API is not supported
            readPageAloudBtn.disabled = true;
            readPageAloudBtn.textContent = 'Read Page Aloud (Not Supported)';
            readPageAloudBtn.style.backgroundColor = '#999';
            readPageAloudBtn.style.cursor = 'not-allowed';
            readPageAloudBtn.title = 'Your browser does not support text-to-speech.';
        }


        // --- Sign Language Video Player ---
        if (toggleSignLanguageBtn && signLanguageVideoPlayer && signLanguageVideo && closeVideoBtn) {
            toggleSignLanguageBtn.addEventListener('click', () => {
                if (signLanguageVideoPlayer.style.display === 'flex') {
                    // If video player is open, close it
                    signLanguageVideoPlayer.style.display = 'none';
                    signLanguageVideo.pause(); // Pause video
                } else {
                    // If video player is closed, open it and play
                    signLanguageVideoPlayer.style.display = 'flex';
                    signLanguageVideo.play();
                }
                accessibilityOptions.classList.remove('show'); // Close options after clicking
            });

            closeVideoBtn.addEventListener('click', () => {
                signLanguageVideoPlayer.style.display = 'none';
                signLanguageVideo.pause(); // Pause video
            });
        }
    }
});