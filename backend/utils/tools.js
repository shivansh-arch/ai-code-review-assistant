// Evaluates basic math expressions
function calculatorTool(expression) {
    try {
        // Warning: In a real production app, never use eval directly with user input.
        // Use a safe math expression parser like mathjs.
        // Doing this here for simplicity only.
        const sanitized = expression.replace(/[^0-9+\-*/(). ]/g, '');
        if (!sanitized) return "Invalid expression format.";
        
        const result = eval(sanitized);
        return `The result is ${result}`;
    } catch (e) {
        return "I could not calculate that expression.";
    }
}

// Returns the current time
function timeTool() {
    const now = new Date();
    return `The current time is ${now.toLocaleTimeString()} and the date is ${now.toLocaleDateString()}.`;
}

module.exports = {
    calculatorTool,
    timeTool
};
