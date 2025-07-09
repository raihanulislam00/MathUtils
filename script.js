// DOM Selectors
const wrapper = document.querySelector("#wrapper");
const primeTable = document.querySelector("#prime-table");
const primeTableBody = document.querySelector("#prime-table-body");
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');

// Constants and variables
const MAX = 201;
let check = new Array(MAX).fill(true);

function getNumberRowColumn(number) {
    let row, column;

    if (number % 20) {
        row = Math.floor(number / 20);
        column = (number % 20) - 1;
    } else {
        row = (number / 20) - 1;
        column = 19;
    }

    return [row, column];
}

function generateNumbersOnDOM() {
    for (let i = 1; i < MAX; i += 20) {
        const numberRow = document.createElement("tr");
        numberRow.classList.add('number-row');

        for (let j = i; j < i + 20; j++) {
            const number = document.createElement("td");
            number.innerText = j;
            number.classList.add('each-number');
            
            // Add tooltip functionality
            number.setAttribute('title', `Number: ${j}`);
            
            // Add click event for number info
            number.addEventListener('click', () => showNumberInfo(j));
            
            // Add hover effect with slight delay for better UX
            number.addEventListener('mouseenter', (e) => {
                setTimeout(() => {
                    if (e.target.matches(':hover')) {
                        e.target.style.transform = 'scale(1.15)';
                    }
                }, 50);
            });
            
            number.addEventListener('mouseleave', (e) => {
                e.target.style.transform = '';
            });
            
            numberRow.appendChild(number);
        }

        primeTableBody.appendChild(numberRow);
    }
}

function sieve() {
    const allRows = primeTableBody.children;

    // Mark 1 as neither prime nor composite (yellow)
    allRows[0].children[0].classList.add('neutral');
    allRows[0].children[0].classList.remove('special'); // Remove any old class
    allRows[0].children[0].setAttribute('title', 'Number: 1 (Neither prime nor composite)');

    for (let i = 2; i < MAX; i++) {
        let rc = getNumberRowColumn(i);
        let row = rc[0];
        let column = rc[1];
        let element = allRows[row].children[column];

        if (check[i]) {
            element.classList.add('prime'); // Red
            element.classList.remove('special');
            element.setAttribute('title', `Number: ${i} (Prime number)`);

            for (let j = i * i; j < MAX; j += i) {
                check[j] = false;
                rc = getNumberRowColumn(j);
                row = rc[0];
                column = rc[1];
                element = allRows[row].children[column];
                element.classList.add('composite'); // Green
                element.classList.remove('special');
                element.setAttribute('title', `Number: ${j} (Composite number, divisible by ${i})`);
            }
        }
    }
}

function animatePrimeCells() {
    const primeCells = document.querySelectorAll('.prime');
    const compositeCells = document.querySelectorAll('.composite');
    
    // Animate prime numbers with staggered delay
    primeCells.forEach((cell, index) => {
        cell.style.animationDelay = `${index * 0.05}s`;
        cell.classList.add('animated');
    });
    
    // Animate composite numbers with different timing
    compositeCells.forEach((cell, index) => {
        cell.style.animationDelay = `${index * 0.02}s`;
        cell.classList.add('animated-composite');
    });
}

// Enhanced colorful pattern highlighting
function highlightNumbers(numbers, baseColor) {
    const colors = [
        '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', 
        '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
        '#ff6348', '#2ed573', '#3742fa', '#f368e0'
    ];
    
    numbers.forEach((num, index) => {
        const cells = document.querySelectorAll('.each-number');
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === num) {
                const colorIndex = index % colors.length;
                const gradient = `linear-gradient(135deg, ${colors[colorIndex]} 0%, ${colors[(colorIndex + 1) % colors.length]} 100%)`;
                
                cell.style.background = gradient;
                cell.style.color = 'white';
                cell.style.fontWeight = 'bold';
                cell.classList.add('pattern-highlighted');
                cell.style.animation = 'rainbow-pulse 2s ease-in-out infinite';
                cell.style.boxShadow = `0 0 20px ${colors[colorIndex]}`;
                
                // Add a delay for staggered animation
                cell.style.animationDelay = `${index * 0.1}s`;
            }
        });
    });
}

// Add rainbow pulse animation to CSS
const rainbowPulseStyle = document.createElement('style');
rainbowPulseStyle.textContent = `
    @keyframes rainbow-pulse {
        0%, 100% { 
            transform: scale(1);
            filter: hue-rotate(0deg);
        }
        25% { 
            transform: scale(1.1);
            filter: hue-rotate(90deg);
        }
        50% { 
            transform: scale(1.15);
            filter: hue-rotate(180deg);
        }
        75% { 
            transform: scale(1.1);
            filter: hue-rotate(270deg);
        }
    }
    
    @keyframes disco-lights {
        0% { background-position: 0% 50%; }
        25% { background-position: 100% 50%; }
        50% { background-position: 100% 100%; }
        75% { background-position: 0% 100%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(rainbowPulseStyle);

// Helper function to check if a number is prime
function isPrimeNumber(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Helper function to get factors of a number
function getFactors(num) {
    const factors = [];
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) factors.push(i);
    }
    return factors;
}

// Function to show number information
function showNumberInfo(number) {
    const isPrime = isPrimeNumber(number);
    let message = '';
    
    if (number === 1) {
        message = `${number} is neither prime nor composite.`;
    } else if (isPrime) {
        message = `${number} is a prime number! It's only divisible by 1 and itself.`;
    } else {
        const factors = getFactors(number);
        message = `${number} is a composite number. Its factors are: ${factors.join(', ')}.`;
    }
    
    // Create colorful info box
    const infoBox = document.createElement('div');
    infoBox.className = 'info-box colorful-info';
    infoBox.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #ff9ff3 75%, #54a0ff 100%);
            background-size: 300% 300%;
            animation: disco-lights 3s ease infinite;
            padding: 20px;
            border-radius: 15px;
            color: white;
            text-align: center;
            font-weight: bold;
            box-shadow: 0 0 30px rgba(255, 107, 107, 0.5);
        ">
            <h2 style="margin: 0 0 10px 0; font-size: 2rem;">${number} ✨</h2>
            <p style="margin: 0; font-size: 1.1rem;">${message}</p>
        </div>
    `;
    
    // Remove existing info box
    const existingBox = document.querySelector('.colorful-info');
    if (existingBox) existingBox.remove();
    
    document.body.appendChild(infoBox);
    
    // Highlight the clicked number with rainbow effect
    const cells = document.querySelectorAll('.each-number');
    cells.forEach(cell => {
        if (parseInt(cell.textContent) === number) {
            cell.style.background = 'linear-gradient(135deg, #ffd700 0%, #ff6b6b 25%, #48dbfb 50%, #ff9ff3 75%, #ffd700 100%)';
            cell.style.backgroundSize = '300% 300%';
            cell.style.animation = 'disco-lights 2s ease infinite, rainbow-pulse 1s ease infinite';
            cell.style.color = 'white';
            cell.style.fontWeight = 'bold';
            cell.style.transform = 'scale(1.3)';
            cell.style.zIndex = '100';
            cell.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        }
    });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (infoBox.parentNode) {
            infoBox.remove();
        }
        // Reset the highlighted cell
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === number) {
                cell.style.transform = '';
                cell.style.zIndex = '';
                cell.style.backgroundSize = '';
                cell.style.animation = '';
                cell.style.boxShadow = '';
            }
        });
    }, 4000);
}

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

// Add interactive controls functionality
function initializeControls() {
    const animateBtn = document.getElementById('animateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const highlightBtn = document.getElementById('highlightBtn');
    const primeCountEl = document.getElementById('primeCount');
    const compositeCountEl = document.getElementById('compositeCount');
    
    let isAnimating = false;
    let highlightMode = false;
    
    // Count and display statistics
    function updateStats() {
        const primeCount = document.querySelectorAll('.prime').length;
        const compositeCount = document.querySelectorAll('.composite').length;
        
        if (primeCountEl) primeCountEl.textContent = primeCount;
        if (compositeCountEl) compositeCountEl.textContent = compositeCount;
    }
    
    // Animate button functionality
    if (animateBtn) {
        animateBtn.addEventListener('click', () => {
            if (isAnimating) return;
            
            isAnimating = true;
            animateBtn.textContent = '⏸️ Animating...';
            animateBtn.disabled = true;
            
            // Remove existing classes
            document.querySelectorAll('.each-number').forEach(cell => {
                cell.classList.remove('prime', 'composite', 'neutral', 'animated', 'animated-composite');
                cell.style.animationDelay = '';
            });
            
            // Re-run sieve with animation
            setTimeout(() => {
                sieve();
                animatePrimeCells();
                updateStats();
                
                setTimeout(() => {
                    isAnimating = false;
                    animateBtn.textContent = '✨ Animate Primes';
                    animateBtn.disabled = false;
                }, 3000);
            }, 500);
        });
    }
    
    // Reset button functionality
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.each-number').forEach(cell => {
                cell.classList.remove('prime', 'composite', 'neutral', 'animated', 'animated-composite', 'highlighted');
                cell.style.animationDelay = '';
                cell.style.background = '';
            });
            
            highlightMode = false;
            highlightBtn.textContent = '🎯 Highlight Pattern';
            updateStats();
        });
    }
    
    // Highlight pattern functionality
    if (highlightBtn) {
        highlightBtn.addEventListener('click', () => {
            highlightMode = !highlightMode;
            
            if (highlightMode) {
                highlightBtn.textContent = '🔍 Normal View';
                
                // Highlight twin primes (primes that differ by 2)
                const primes = Array.from(document.querySelectorAll('.prime')).map(el => parseInt(el.textContent));
                const twinPrimes = [];
                
                for (let i = 0; i < primes.length - 1; i++) {
                    if (primes[i + 1] - primes[i] === 2) {
                        twinPrimes.push(primes[i], primes[i + 1]);
                    }
                }
                
                document.querySelectorAll('.prime').forEach(cell => {
                    const num = parseInt(cell.textContent);
                    if (twinPrimes.includes(num)) {
                        cell.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)';
                        cell.classList.add('highlighted');
                    }
                });
                
                showInfoBox('Highlighted twin primes! These are prime numbers that differ by exactly 2.');
            } else {
                highlightBtn.textContent = '🎯 Highlight Pattern';
                document.querySelectorAll('.highlighted').forEach(cell => {
                    cell.style.background = '';
                    cell.classList.remove('highlighted');
                });
            }
        });
    }
    
    // Initial stats update
    updateStats();
}

// Pattern discovery functionality
function initializePatterns() {
    const patternButtons = document.querySelectorAll('.pattern-btn');
    const patternDescription = document.getElementById('patternDescription');
    const patternStats = document.getElementById('patternStats');
    
    const patterns = {
        twin: {
            title: '👥 Twin Primes',
            description: 'Twin primes are pairs of prime numbers that differ by exactly 2. Examples: (3,5), (5,7), (11,13), (17,19). The Twin Prime Conjecture suggests there are infinitely many such pairs.',
            color: '#ff6b6b',
            highlight: function() {
                const primes = getPrimesInRange(1, 200);
                const twinPairs = [];
                
                for (let i = 0; i < primes.length - 1; i++) {
                    if (primes[i + 1] - primes[i] === 2) {
                        twinPairs.push(primes[i], primes[i + 1]);
                    }
                }
                
                highlightNumbers(twinPairs, this.color);
                return { count: twinPairs.length / 2, numbers: twinPairs };
            }
        },
        sophie: {
            title: '🌟 Sophie Germain Primes',
            description: 'A Sophie Germain prime p is a prime where 2p + 1 is also prime. Named after mathematician Sophie Germain. Examples: 2, 3, 5, 11, 23. They\'re important in cryptography.',
            color: '#feca57',
            highlight: function() {
                const primes = getPrimesInRange(1, 200);
                const sophieGermain = [];
                
                primes.forEach(p => {
                    if (isPrimeNumber(2 * p + 1)) {
                        sophieGermain.push(p);
                    }
                });
                
                highlightNumbers(sophieGermain, this.color);
                return { count: sophieGermain.length, numbers: sophieGermain };
            }
        },
        fibonacci: {
            title: '🌀 Fibonacci Primes',
            description: 'Primes that are also Fibonacci numbers. The Fibonacci sequence: 1,1,2,3,5,8,13,21... Some are prime: 2,3,5,13,89,233. Only a few Fibonacci numbers are prime!',
            color: '#48cae4',
            highlight: function() {
                const fibPrimes = [2, 3, 5, 13, 89];
                const inRange = fibPrimes.filter(n => n <= 200);
                
                highlightNumbers(inRange, this.color);
                return { count: inRange.length, numbers: inRange };
            }
        },
        palindrome: {
            title: '🔄 Palindromic Primes',
            description: 'Primes that read the same forwards and backwards. Examples: 2, 3, 5, 7, 11, 101, 131, 151, 181, 191. These combine number theory with wordplay!',
            color: '#90e0ef',
            highlight: function() {
                const primes = getPrimesInRange(1, 200);
                const palindromicPrimes = primes.filter(p => {
                    const str = p.toString();
                    return str === str.split('').reverse().join('');
                });
                
                highlightNumbers(palindromicPrimes, this.color);
                return { count: palindromicPrimes.length, numbers: palindromicPrimes };
            }
        },
        safe: {
            title: '🛡️ Safe Primes',
            description: 'A safe prime is a prime p where (p-1)/2 is also prime. The number (p-1)/2 is called a Sophie Germain prime. Examples: 5, 7, 11, 23, 47. Used in cryptographic protocols.',
            color: '#a8e6cf',
            highlight: function() {
                const primes = getPrimesInRange(1, 200);
                const safePrimes = [];
                
                primes.forEach(p => {
                    if (p > 2 && isPrimeNumber((p - 1) / 2)) {
                        safePrimes.push(p);
                    }
                });
                
                highlightNumbers(safePrimes, this.color);
                return { count: safePrimes.length, numbers: safePrimes };
            }
        },
        clear: {
            title: '✨ Clear All Highlights',
            description: 'Remove all pattern highlights to see the original prime visualization.',
            highlight: function() {
                clearHighlights();
                return { count: 0, numbers: [] };
            }
        }
    };
    
    patternButtons.forEach(button => {
        button.addEventListener('click', () => {
            const patternType = button.dataset.pattern;
            
            if (patternType === 'clear') {
                clearHighlights();
                patternButtons.forEach(btn => btn.classList.remove('active'));
                patternDescription.innerHTML = '<p>Click on any pattern button above to explore different types of prime numbers and their unique properties!</p>';
                patternStats.innerHTML = '<div class="stat-badge"><span class="stat-emoji">🎯</span><span class="stat-text">Click a pattern to see statistics</span></div>';
                return;
            }
            
            // Remove previous highlights and active states
            clearHighlights();
            patternButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active state to clicked button
            button.classList.add('active');
            
            const pattern = patterns[patternType];
            
            if (pattern) {
                const result = pattern.highlight();
                
                // Update description
                patternDescription.innerHTML = `
                    <div>
                        <h4 style="color: white; margin-bottom: 1rem; font-size: 1.2rem;">${pattern.title}</h4>
                        <p style="margin: 0;">${pattern.description}</p>
                    </div>
                `;
                
                // Update stats
                if (result.count > 0) {
                    patternStats.innerHTML = `
                        <div class="stat-badge">
                            <span class="stat-emoji">📊</span>
                            <span class="stat-text">Found: ${result.count} ${patternType} primes</span>
                        </div>
                        <div class="stat-badge">
                            <span class="stat-emoji">🎯</span>
                            <span class="stat-text">Range: 1-200</span>
                        </div>
                        <div class="stat-badge">
                            <span class="stat-emoji">📈</span>
                            <span class="stat-text">${((result.count / 46) * 100).toFixed(1)}% of all primes</span>
                        </div>
                    `;
                }
            }
        });
    });
}

// Prime Explorer functionality
function initializeExplorer() {
    const numberInput = document.getElementById('numberInput');
    const exploreBtn = document.getElementById('exploreBtn');
    const explorerResults = document.getElementById('explorerResults');
    
    function exploreNumber(num) {
        if (num < 1 || num > 200) {
            explorerResults.innerHTML = `
                <div style="
                    text-align: center; 
                    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
                    background-size: 200% 200%;
                    animation: disco-lights 2s ease infinite;
                    padding: 20px;
                    border-radius: 15px;
                    color: white;
                ">
                    <span style="font-size: 2rem;">⚠️</span>
                    <p style="margin: 10px 0 0 0; font-weight: bold;">Please enter a number between 1 and 200!</p>
                </div>
            `;
            return;
        }
        
        const isPrime = isPrimeNumber(num);
        const factors = getFactors(num);
        const isEven = num % 2 === 0;
        const isPerfectSquare = Math.sqrt(num) % 1 === 0;
        
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'];
        const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
        const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
        
        explorerResults.innerHTML = `
            <div style="
                text-align: center; 
                color: white;
                background: linear-gradient(135deg, ${randomColor1} 0%, ${randomColor2} 100%);
                background-size: 200% 200%;
                animation: disco-lights 3s ease infinite;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 0 30px ${randomColor1}50;
            ">
                <h3 style="font-size: 2.5rem; margin-bottom: 1rem;">
                    ${num} ${isPrime ? '✨🌟' : '🔢💎'}
                </h3>
                <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; backdrop-filter: blur(10px);">
                        <strong>Type:</strong><br>
                        ${num === 1 ? 'Neither Prime nor Composite 🎯' : isPrime ? 'Prime Number 🌟' : 'Composite Number 🔢'}
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; backdrop-filter: blur(10px);">
                        <strong>Factors:</strong><br>
                        ${factors.join(', ')} 🔍
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 10px; backdrop-filter: blur(10px);">
                        <strong>Properties:</strong><br>
                        ${isEven ? 'Even 📊' : 'Odd 📈'}${isPerfectSquare ? ', Perfect Square 📐' : ''} 
                    </div>
                </div>
            </div>
        `;
        
        // Highlight with rainbow effect
        highlightNumbers([num], randomColor1);
    }
    
    exploreBtn.addEventListener('click', () => {
        const num = parseInt(numberInput.value);
        exploreNumber(num);
    });
    
    numberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const num = parseInt(numberInput.value);
            exploreNumber(num);
        }
    });
}

// Prime Race Game functionality
function initializePrimeRace() {
    const startBtn = document.getElementById('startRaceBtn');
    const pauseBtn = document.getElementById('pauseRaceBtn');
    const resetBtn = document.getElementById('resetRaceBtn');
    const primesFoundEl = document.getElementById('primesFound');
    const currentNumberEl = document.getElementById('currentNumber');
    const raceSpeedEl = document.getElementById('raceSpeed');
    const speedBtns = document.querySelectorAll('.speed-btn');
    
    let raceInterval;
    let currentNum = 1;
    let primesFound = 0;
    let speed = 500; // Normal speed
    let isRunning = false;
    
    const speeds = {
        slow: { ms: 1000, label: 'Slow' },
        normal: { ms: 500, label: 'Normal' },
        fast: { ms: 200, label: 'Fast' },
        turbo: { ms: 50, label: 'Turbo' }
    };
    
    function updateDisplay() {
        primesFoundEl.textContent = primesFound;
        currentNumberEl.textContent = currentNum;
    }
    
    function raceStep() {
        if (currentNum > 200) {
            stopRace();
            // Create rainbow celebration
            createRainbowCelebration();
            showInfoBox(`🎉 Race Complete! Found ${primesFound} primes from 1 to 200! 🌈`);
            return;
        }
        
        // Remove previous racing highlights
        const cells = document.querySelectorAll('.each-number');
        cells.forEach(cell => cell.classList.remove('racing-number'));
        
        cells.forEach(cell => {
            if (parseInt(cell.textContent) === currentNum) {
                cell.classList.add('racing-number');
                if (isPrimeNumber(currentNum)) {
                    primesFound++;
                    // Add extra sparkle effect for primes
                    createSparkleEffect(cell);
                }
            }
        });
        
        currentNum++;
        updateDisplay();
    }
    
    function startRace() {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        raceInterval = setInterval(raceStep, speed);
    }
    
    function pauseRace() {
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        clearInterval(raceInterval);
    }
    
    function stopRace() {
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        clearInterval(raceInterval);
    }
    
    function resetRace() {
        stopRace();
        currentNum = 1;
        primesFound = 0;
        updateDisplay();
        document.querySelectorAll('.racing-number').forEach(cell => {
            cell.classList.remove('racing-number');
        });
    }
    
    startBtn.addEventListener('click', startRace);
    pauseBtn.addEventListener('click', pauseRace);
    resetBtn.addEventListener('click', resetRace);
    
    speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            speedBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const speedType = btn.dataset.speed;
            speed = speeds[speedType].ms;
            raceSpeedEl.textContent = speeds[speedType].label;
            
            if (isRunning) {
                clearInterval(raceInterval);
                raceInterval = setInterval(raceStep, speed);
            }
        });
    });
    
    updateDisplay();
}

// Create sparkle effect for prime numbers
function createSparkleEffect(element) {
    const sparkles = ['✨', '⭐', '🌟', '💫', '🎆'];
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.position = 'fixed';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        sparkle.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = rect.left + Math.random() * 40 + 'px';
        sparkle.style.top = rect.top + Math.random() * 40 + 'px';
        
        sparkle.style.animation = 'sparkle-float 2s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
    }
}

// Create rainbow celebration effect
function createRainbowCelebration() {
    const celebration = document.createElement('div');
    celebration.style.position = 'fixed';
    celebration.style.top = '0';
    celebration.style.left = '0';
    celebration.style.width = '100vw';
    celebration.style.height = '100vh';
    celebration.style.pointerEvents = 'none';
    celebration.style.zIndex = '9999';
    celebration.innerHTML = '🎉🌈✨🎆🎊⭐🌟💫';
    celebration.style.fontSize = '3rem';
    celebration.style.display = 'flex';
    celebration.style.justifyContent = 'center';
    celebration.style.alignItems = 'center';
    celebration.style.animation = 'celebration-bounce 3s ease-out forwards';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => celebration.remove(), 3000);
}

// Add sparkle animation styles
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle-float {
        0% {
            opacity: 1;
            transform: translateY(0) scale(0.5);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(1.5);
        }
    }
    
    @keyframes celebration-bounce {
        0%, 100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Enhanced initialize function
function initialize() {
    generateNumbersOnDOM();
    sieve();
    animatePrimeCells();
    initNavbar();
    initializeControls();
    initializePatterns();
    initializeExplorer(); // Add explorer initialization
    initializePrimeRace(); // Add game initialization
}

initialize();