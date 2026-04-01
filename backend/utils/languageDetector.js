// Simple heuristic to detect Hindi text versus English
// Looks for Devangari characters
function detectLanguage(text) {
    if (!text) return 'English';
    
    // Check for Devanagari block Unicode range
    const hindiRegex = /[\u0900-\u097F]/;
    
    if (hindiRegex.test(text)) {
        return 'Hindi';
    }
    
    return 'English';
}

module.exports = {
    detectLanguage
};
