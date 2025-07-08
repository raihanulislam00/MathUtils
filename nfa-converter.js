// Regex to NFA Converter (Thompson's Construction for simple regex)
// Supports: a-z, 0-9, |, *, and parentheses

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('regexForm');
    const input = document.getElementById('regexInput');
    const output = document.getElementById('nfaOutput');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const regex = input.value.trim();
        if (!regex) return;
        try {
            const nfa = regexToNFA(regex);
            output.innerHTML = renderNFA(nfa);
        } catch (err) {
            output.innerHTML = `<div style='color:red;'>${err.message}</div>`;
        }
    });
});

// NFA State
class State {
    constructor() {
        this.transitions = [];
        this.id = State.nextId++;
    }
}
State.nextId = 0;

// NFA Fragment
class Fragment {
    constructor(start, accepts) {
        this.start = start;
        this.accepts = accepts; // array of accept states
    }
}

// Main Thompson's Construction
function regexToNFA(regex) {
    State.nextId = 0;
    const postfix = toPostfix(regex);
    const stack = [];
    for (const token of postfix) {
        if (token === '*') {
            // Kleene star
            const frag = stack.pop();
            const start = new State();
            const accept = new State();
            start.transitions.push({ symbol: 'ε', state: frag.start });
            start.transitions.push({ symbol: 'ε', state: accept });
            for (const a of frag.accepts) {
                a.transitions.push({ symbol: 'ε', state: frag.start });
                a.transitions.push({ symbol: 'ε', state: accept });
            }
            stack.push(new Fragment(start, [accept]));
        } else if (token === '|') {
            // Alternation
            const frag2 = stack.pop();
            const frag1 = stack.pop();
            const start = new State();
            const accept = new State();
            start.transitions.push({ symbol: 'ε', state: frag1.start });
            start.transitions.push({ symbol: 'ε', state: frag2.start });
            for (const a of frag1.accepts) a.transitions.push({ symbol: 'ε', state: accept });
            for (const a of frag2.accepts) a.transitions.push({ symbol: 'ε', state: accept });
            stack.push(new Fragment(start, [accept]));
        } else if (token === '.') {
            // Concatenation
            const frag2 = stack.pop();
            const frag1 = stack.pop();
            for (const a of frag1.accepts) a.transitions.push({ symbol: 'ε', state: frag2.start });
            stack.push(new Fragment(frag1.start, frag2.accepts));
        } else {
            // Symbol
            const start = new State();
            const accept = new State();
            start.transitions.push({ symbol: token, state: accept });
            stack.push(new Fragment(start, [accept]));
        }
    }
    if (stack.length !== 1) throw new Error('Invalid regex');
    return stack[0];
}

// Convert infix regex to postfix (Shunting Yard, supports |, *, ., and parentheses)
function toPostfix(regex) {
    const output = [];
    const stack = [];
    const precedence = { '|': 1, '.': 2, '*': 3 };
    let prev = null;
    for (let i = 0; i < regex.length; i++) {
        const c = regex[i];
        if (c === '(') {
            if (prev && (isSymbol(prev) || prev === ')')) {
                // Implicit concat
                while (stack.length && precedence[stack[stack.length-1]] >= precedence['.']) output.push(stack.pop());
                stack.push('.');
            }
            stack.push(c);
        } else if (c === ')') {
            while (stack.length && stack[stack.length-1] !== '(') output.push(stack.pop());
            stack.pop();
        } else if (c === '*') {
            output.push(c);
        } else if (c === '|') {
            while (stack.length && precedence[stack[stack.length-1]] >= precedence[c]) output.push(stack.pop());
            stack.push(c);
        } else {
            if (prev && (isSymbol(prev) || prev === ')')) {
                // Implicit concat
                while (stack.length && precedence[stack[stack.length-1]] >= precedence['.']) output.push(stack.pop());
                stack.push('.');
            }
            output.push(c);
        }
        prev = c;
    }
    while (stack.length) output.push(stack.pop());
    return output;
}

function isSymbol(c) {
    return /^[a-zA-Z0-9]$/.test(c);
}

// Render NFA as a list of states and transitions
function renderNFA(frag) {
    const visited = new Set();
    const lines = [];
    function dfs(state) {
        if (visited.has(state.id)) return;
        visited.add(state.id);
        for (const t of state.transitions) {
            lines.push(`q${state.id} --${t.symbol}→ q${t.state.id}`);
            dfs(t.state);
        }
    }
    dfs(frag.start);
    let html = `<div><b>Start state:</b> q${frag.start.id}</div>`;
    html += `<div><b>Accept state(s):</b> ${frag.accepts.map(s => 'q'+s.id).join(', ')}</div>`;
    html += '<pre style="margin-top:10px;">' + lines.join('\n') + '</pre>';
    return html;
} 