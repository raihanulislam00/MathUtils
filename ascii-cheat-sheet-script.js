// ASCII Cheat Sheet Script

// DOM elements
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const asciiTableBody = document.getElementById('asciiTableBody');
const charInput = document.getElementById('charInput');
const decInput = document.getElementById('decInput');
const hexInput = document.getElementById('hexInput');
const binInput = document.getElementById('binInput');
const converterResult = document.getElementById('converterResult');

// ASCII data with descriptions and categories
const asciiData = [];

// Initialize ASCII data
function initAsciiData() {
    const controlChars = {
        0: 'NULL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
        8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
        16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4', 21: 'NAK', 22: 'SYN', 23: 'ETB',
        24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 30: 'RS', 31: 'US',
        127: 'DEL'
    };

    for (let i = 0; i <= 255; i++) {
        const char = String.fromCharCode(i);
        let description = '';
        let category = '';
        let displayChar = char;

        if (i <= 31 || i === 127) {
            // Control characters
            description = controlChars[i] || 'Control';
            category = 'control';
            displayChar = controlChars[i] || `CTRL+${String.fromCharCode(i + 64)}`;
        } else if (i === 32) {
            // Space
            description = 'Space';
            category = 'printable';
            displayChar = 'SPACE';
        } else if (i >= 33 && i <= 47) {
            // Symbols and punctuation
            description = getSymbolDescription(char);
            category = 'symbols';
        } else if (i >= 48 && i <= 57) {
            // Numbers
            description = `Digit ${char}`;
            category = 'numbers';
        } else if (i >= 58 && i <= 64) {
            // More symbols
            description = getSymbolDescription(char);
            category = 'symbols';
        } else if (i >= 65 && i <= 90) {
            // Uppercase letters
            description = `Uppercase ${char}`;
            category = 'letters';
        } else if (i >= 91 && i <= 96) {
            // More symbols
            description = getSymbolDescription(char);
            category = 'symbols';
        } else if (i >= 97 && i <= 122) {
            // Lowercase letters
            description = `Lowercase ${char}`;
            category = 'letters';
        } else if (i >= 123 && i <= 126) {
            // More symbols
            description = getSymbolDescription(char);
            category = 'symbols';
        } else {
            // Extended ASCII
            description = `Extended ASCII ${i}`;
            category = 'printable';
        }

        asciiData.push({
            decimal: i,
            hex: i.toString(16).toUpperCase().padStart(2, '0'),
            binary: i.toString(2).padStart(8, '0'),
            char: displayChar,
            description: description,
            category: category
        });
    }
}

// Get symbol descriptions
function getSymbolDescription(char) {
    const descriptions = {
        '!': 'Exclamation Mark',
        '"': 'Double Quote',
        '#': 'Hash/Pound',
        '$': 'Dollar Sign',
        '%': 'Percent Sign',
        '&': 'Ampersand',
        "'": 'Single Quote',
        '(': 'Left Parenthesis',
        ')': 'Right Parenthesis',
        '*': 'Asterisk',
        '+': 'Plus Sign',
        ',': 'Comma',
        '-': 'Hyphen/Minus',
        '.': 'Period/Dot',
        '/': 'Forward Slash',
        ':': 'Colon',
        ';': 'Semicolon',
        '<': 'Less Than',
        '=': 'Equals Sign',
        '>': 'Greater Than',
        '?': 'Question Mark',
        '@': 'At Sign',
        '[': 'Left Square Bracket',
        '\\': 'Backslash',
        ']': 'Right Square Bracket',
        '^': 'Caret',
        '_': 'Underscore',
        '`': 'Backtick',
        '{': 'Left Curly Brace',
        '|': 'Pipe/Vertical Bar',
        '}': 'Right Curly Brace',
        '~': 'Tilde'
    };
    return descriptions[char] || `Symbol ${char}`;
}

// Render ASCII table
function renderAsciiTable(data = asciiData) {
    asciiTableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.decimal}</td>
            <td>0x${item.hex}</td>
            <td>${item.binary}</td>
            <td class="char-cell ${item.category === 'control' ? 'control-char' : ''}">${item.char}</td>
            <td>${item.description}</td>
            <td><span class="category-badge category-${item.category}">${item.category}</span></td>
        `;
        
        asciiTableBody.appendChild(row);
    });
}

// Filter ASCII data
function filterAsciiData(category, searchTerm = '') {
    let filteredData = asciiData;
    
    // Filter by category
    if (category !== 'all') {
        filteredData = filteredData.filter(item => item.category === category);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filteredData = filteredData.filter(item => 
            item.char.toLowerCase().includes(term) ||
            item.description.toLowerCase().includes(term) ||
            item.decimal.toString().includes(term) ||
            item.hex.toLowerCase().includes(term) ||
            item.binary.includes(term)
        );
    }
    
    renderAsciiTable(filteredData);
}

// Convert between different number systems
function convertValue(value, fromType) {
    let decimal;
    
    try {
        switch (fromType) {
            case 'char':
                if (value.length === 0) return null;
                decimal = value.charCodeAt(0);
                break;
            case 'decimal':
                decimal = parseInt(value);
                if (isNaN(decimal) || decimal < 0 || decimal > 255) return null;
                break;
            case 'hex':
                decimal = parseInt(value, 16);
                if (isNaN(decimal) || decimal < 0 || decimal > 255) return null;
                break;
            case 'binary':
                decimal = parseInt(value, 2);
                if (isNaN(decimal) || decimal < 0 || decimal > 255) return null;
                break;
            default:
                return null;
        }
        
        const char = String.fromCharCode(decimal);
        const hex = decimal.toString(16).toUpperCase().padStart(2, '0');
        const binary = decimal.toString(2).padStart(8, '0');
        
        return {
            char: decimal <= 31 || decimal === 127 ? `[${getControlCharName(decimal)}]` : char,
            decimal: decimal,
            hex: hex,
            binary: binary
        };
    } catch (error) {
        return null;
    }
}

// Get control character name
function getControlCharName(decimal) {
    const controlChars = {
        0: 'NULL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
        8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
        16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4', 21: 'NAK', 22: 'SYN', 23: 'ETB',
        24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 30: 'RS', 31: 'US',
        127: 'DEL'
    };
    return controlChars[decimal] || 'CTRL';
}

// Update converter inputs
function updateConverterInputs(result, skipInput = null) {
    if (!result) return;
    
    if (skipInput !== 'char' && charInput) {
        charInput.value = result.char.startsWith('[') ? '' : result.char;
    }
    if (skipInput !== 'decimal' && decInput) {
        decInput.value = result.decimal;
    }
    if (skipInput !== 'hex' && hexInput) {
        hexInput.value = result.hex;
    }
    if (skipInput !== 'binary' && binInput) {
        binInput.value = result.binary;
    }
    
    // Update result display
    if (converterResult) {
        converterResult.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; text-align: center;">
                <div>
                    <strong>Character:</strong><br>
                    <code style="background: #e9ecef; padding: 5px 10px; border-radius: 4px; font-size: 1.1rem;">${result.char}</code>
                </div>
                <div>
                    <strong>Decimal:</strong><br>
                    <code style="background: #e9ecef; padding: 5px 10px; border-radius: 4px; font-size: 1.1rem;">${result.decimal}</code>
                </div>
                <div>
                    <strong>Hex:</strong><br>
                    <code style="background: #e9ecef; padding: 5px 10px; border-radius: 4px; font-size: 1.1rem;">0x${result.hex}</code>
                </div>
                <div>
                    <strong>Binary:</strong><br>
                    <code style="background: #e9ecef; padding: 5px 10px; border-radius: 4px; font-size: 1.1rem;">${result.binary}</code>
                </div>
            </div>
        `;
        converterResult.classList.add('active');
    }
}

// Event listeners
function initEventListeners() {
    // Navbar functionality
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.filter-btn.active');
            const category = activeFilter ? activeFilter.dataset.category : 'all';
            filterAsciiData(category, e.target.value);
        });
    }

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Filter data
            const category = e.target.dataset.category;
            const searchTerm = searchInput ? searchInput.value : '';
            filterAsciiData(category, searchTerm);
        });
    });

    // Converter inputs
    if (charInput) {
        charInput.addEventListener('input', (e) => {
            if (e.target.value.length > 1) {
                e.target.value = e.target.value.slice(0, 1);
            }
            const result = convertValue(e.target.value, 'char');
            if (result) {
                updateConverterInputs(result, 'char');
            }
        });
    }

    if (decInput) {
        decInput.addEventListener('input', (e) => {
            const result = convertValue(e.target.value, 'decimal');
            if (result) {
                updateConverterInputs(result, 'decimal');
            }
        });
    }

    if (hexInput) {
        hexInput.addEventListener('input', (e) => {
            const result = convertValue(e.target.value, 'hex');
            if (result) {
                updateConverterInputs(result, 'hex');
            }
        });
    }

    if (binInput) {
        binInput.addEventListener('input', (e) => {
            const result = convertValue(e.target.value, 'binary');
            if (result) {
                updateConverterInputs(result, 'binary');
            }
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbar && !navbar.contains(e.target)) {
            if (navbarToggle) navbarToggle.classList.remove('active');
            if (navbarMenu) navbarMenu.classList.remove('active');
        }
    });
}

// Initialize the application
function init() {
    initAsciiData();
    renderAsciiTable();
    initEventListeners();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);