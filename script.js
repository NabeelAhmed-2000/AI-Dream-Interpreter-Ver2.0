document.addEventListener('DOMContentLoaded', () => {
    // --- Initial Icon Rendering ---
    feather.replace();

    // --- 1. Element Selection ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const dreamInput = document.getElementById('dream-input');
    const interpretButton = document.getElementById('interpret-button');
    const resultsContainer = document.getElementById('results-container');
    const interpretationOutput = document.getElementById('interpretation-output');
    const moodPaletteOutput = document.getElementById('mood-palette-output');
    const keySymbolsOutput = document.getElementById('key-symbols-output');
    const dreamLogList = document.getElementById('dream-log-list');
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    const buttonText = document.getElementById('button-text');
    const actionButtonsContainer = document.querySelector('.action-buttons-container');
    
    // Feedback Elements
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackStep1 = document.getElementById('feedback-step-1');
    const feedbackYesBtn = document.getElementById('feedback-yes-btn');
    const feedbackNoBtn = document.getElementById('feedback-no-btn');
    const feedbackStep2Yes = document.getElementById('feedback-step-2-yes');
    const feedbackStep2No = document.getElementById('feedback-step-2-no');
    const starRatingContainer = document.querySelector('.star-rating');
    const feedbackChoiceBtns = document.querySelectorAll('.feedback-choice-btn');
    const feedbackThanks = document.getElementById('feedback-thanks');
    const feedbackLogContainer = document.getElementById('feedback-log-container');

    // --- 2. Application State ---
    let currentAnalysisResult = null;
    let isCurrentDreamSaved = false;
    let feedbackData = null;
    let primaryButtonState = 'interpret'; // 'interpret' or 'start_new'
    
    // --- 3. Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(pageId).classList.add('active');
            setTimeout(() => feather.replace(), 0);
        });
    });

    // --- 4. Core Logic: Mock AI & Display ---
    function getMockInterpretation(dreamText) {
        const lowerCaseText = dreamText.toLowerCase();
        const mockData = {
            flying: {
                interpretation: "Flying in dreams often symbolizes a sense of freedom, release from daily pressures, and embracing personal power. It can indicate that you feel on top of the world or have gained a new, higher perspective on a situation in your life.",
                mood: "Freedom",
                moodColors: ['#87CEEB', '#E0FFFF', '#B0E0E6'],
                symbols: [{ emoji: '✈️', name: 'Flying', explanation: 'Represents freedom and personal power.' }, { emoji: '🏙️', name: 'Perspective', explanation: 'Symbolizes seeing things from a broader viewpoint.' }]
            },
            chasing: {
                interpretation: "Being chased in a dream typically points to avoidance of a situation or emotion in your waking life. Consider what you are running from. A dark forest can symbolize confusion, the unknown, or feeling lost on your current path.",
                mood: "Anxious",
                moodColors: ['#696969', '#A9A9A9', '#D3D3D3'],
                symbols: [{ emoji: '🏃‍♂️', name: 'Chasing', explanation: 'Indicates avoidance or anxiety.' }, { emoji: '🌲', name: 'Forest', explanation: 'Represents the unknown or feeling lost.' }]
            },
            water: {
                interpretation: "Dreams about water often reflect your emotional state and the unconscious mind. A calm ocean can signify peace and tranquility, while discovering a hidden treasure suggests newfound self-worth or uncovering a hidden talent.",
                mood: "Calm",
                moodColors: ['#4682B4', '#5F9EA0', '#ADD8E6'],
                symbols: [{ emoji: '🌊', name: 'Water', explanation: 'Reflects your current emotional state.' }, { emoji: '💎', name: 'Treasure', explanation: 'Suggests hidden talents or self-worth.' }]
            },
            teeth: {
                interpretation: "Dreams about teeth falling out are very common and often relate to stress, anxiety, and feelings of powerlessness or lack of control in a situation. It can also be linked to concerns about one's appearance or communication.",
                mood: "Insecure",
                moodColors: ['#E74C3C', '#F5B7B1', '#D98880'],
                symbols: [{ emoji: '🦷', name: 'Teeth Loss', explanation: 'Represents anxiety or loss of control.' }, { emoji: '💬', name: 'Communication', explanation: 'Symbolizes worries about how you are perceived.' }]
            },
            test: {
                interpretation: "Dreaming of taking a test, especially one you are unprepared for, often symbolizes being judged or scrutinized in your waking life. It can reflect a fear of failure or not living up to the expectations of others or yourself.",
                mood: "Anxious",
                moodColors: ['#696969', '#A9A9A9', '#D3D3D3'],
                symbols: [{ emoji: '📝', name: 'Test-taking', explanation: 'Indicates a fear of failure or being judged.' }, { emoji: '🏫', name: 'School', explanation: 'Represents conformance and expectations.' }]
            },
            money: {
                interpretation: "Finding money in a dream is often a positive omen, symbolizing self-worth, opportunity, and success. It can suggest that you are beginning to recognize your own value and the power you hold to shape your own life.",
                mood: "Optimistic",
                moodColors: ['#F1C40F', '#F7DC6F', '#FDEBD0'],
                symbols: [{ emoji: '💰', name: 'Finding Money', explanation: 'Symbolizes self-worth and new opportunities.' }, { emoji: '🌟', name: 'Success', explanation: 'Represents achievement and potential.' }]
            },
            default: {
                interpretation: "We couldn't identify a specific dream theme from your input. Please try to be more descriptive. For this prototype, supported themes include 'flying', 'chasing', 'water', 'teeth falling out', 'taking a test', and 'finding money'.",
                mood: "Mysterious",
                moodColors: ['#9370DB', '#8A2BE2', '#4B0082'],
                symbols: [{ emoji: '❓', name: 'Unknown', explanation: 'The dream theme was not recognized.' }]
            }
        };

        if (lowerCaseText.includes('fly')) return mockData.flying;
        if (lowerCaseText.includes('chase') || lowerCaseText.includes('running')) return mockData.chasing;
        if (lowerCaseText.includes('water') || lowerCaseText.includes('ocean')) return mockData.water;
        if (lowerCaseText.includes('teeth')) return mockData.teeth;
        if (lowerCaseText.includes('test') || lowerCaseText.includes('exam')) return mockData.test;
        if (lowerCaseText.includes('money') || lowerCaseText.includes('cash')) return mockData.money;
        return mockData.default;
    }

    function displayResults(data) {
        currentAnalysisResult = data;
        isCurrentDreamSaved = false;
        feedbackData = null;

        interpretationOutput.innerHTML = `<p>${data.interpretation}</p>`;
        
        moodPaletteOutput.innerHTML = '';
        if (data.mood === "Mysterious") {
            moodPaletteOutput.innerHTML = `<p class="error-text">N/A - Theme not recognized.</p>`;
        } else {
            const colorsContainer = document.createElement('div');
            colorsContainer.className = 'mood-colors-container';
            data.moodColors.forEach(color => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'mood-color-circle';
                colorDiv.style.backgroundColor = color;
                colorsContainer.appendChild(colorDiv);
            });
            moodPaletteOutput.appendChild(colorsContainer);

            const moodText = document.createElement('p');
            moodText.innerHTML = `This dream appears to have a <strong>${data.mood}</strong> mood.`;
            moodPaletteOutput.appendChild(moodText);
        }
        
        const symbolList = document.createElement('ul');
        symbolList.style.cssText = `list-style-type: none; padding: 0; margin: 0;`;
        data.symbols.forEach(symbol => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong style="color: var(--text-primary);">${symbol.emoji} ${symbol.name}:</strong> ${symbol.explanation}`;
            listItem.style.marginBottom = '10px';
            symbolList.appendChild(listItem);
        });
        keySymbolsOutput.innerHTML = '';
        keySymbolsOutput.appendChild(symbolList);

        resetFeedbackUI();
        resultsContainer.classList.add('visible');
        document.querySelectorAll('.result-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 100}ms`;
        });
        addDynamicActionButtons();
        updatePrimaryButton('start_new');
    }

    // --- 5. UI Update & Interaction Functions ---
    function showLoader(isLoading, text) {
        interpretButton.disabled = isLoading;
        if (isLoading) {
            buttonText.style.display = 'none';
            loader.style.display = 'flex';
            loaderText.textContent = text;
        } else {
            buttonText.style.display = 'block';
            loader.style.display = 'none';
        }
    }
    
    function addDynamicActionButtons() {
        actionButtonsContainer.innerHTML = `
            <button id="copy-btn" title="Copy interpretation text"><i data-feather="copy"></i><span>Copy</span></button>
            <button id="save-btn" title="Save this interpretation to the Dream Log"><i data-feather="save"></i><span>Save to Log</span></button>
        `;
        feather.replace();
        document.getElementById('copy-btn').addEventListener('click', copyInterpretation);
        document.getElementById('save-btn').addEventListener('click', saveCurrentDream);
    }
    
    function copyInterpretation() {
        const btn = document.getElementById('copy-btn');
        navigator.clipboard.writeText(currentAnalysisResult.interpretation);
        btn.innerHTML = `<i data-feather="check"></i><span>Copied!</span>`;
        btn.style.color = 'var(--success-color)';
        feather.replace();
        setTimeout(() => {
            btn.innerHTML = `<i data-feather="copy"></i><span>Copy</span>`;
            btn.style.color = 'inherit';
            feather.replace();
        }, 2000);
    }

    function saveCurrentDream() {
        if (!currentAnalysisResult || isCurrentDreamSaved) return;
        const saveBtn = document.getElementById('save-btn');
        const logPlaceholder = document.querySelector('.log-placeholder');
        if (logPlaceholder) logPlaceholder.remove();
        
        const dreamSnippet = dreamInput.value.trim().substring(0, 50);
        const interpretationSnippet = currentAnalysisResult.interpretation.substring(0, 100);
        
        const listItem = document.createElement('li');
        const logId = `log-${Date.now()}`;
        listItem.id = logId;
        currentAnalysisResult.logId = logId;
        
        const feedbackText = feedbackData ? `<span class="log-feedback">[Feedback: ${feedbackData.type === 'rating' ? `${feedbackData.value} Stars` : `Improve ${feedbackData.value}`}]</span>` : '';
        
        listItem.innerHTML = `
            <div>
                <p style="margin-top:0; margin-bottom: 5px;"><strong>Dream:</strong> "${dreamSnippet}..."</p>
                <p style="margin-top:0; margin-bottom: 5px;"><strong>Interpretation:</strong> "${interpretationSnippet}..."</p>
                <p style="margin-bottom:0;"><strong>Mood:</strong> ${currentAnalysisResult.mood}</p>
                <div class="log-feedback-container">${feedbackText}</div>
            </div>
            <button class="delete-log-btn" title="Delete Log Entry">&times;</button>
        `;
        dreamLogList.prepend(listItem);
        isCurrentDreamSaved = true;

        saveBtn.innerHTML = `<i data-feather="check-circle"></i><span>Saved!</span>`;
        saveBtn.disabled = true;
        saveBtn.title = 'This dream has already been saved.';
        feather.replace();
    }

    function clearInterpreter() {
        if (currentAnalysisResult && !isCurrentDreamSaved) {
            if (!confirm("Are you sure? Your current interpretation hasn't been saved and will be lost.")) {
                return;
            }
        }
        resultsContainer.classList.add('clearing');
        resultsContainer.addEventListener('transitionend', () => {
            if (resultsContainer.classList.contains('clearing')) {
                dreamInput.value = ''; // THE FINAL FIX IS HERE
                actionButtonsContainer.innerHTML = '';
                currentAnalysisResult = null;
                isCurrentDreamSaved = false;
                resultsContainer.classList.remove('visible', 'clearing');
                updatePrimaryButton('interpret');
            }
        }, { once: true });
    }

    function updatePrimaryButton(state) {
        primaryButtonState = state;
        if (state === 'interpret') {
            buttonText.textContent = 'Interpret Dream';
            interpretButton.classList.remove('start-new-state');
            interpretButton.title = 'Interpret the dream text';
        } else { // 'start_new'
            buttonText.textContent = 'Start New';
            interpretButton.classList.add('start-new-state');
            interpretButton.title = 'Clear the results and start a new interpretation';
        }
    }
    
    function resetFeedbackUI() {
        feedbackStep1.style.display = 'block';
        feedbackStep2Yes.style.display = 'none';
        feedbackStep2No.style.display = 'none';
        feedbackThanks.style.opacity = '0';
        setTimeout(() => { feedbackThanks.textContent = ''; }, 300);
        
        const currentStars = starRatingContainer.querySelectorAll('.star');
        currentStars.forEach(s => s.classList.remove('filled'));
        
        feedbackLogContainer.innerHTML = '';
        feather.replace();
    }

    function submitFeedback(type, value) {
        feedbackData = { type, value };
        
        feedbackThanks.textContent = 'Thank you! Your feedback has been recorded.';
        feedbackThanks.style.opacity = '1';
        
        feedbackStep1.style.display = 'none';
        feedbackStep2Yes.style.display = 'none';
        feedbackStep2No.style.display = 'none';

        const logItem = document.createElement('div');
        logItem.className = 'feedback-log-item';
        const timestamp = new Date().toLocaleTimeString();
        let feedbackMessage = type === 'rating' ? `Rated ${value} Stars` : `Suggestion: Improve ${value}`;
        logItem.innerHTML = `<i data-feather="check-circle"></i> <div>Feedback submitted at ${timestamp} (${feedbackMessage})</div>`;
        feedbackLogContainer.appendChild(logItem);
        feather.replace();

        if (isCurrentDreamSaved) {
            const logEntry = document.getElementById(currentAnalysisResult.logId);
            if(logEntry) {
                const feedbackDiv = logEntry.querySelector('.log-feedback-container');
                feedbackDiv.innerHTML = `<span class="log-feedback">[Feedback: ${feedbackMessage}]</span>`;
            }
        }
    }
    
    // --- 6. Event Listeners ---
    interpretButton.addEventListener('click', () => {
        if (primaryButtonState === 'interpret') {
            const dreamText = dreamInput.value.trim();
            if (dreamText === '') {
                alert('Please describe your dream.');
                return;
            }
            const dynamicDelay = Math.min(8000, 1000 + dreamText.length * 3);
            showLoader(true, `Interpreting...`);
            setTimeout(() => {
                displayResults(getMockInterpretation(dreamText));
                showLoader(false);
            }, dynamicDelay);
        } else { // 'start_new' state
            clearInterpreter();
        }
    });
    
    dreamInput.addEventListener('input', () => {
        if (primaryButtonState === 'start_new') {
            updatePrimaryButton('interpret');
        }
    });

    dreamLogList.addEventListener('click', e => {
        if (e.target.classList.contains('delete-log-btn')) {
            const listItem = e.target.parentElement;
            listItem.classList.add('removing');
            listItem.addEventListener('transitionend', () => {
                listItem.remove();
                if (dreamLogList.children.length === 0) {
                     dreamLogList.innerHTML = '<li class="log-placeholder">Your saved dreams will appear here.</li>';
                }
            });
        }
    });
    
    feedbackYesBtn.addEventListener('click', () => {
        feedbackStep1.style.display = 'none';
        feedbackStep2Yes.style.display = 'block';
        feather.replace();
    });

    feedbackNoBtn.addEventListener('click', () => {
        feedbackStep1.style.display = 'none';
        feedbackStep2No.style.display = 'block';
    });
    
    starRatingContainer.addEventListener('click', e => {
        const clickedStarSpan = e.target.closest('.star');
        
        if (clickedStarSpan && !feedbackData) {
            const rating = parseInt(clickedStarSpan.dataset.value, 10);
            
            const liveStars = starRatingContainer.querySelectorAll('.star');
            liveStars.forEach((star, index) => {
                star.classList.toggle('filled', index < rating);
            });
            
            submitFeedback('rating', rating);
        }
    });

    feedbackChoiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!feedbackData) {
                const choice = btn.dataset.feedback;
                submitFeedback('choice', choice);
            }
        });
    });
});