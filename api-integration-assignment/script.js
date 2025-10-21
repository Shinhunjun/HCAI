/**
 * Words of Wisdom For Today
 * JavaScript file for handling API calls to OpenAI
 */

// DOM Elements
const getWisdomBtn = document.getElementById('getWisdomBtn');
const wisdomText = document.getElementById('wisdomText');
const timestamp = document.getElementById('timestamp');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const apiKeyInput = document.getElementById('apiKeyInput');

// Local Storage key for API key
const API_KEY_STORAGE = 'openai_api_key';

// Load saved API key on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
});

// Save API key to local storage when it changes
apiKeyInput.addEventListener('change', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem(API_KEY_STORAGE, apiKey);
    } else {
        localStorage.removeItem(API_KEY_STORAGE);
    }
});

// Main function to get wisdom from OpenAI
async function getWisdom() {
    const apiKey = apiKeyInput.value.trim();

    // Validate API key
    if (!apiKey) {
        showError('Please enter your OpenAI API key first.');
        return;
    }

    // UI State: Start loading
    setLoadingState(true);
    hideError();

    try {
        // Make API call to OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a wise philosopher who provides thoughtful, inspiring, and meaningful words of wisdom. Keep your responses concise (2-3 sentences) and profound.'
                    },
                    {
                        role: 'user',
                        content: 'Give me a unique word of wisdom for today that can inspire and motivate me.'
                    }
                ],
                max_tokens: 150,
                temperature: 0.9
            })
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch wisdom from OpenAI');
        }

        // Parse the response
        const data = await response.json();
        const wisdom = data.choices[0].message.content.trim();

        // Display the wisdom
        displayWisdom(wisdom);

    } catch (error) {
        console.error('Error fetching wisdom:', error);
        showError(`Error: ${error.message}. Please check your API key and try again.`);
    } finally {
        // UI State: Stop loading
        setLoadingState(false);
    }
}

/**
 * Display the wisdom in the card
 */
function displayWisdom(wisdom) {
    wisdomText.textContent = `"${wisdom}"`;

    // Update timestamp
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    timestamp.textContent = `Generated on ${formattedTime}`;

    // Add a nice animation
    const wisdomCard = document.getElementById('wisdomCard');
    wisdomCard.style.animation = 'none';
    setTimeout(() => {
        wisdomCard.style.animation = 'fadeIn 0.5s ease-in';
    }, 10);
}

/**
 * Set loading state
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        loading.classList.add('active');
        getWisdomBtn.disabled = true;
        getWisdomBtn.textContent = 'Generating...';
    } else {
        loading.classList.remove('active');
        getWisdomBtn.disabled = false;
        getWisdomBtn.textContent = 'Get Today\'s Words of Wisdom';
    }
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.remove('active');
}

// Event listener for the button
getWisdomBtn.addEventListener('click', getWisdom);

// Allow Enter key in API key input to trigger getting wisdom
apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWisdom();
    }
});

// Add fade-in animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
