// DOM Elements
const numberInput = document.getElementById('numberInput');
const checkBtn = document.getElementById('checkBtn');
const resultSection = document.getElementById('resultSection');
const resultCard = document.getElementById('resultCard');
const numberDisplay = document.getElementById('numberDisplay');
const resultText = document.getElementById('resultText');
const explanation = document.getElementById('explanation');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

// History array to store checked numbers
let checkHistory = [];

// Navbar functionality
function initNavbar() {
    // Toggle mobile menu
    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            
            // Close mobile menu
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navbarToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });
}

// Function to check if number is even or odd
function checkEvenOdd(number) {
    const isEven = number % 2 === 0;
    return {
        isEven: isEven,
        type: isEven ? 'Even' : 'Odd',
        explanation: isEven 
            ? `${number} ÷ 2 = ${number / 2} (no remainder)`
            : `${number} ÷ 2 = ${Math.floor(number / 2)} remainder 1`
    };
}

// Function to display result
function displayResult(number, result) {
    numberDisplay.textContent = number;
    resultText.textContent = `${result.type} Number!`;
    resultText.className = `result-text ${result.isEven ? 'even' : 'odd'}`;
    explanation.textContent = result.explanation;
    
    // Add animation classes
    resultCard.style.animation = 'none';
    resultCard.offsetHeight; // Trigger reflow
    resultCard.style.animation = 'fadeInUp 0.6s ease';
    
    // Show result section
    resultSection.style.display = 'block';
    
    // Add to history
    addToHistory(number, result);
}

// Function to add number to history
function addToHistory(number, result) {
    // Remove duplicate if exists
    checkHistory = checkHistory.filter(item => item.number !== number);
    
    // Add to beginning of array
    checkHistory.unshift({
        number: number,
        type: result.type,
        isEven: result.isEven,
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Keep only last 10 items
    if (checkHistory.length > 10) {
        checkHistory = checkHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

// Function to update history display
function updateHistoryDisplay() {
    if (checkHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No numbers checked yet. Try entering a number above!</p>';
        clearHistoryBtn.style.display = 'none';
        return;
    }
    
    historyList.innerHTML = checkHistory.map(item => 
        `<div class="history-item ${item.isEven ? 'even' : 'odd'}">
            ${item.number} → ${item.type} 
            <small>(${item.timestamp})</small>
        </div>`
    ).join('');
    
    clearHistoryBtn.style.display = 'block';
}

// Function to perform the check
function performCheck() {
    const inputValue = numberInput.value.trim();
    
    // Validate input
    if (inputValue === '') {
        alert('Please enter a number!');
        numberInput.focus();
        return;
    }
    
    const number = parseInt(inputValue);
    
    if (isNaN(number)) {
        alert('Please enter a valid number!');
        numberInput.focus();
        return;
    }
    
    // Check even or odd
    const result = checkEvenOdd(number);
    displayResult(number, result);
    
    // Add visual feedback
    checkBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        checkBtn.style.transform = 'scale(1)';
    }, 150);
}

// Function to clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear the history?')) {
        checkHistory = [];
        updateHistoryDisplay();
    }
}

// Event listeners
checkBtn.addEventListener('click', performCheck);
clearHistoryBtn.addEventListener('click', clearHistory);

// Allow Enter key to trigger check
numberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performCheck();
    }
});

// Focus input on page load
numberInput.addEventListener('input', () => {
    // Hide result when user starts typing new number
    if (resultSection.style.display === 'block') {
        resultSection.style.opacity = '0.5';
    }
});

// Auto-focus input when page loads
window.addEventListener('load', () => {
    numberInput.focus();
    initNavbar(); // Initialize navbar functionality
});

// Add some fun random examples when page loads
const exampleNumbers = [42, 17, 100, 33, 888, 7, 256, 91];
let exampleIndex = 0;

function showRandomExample() {
    if (numberInput.value === '') {
        numberInput.placeholder = `Try ${exampleNumbers[exampleIndex]}...`;
        exampleIndex = (exampleIndex + 1) % exampleNumbers.length;
    }
}

// Change placeholder every 3 seconds
setInterval(showRandomExample, 3000);

// Add confetti effect for special numbers
function addConfetti() {
    // Simple confetti effect for fun numbers
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎉';
    confetti.style.position = 'fixed';
    confetti.style.top = '20%';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.fontSize = '2rem';
    confetti.style.zIndex = '1000';
    confetti.style.animation = 'confettiFall 2s ease-out forwards';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

// Add confetti CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Trigger confetti for special numbers
function checkSpecialNumber(number) {
    const specialNumbers = [0, 100, 1000, 42, 7, 13, 21, 69, 777, 999];
    if (specialNumbers.includes(Math.abs(number))) {
        setTimeout(addConfetti, 500);
    }
}
