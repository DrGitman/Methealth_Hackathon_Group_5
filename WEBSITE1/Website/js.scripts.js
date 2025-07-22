document.addEventListener('DOMContentLoaded', function () {
    // Find Testing Center Button
    const findTestingBtn = document.getElementById('find-testing');
    if (findTestingBtn) {
        findTestingBtn.addEventListener('click', function () {
            alert('Redirecting to testing center locator...\nThis would connect to a testing center API in a production site.');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    const header = document.querySelector('header .container');
    if (header) {
        header.prepend(mobileMenuToggle);

        mobileMenuToggle.addEventListener('click', function () {
            const nav = document.querySelector('nav');
            if (nav) nav.classList.toggle('active');
        });
    }

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });

    // Open first FAQ item
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const targetPane = document.getElementById(tabId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // Daily motivation quote generator
    const dailyQuotes = [
        "Your diagnosis doesn't define your future - you do.",
        "Today's treatment options mean HIV doesn't have to limit your dreams.",
        "You are stronger than you think, and more resilient than you know.",
        "Living with HIV is just one part of your story, not the whole book.",
        "Every day you take your meds is a victory worth celebrating.",
        "Your journey can inspire others - your story matters.",
        "HIV may be part of your life, but it doesn't control your life.",
        "With proper care, you can live a long, healthy, and fulfilling life.",
        "You're not alone - millions are thriving with HIV worldwide.",
        "Today is another opportunity to love yourself and care for your health."
    ];
    const dailyQuoteElement = document.getElementById('daily-quote');
    const newQuoteBtn = document.getElementById('new-quote');
    if (dailyQuoteElement && newQuoteBtn) {
        const showQuote = () => {
            const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
            dailyQuoteElement.textContent = `"${dailyQuotes[randomIndex]}"`;
        };
        newQuoteBtn.addEventListener('click', showQuote);
        showQuote(); // initial quote
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const allQuizQuestions = [
        {
            question: "What does U=U stand for in HIV treatment?",
            answers: [
                "Undetectable equals Unhealthy",
                "Untested equals Unknown",
                "Undetectable equals Untransmittable",
                "Unprotected equals Unsafe"
            ],
            correctAnswer: 2,
            explanation: "U=U means that when a person with HIV takes antiretroviral therapy (ART) as prescribed and maintains an undetectable viral load, they cannot sexually transmit HIV to others."
        },
        {
            question: "How effective is PrEP at preventing HIV when taken as prescribed?",
            answers: [
                "About 50% effective",
                "About 75% effective",
                "About 90% effective",
                "Over 99% effective"
            ],
            correctAnswer: 3,
            explanation: "When taken consistently, PrEP is highly effective at preventing HIV, reducing the risk of getting HIV from sex by about 99%."
        },
        {
            question: "How soon after potential HIV exposure should PEP be started?",
            answers: [
                "Within 6 hours",
                "Within 72 hours",
                "Within 1 week",
                "Within 1 month"
            ],
            correctAnswer: 1,
            explanation: "PEP (post-exposure prophylaxis) must be started within 72 hours (3 days) after a possible exposure to HIV, and the sooner the better."
        },
        {
            question: "Which of these activities CANNOT transmit HIV?",
            answers: [
                "Sharing needles",
                "Unprotected sex",
                "Kissing",
                "From mother to baby during childbirth"
            ],
            correctAnswer: 2,
            explanation: "HIV cannot be transmitted through kissing, hugging, or casual contact. It is not spread through saliva, tears, or sweat."
        },
        {
            question: "How often should someone with HIV have their viral load tested?",
            answers: [
                "Every month",
                "Every 3-6 months",
                "Once a year",
                "Only when they feel sick"
            ],
            correctAnswer: 1,
            explanation: "People with HIV should typically have their viral load tested every 3-6 months to ensure their treatment is working effectively."
        },
        {
            question: "What is the most effective way to prevent HIV transmission during sex?",
            answers: [
                "Pulling out before ejaculation",
                "Using condoms consistently and correctly",
                "Only having sex with people who look healthy",
                "Douching before and after sex"
            ],
            correctAnswer: 1,
            explanation: "Consistent and correct use of condoms is highly effective at preventing HIV transmission during sexual activity."
        },
        {
            question: "Which of these is NOT a common way HIV is transmitted?",
            answers: [
                "Sharing needles or syringes",
                "From mother to baby during breastfeeding",
                "Through mosquito bites",
                "Unprotected anal or vaginal sex"
            ],
            correctAnswer: 2,
            explanation: "HIV cannot be transmitted by mosquitoes or other insects. The virus does not survive and cannot reproduce in insects."
        },
        {
            question: "What should a discordant couple (one positive, one negative) do to prevent transmission?",
            answers: [
                "The positive partner should maintain an undetectable viral load",
                "The negative partner should consider taking PrEP",
                "Use condoms consistently",
                "All of the above"
            ],
            correctAnswer: 3,
            explanation: "All of these strategies together provide the best protection for discordant couples. This combination approach is sometimes called 'combination prevention'."
        },
        {
            question: "How long does it typically take for ART to make someone's viral load undetectable?",
            answers: [
                "1-2 days",
                "1-2 weeks",
                "1-6 months",
                "1-2 years"
            ],
            correctAnswer: 2,
            explanation: "Most people who start taking ART daily as prescribed achieve an undetectable viral load within 1 to 6 months."
        },
        {
            question: "Can people with HIV have healthy, HIV-negative children?",
            answers: [
                "No, the baby will always have HIV",
                "Yes, but only through adoption",
                "Yes, with proper medical care and treatment",
                "Only if the mother is HIV-negative"
            ],
            correctAnswer: 2,
            explanation: "With proper medical care, including ART during pregnancy and delivery, the risk of mother-to-child transmission can be reduced to less than 1%."
        },
        // Additional 20 questions
        {
            question: "What is the window period for HIV tests?",
            answers: [
                "1-2 days after exposure",
                "1-2 weeks after exposure",
                "2-6 weeks after exposure (depending on test type)",
                "6 months after exposure"
            ],
            correctAnswer: 2,
            explanation: "The window period varies by test type. Most rapid tests detect HIV 2-6 weeks after exposure, while nucleic acid tests can detect it earlier."
        },
        {
            question: "Which population is most affected by HIV globally?",
            answers: [
                "Heterosexual women in sub-Saharan Africa",
                "Men who have sex with men worldwide",
                "People who inject drugs",
                "All populations are equally affected"
            ],
            correctAnswer: 0,
            explanation: "While HIV affects all populations, heterosexual women in sub-Saharan Africa bear the highest burden globally, representing about 60% of new infections in the region."
        },
        {
            question: "What does a CD4 count measure?",
            answers: [
                "Viral load in the blood",
                "White blood cells that fight infection",
                "Red blood cell production",
                "Liver function"
            ],
            correctAnswer: 1,
            explanation: "CD4 cells are a type of white blood cell that HIV attacks. The CD4 count measures how many of these immune cells are present in a blood sample."
        },
        {
            question: "Which is NOT a common early symptom of HIV infection?",
            answers: [
                "Fever",
                "Rash",
                "Sore throat",
                "Bone fractures"
            ],
            correctAnswer: 3,
            explanation: "About 2-4 weeks after infection, many people experience flu-like symptoms (fever, rash, sore throat), but bone fractures are not associated with acute HIV infection."
        },
        {
            question: "What is the main goal of HIV treatment?",
            answers: [
                "Complete cure of HIV",
                "Making viral load undetectable",
                "Boosting CD4 count only",
                "Eliminating all symptoms"
            ],
            correctAnswer: 1,
            explanation: "While there's no cure yet, the main goal of treatment is to achieve and maintain an undetectable viral load, which preserves health and prevents transmission."
        },
        {
            question: "Which of these is NOT a mode of HIV transmission?",
            answers: [
                "Sharing toothbrushes",
                "Unprotected sex",
                "Pregnancy/childbirth",
                "Sharing needles"
            ],
            correctAnswer: 0,
            explanation: "HIV cannot be transmitted through sharing toothbrushes or other casual contact. The virus doesn't survive long outside the body."
        },
        {
            question: "What is the most common way HIV is transmitted in the US?",
            answers: [
                "Male-to-male sexual contact",
                "Heterosexual contact",
                "Sharing needles",
                "Blood transfusions"
            ],
            correctAnswer: 0,
            explanation: "In the US, male-to-male sexual contact accounts for about 70% of new HIV infections, followed by heterosexual contact and injection drug use."
        },
        {
            question: "Which statement about HIV and aging is TRUE?",
            answers: [
                "People with HIV don't live long enough to age",
                "HIV accelerates aging by about 5-10 years",
                "Aging doesn't affect people with HIV differently",
                "HIV medications prevent all aging effects"
            ],
            correctAnswer: 1,
            explanation: "With treatment, people with HIV live long lives but may experience age-related conditions 5-10 years earlier due to chronic immune activation."
        },
        {
            question: "What is the best way to prevent mother-to-child HIV transmission?",
            answers: [
                "C-section delivery only",
                "Formula feeding only",
                "ART for mother during pregnancy/delivery",
                "All of the above combined"
            ],
            correctAnswer: 3,
            explanation: "The most effective prevention combines ART for the mother, proper delivery management, and formula feeding, reducing transmission risk to <1%."
        },
        {
            question: "Which of these is NOT an HIV prevention method?",
            answers: [
                "Condoms",
                "PrEP",
                "PEP",
                "Antibiotics"
            ],
            correctAnswer: 3,
            explanation: "While condoms, PrEP (pre-exposure), and PEP (post-exposure) prevent HIV, antibiotics treat bacterial infections and have no effect on HIV."
        },
        {
            question: "What percentage of people with HIV know their status globally?",
            answers: [
                "25%",
                "50%",
                "75%",
                "85%"
            ],
            correctAnswer: 3,
            explanation: "About 85% of people with HIV globally know their status, meaning 15% remain undiagnosed and unaware they need treatment."
        },
        {
            question: "Which organ is most affected by untreated HIV?",
            answers: [
                "Liver",
                "Heart",
                "Immune system",
                "Kidneys"
            ],
            correctAnswer: 2,
            explanation: "HIV primarily attacks the immune system, specifically CD4 cells, weakening the body's ability to fight infections and certain cancers."
        },
        {
            question: "What is the biggest barrier to ending the HIV epidemic?",
            answers: [
                "Lack of effective treatments",
                "Stigma and discrimination",
                "No effective prevention methods",
                "HIV vaccines don't exist"
            ],
            correctAnswer: 1,
            explanation: "While we have effective treatments and prevention, stigma remains the biggest barrier as it prevents people from getting tested and treated."
        },
        {
            question: "How does HIV treatment help prevent new infections?",
            answers: [
                "It cures HIV so people can't transmit it",
                "It reduces viral load making transmission unlikely",
                "It provides immunity to partners",
                "It only helps prevent infections in newborns"
            ],
            correctAnswer: 1,
            explanation: "Treatment reduces viral load to undetectable levels, making sexual transmission effectively impossible (U=U)."
        },
        {
            question: "Which demographic has seen rising HIV rates recently?",
            answers: [
                "Young women of color",
                "Adolescent girls and young women in Africa",
                "People over 50",
                "All of the above"
            ],
            correctAnswer: 3,
            explanation: "All these groups have seen concerning rises in HIV rates due to various factors including lack of prevention services and late diagnoses."
        },
        {
            question: "What's the most common route of HIV transmission in children?",
            answers: [
                "Breastfeeding",
                "Casual contact with infected children",
                "Mother-to-child during pregnancy/delivery",
                "Blood transfusions"
            ],
            correctAnswer: 2,
            explanation: "Without intervention, mother-to-child transmission during pregnancy/delivery is most common, though breastfeeding also poses risk."
        },
        {
            question: "Which statement about HIV and COVID-19 is TRUE?",
            answers: [
                "People with HIV can't get COVID-19",
                "HIV increases COVID-19 mortality 3-fold",
                "Well-managed HIV doesn't increase COVID-19 risk",
                "COVID vaccines don't work for people with HIV"
            ],
            correctAnswer: 2,
            explanation: "People with well-managed HIV (on treatment, undetectable) have similar COVID-19 outcomes as the general population."
        },
        {
            question: "What's the main benefit of starting HIV treatment early?",
            answers: [
                "It cures HIV faster",
                "It prevents damage to the immune system",
                "It reduces treatment costs",
                "It eliminates all symptoms immediately"
            ],
            correctAnswer: 1,
            explanation: "Early treatment preserves immune function and leads to better long-term health outcomes, though it doesn't cure HIV."
        },
        {
            question: "Which of these is NOT an HIV-related stigma?",
            answers: [
                "Assuming all gay men have HIV",
                "Thinking HIV only affects certain groups",
                "Believing U=U (undetectable=untransmittable)",
                "Avoiding physical contact with someone because they have HIV"
            ],
            correctAnswer: 2,
            explanation: "U=U is a scientifically proven concept, not a stigma. The other options represent common HIV-related stigmas and misconceptions."
        },
        {
            question: "What percentage of new HIV infections come from people who don't know their status?",
            answers: [
                "10%",
                "30%",
                "50%",
                "70%"
            ],
            correctAnswer: 1,
            explanation: "About 30-40% of new infections come from people unaware they have HIV, highlighting the importance of regular testing."
        }
    ];

    // Quiz variables
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];
    let quizQuestions = [];

    // DOM elements
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestionsContainer = document.getElementById('quiz-questions');
    const questionContainer = document.getElementById('question-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const nextQuestionBtn = document.getElementById('next-question');
    const quizResults = document.getElementById('quiz-results');
    const scoreElement = document.getElementById('score');
    const resultMessage = document.getElementById('result-message');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // Function to select random questions
    function getRandomQuestions() {
        // Make a copy of all questions
        const questionsCopy = [...allQuizQuestions];
        const randomQuestions = [];
        
        // Select 10 random questions
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * questionsCopy.length);
            randomQuestions.push(questionsCopy[randomIndex]);
            questionsCopy.splice(randomIndex, 1); // Remove selected question
        }
        
        return randomQuestions;
    }

    // Start quiz
    document.getElementById('start-quiz').addEventListener('click', startQuiz);
    document.getElementById('restart-quiz').addEventListener('click', restartQuiz);

    // Display question
    function displayQuestion() {
        const question = quizQuestions[currentQuestion];
        
        // Update progress
        const progressPercent = ((currentQuestion) / quizQuestions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
        
        // Create question HTML
        let questionHTML = `
            <div class="question">
                <div class="question-text">${question.question}</div>
                <div class="answers">
        `;
        
        // Add answer buttons
        question.answers.forEach((answer, index) => {
            questionHTML += `
                <button class="answer-btn" data-index="${index}">${answer}</button>
            `;
        });
        
        questionHTML += `</div></div>`;
        questionContainer.innerHTML = questionHTML;
        
        // Add event listeners to answer buttons
        document.querySelectorAll('.answer-btn').forEach(button => {
            button.addEventListener('click', selectAnswer);
        });
    }

    // Select answer
    function selectAnswer(e) {
        const selectedButton = e.target;
        const selectedAnswer = parseInt(selectedButton.getAttribute('data-index'));
        const question = quizQuestions[currentQuestion];
        
        // Disable all answer buttons
        document.querySelectorAll('.answer-btn').forEach(button => {
            button.disabled = true;
            button.style.cursor = 'default';
            
            // Highlight correct answer
            if (parseInt(button.getAttribute('data-index')) === question.correctAnswer) {
                button.style.borderColor = '#2ecc71';
                button.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
            }
            
            // Highlight wrong answer if selected
            if (button === selectedButton && selectedAnswer !== question.correctAnswer) {
                button.style.borderColor = '#e74c3c';
                button.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
            }
        });
        
        // Check if answer is correct
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // Update score
        if (isCorrect) {
            score++;
        }
        
        // Store user answer
        userAnswers.push({
            question: question.question,
            userAnswer: question.answers[selectedAnswer],
            correctAnswer: question.answers[question.correctAnswer],
            isCorrect: isCorrect,
            explanation: question.explanation
        });
        
        // Show feedback
        showFeedback(isCorrect, question.explanation);
    }

    // Show feedback
    function showFeedback(isCorrect, explanation) {
        feedbackContainer.style.display = 'block';
        feedbackContainer.className = 'quiz-feedback ' + (isCorrect ? 'correct-feedback' : 'incorrect-feedback');
        
        feedbackText.innerHTML = isCorrect 
            ? `<p><i class="fas fa-check-circle"></i> Correct! Well done.</p>`
            : `<p><i class="fas fa-times-circle"></i> That's not correct.</p>`;
            
        feedbackText.innerHTML += `<p class="correct-answer">${explanation}</p>`;
    }

    // Next question
    nextQuestionBtn.addEventListener('click', () => {
        currentQuestion++;
        
        if (currentQuestion < quizQuestions.length) {
            feedbackContainer.style.display = 'none';
            displayQuestion();
        } else {
            showResults();
        }
    });

    // Show results
    function showResults() {
        quizQuestionsContainer.style.display = 'none';
        quizResults.style.display = 'block';
        
        scoreElement.textContent = score;
        
        // Custom result message based on score
        if (score === quizQuestions.length) {
            resultMessage.innerHTML = `
                <h3>Perfect Score! <i class="fas fa-star"></i></h3>
                <p>You have excellent knowledge about HIV prevention and treatment. Consider sharing this quiz to help educate others!</p>
            `;
        } else if (score >= quizQuestions.length * 0.7) {
            resultMessage.innerHTML = `
                <h3>Great Job! <i class="fas fa-thumbs-up"></i></h3>
                <p>You have good knowledge about HIV, but there's still more to learn. Check out our resources to improve your understanding.</p>
            `;
        } else if (score >= quizQuestions.length * 0.4) {
            resultMessage.innerHTML = `
                <h3>Not Bad <i class="fas fa-meh"></i></h3>
                <p>You know some basics about HIV, but there are important gaps in your knowledge. Our prevention page has great information to help you learn more.</p>
            `;
        } else {
            resultMessage.innerHTML = `
                <h3>Keep Learning <i class="fas fa-book"></i></h3>
                <p>HIV education is important for everyone. We encourage you to explore our website to learn more about prevention and treatment.</p>
            `;
        }
    }

    // Start quiz
    function startQuiz() {
        quizIntro.style.display = 'none';
        quizQuestionsContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        quizQuestions = getRandomQuestions(); // Get new random questions
        displayQuestion();
    }

    // Restart quiz
    function restartQuiz() {
        quizResults.style.display = 'none';
        quizQuestionsContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        quizQuestions = getRandomQuestions(); // Get new random questions
        displayQuestion();
    }
});

// Video play functionality for visual guide page
if (document.querySelector('.video-wrapper')) {
    document.querySelectorAll('.video-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            // In a real implementation, this would launch a modal with the actual ASL video
            alert('https://www.youtube.com/watch?v=bwJ1vkZo4Dc&pp=ygUgVmlzdWFscyBmb3IgZGVhZiBwZW9wbGUgYm91dCBISVY%3D');
        });
    });
}

