// DOM Elements
const number1Input = document.getElementById('number1');
const number2Input = document.getElementById('number2');
const calculateBtn = document.getElementById('calculateBtn');
const resultSection = document.getElementById('resultSection');
const gcdResult = document.getElementById('gcdResult');
const lcmResult = document.getElementById('lcmResult');
const stepsContent = document.getElementById('stepsContent');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');
const exampleBtns = document.querySelectorAll('.example-btn');

// History array to store calculations
let calculationHistory = [];

// Navbar functionality
function initNavbar() {
    if (!navbar || !navbarToggle || !navbarMenu) return;
    
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

// GCD calculation using Euclidean algorithm
function calculateGCD(a, b) {
    const steps = [];
    let original_a = a, original_b = b;
    
    steps.push(`Finding GCD of ${original_a} and ${original_b} using Euclidean Algorithm:`);
    
    while (b !== 0) {
        const quotient = Math.floor(a / b);
        const remainder = a % b;
        steps.push(`${a} = ${b} × ${quotient} + ${remainder}`);
        a = b;
        b = remainder;
    }
    
    steps.push(`Since remainder is 0, GCD(${original_a}, ${original_b}) = ${a}`);
    
    return { gcd: a, steps };
}

// LCM calculation using the formula: LCM(a,b) = (a * b) / GCD(a,b)
function calculateLCM(a, b, gcd) {
    const lcm = (a * b) / gcd;
    const steps = [
        `Finding LCM using the formula: LCM(a,b) = (a × b) ÷ GCD(a,b)`,
        `LCM(${a}, ${b}) = (${a} × ${b}) ÷ ${gcd}`,
        `LCM(${a}, ${b}) = ${a * b} ÷ ${gcd}`,
        `LCM(${a}, ${b}) = ${lcm}`
    ];
    
    return { lcm, steps };
}

// Prime factorization for additional explanation
function getPrimeFactors(n) {
    const factors = [];
    let d = 2;
    
    while (d * d <= n) {
        while (n % d === 0) {
            factors.push(d);
            n /= d;
        }
        d++;
    }
    
    if (n > 1) {
        factors.push(n);
    }
    
    return factors;
}

// Display calculation results
function displayResults(num1, num2, gcdData, lcmData) {
    // Update result displays
    gcdResult.textContent = gcdData.gcd;
    lcmResult.textContent = lcmData.lcm;
    
    // Create step-by-step explanation
    let stepsHTML = '<div class="calculation-method">';
    
    // Add prime factorization explanation
    const factors1 = getPrimeFactors(num1);
    const factors2 = getPrimeFactors(num2);
    
    stepsHTML += `
        <div class="step">
            <strong>Prime Factorization:</strong><br>
            ${num1} = ${factors1.join(' × ')}<br>
            ${num2} = ${factors2.join(' × ')}
        </div>
    `;
    
    // Add GCD steps
    gcdData.steps.forEach(step => {
        stepsHTML += `<div class="step">${step}</div>`;
    });
    
    stepsHTML += '<br>';
    
    // Add LCM steps
    lcmData.steps.forEach(step => {
        stepsHTML += `<div class="step">${step}</div>`;
    });
    
    // Add verification
    stepsHTML += `
        <div class="step">
            <strong>Verification:</strong><br>
            GCD(${num1}, ${num2}) × LCM(${num1}, ${num2}) = ${gcdData.gcd} × ${lcmData.lcm} = ${gcdData.gcd * lcmData.lcm}<br>
            ${num1} × ${num2} = ${num1 * num2}<br>
            ✓ Both equal ${num1 * num2}, confirming our answer!
        </div>
    `;
    
    stepsHTML += '</div>';
    stepsContent.innerHTML = stepsHTML;
    
    // Show results with animation
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add to history
    addToHistory(num1, num2, gcdData.gcd, lcmData.lcm);
}

// Add calculation to history
function addToHistory(num1, num2, gcd, lcm) {
    // Remove duplicate if exists
    calculationHistory = calculationHistory.filter(item => 
        !(item.num1 === num1 && item.num2 === num2)
    );
    
    // Add to beginning of array
    calculationHistory.unshift({
        num1: num1,
        num2: num2,
        gcd: gcd,
        lcm: lcm,
        timestamp: new Date().toLocaleTimeString()
    });
    
    // Keep only last 8 items
    if (calculationHistory.length > 8) {
        calculationHistory = calculationHistory.slice(0, 8);
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No calculations yet. Try entering two numbers above!</p>';
        clearHistoryBtn.style.display = 'none';
        return;
    }
    
    historyList.innerHTML = calculationHistory.map(item => 
        `<div class="history-item">
            <strong>${item.num1} & ${item.num2}</strong><br>
            GCD: ${item.gcd} | LCM: ${item.lcm}<br>
            <small>(${item.timestamp})</small>
        </div>`
    ).join('');
    
    clearHistoryBtn.style.display = 'block';
}

// Perform calculation
function performCalculation() {
    const num1 = parseInt(number1Input.value);
    const num2 = parseInt(number2Input.value);
    
    // Validate inputs
    if (!num1 || !num2 || num1 < 1 || num2 < 1) {
        alert('Please enter valid positive integers for both numbers!');
        return;
    }
    
    if (num1 > 10000 || num2 > 10000) {
        alert('Please enter numbers less than 10,000 for better performance!');
        return;
    }
    
    // Calculate GCD and LCM
    const gcdData = calculateGCD(num1, num2);
    const lcmData = calculateLCM(num1, num2, gcdData.gcd);
    
    // Display results
    displayResults(num1, num2, gcdData, lcmData);
    
    // Add visual feedback to button
    calculateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        calculateBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Add confetti for special cases
    if (gcdData.gcd === 1) {
        addConfetti('🎉', 'Numbers are coprime!');
    } else if (num1 === num2) {
        addConfetti('✨', 'Numbers are equal!');
    } else if (num2 % num1 === 0 || num1 % num2 === 0) {
        addConfetti('🎊', 'One divides the other!');
    }
}

// Clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear the calculation history?')) {
        calculationHistory = [];
        updateHistoryDisplay();
    }
}

// Add confetti effect
function addConfetti(emoji, message) {
    // Create confetti elements
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.innerHTML = emoji;
            confetti.style.position = 'fixed';
            confetti.style.top = '20%';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.fontSize = '2rem';
            confetti.style.zIndex = '1000';
            confetti.style.animation = 'confettiFall 3s ease-out forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 200);
    }
    
    // Show message
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '30%';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.background = 'rgba(102, 126, 234, 0.9)';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.borderRadius = '25px';
    messageDiv.style.fontSize = '1.2rem';
    messageDiv.style.fontWeight = '600';
    messageDiv.style.zIndex = '1001';
    messageDiv.style.animation = 'fadeInOut 2s ease-in-out forwards';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

// Set example values
function setExample(num1, num2) {
    number1Input.value = num1;
    number2Input.value = num2;
    
    // Add visual feedback
    number1Input.style.background = 'rgba(102, 126, 234, 0.2)';
    number2Input.style.background = 'rgba(102, 126, 234, 0.2)';
    
    setTimeout(() => {
        number1Input.style.background = '';
        number2Input.style.background = '';
    }, 1000);
    
    // Auto-calculate after a delay
    setTimeout(performCalculation, 500);
}

// Event listeners
calculateBtn.addEventListener('click', performCalculation);
clearHistoryBtn.addEventListener('click', clearHistory);

// Allow Enter key to trigger calculation
number1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        number2Input.focus();
    }
});

number2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performCalculation();
    }
});

// Example buttons
exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const num1 = parseInt(btn.dataset.num1);
        const num2 = parseInt(btn.dataset.num2);
        setExample(num1, num2);
    });
});

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        50% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Initialize when page loads
window.addEventListener('load', () => {
    initNavbar();
    number1Input.focus();
});

// Auto-suggest related examples
function showRandomExample() {
    if (number1Input.value === '' && number2Input.value === '') {
        const examples = [
            [12, 18], [15, 25], [48, 18], [21, 28], 
            [36, 48], [14, 35], [24, 36], [20, 30]
        ];
        const example = examples[Math.floor(Math.random() * examples.length)];
        number1Input.placeholder = `Try ${example[0]}...`;
        number2Input.placeholder = `Try ${example[1]}...`;
    }
}

// Change placeholders every 4 seconds
setInterval(showRandomExample, 4000);
