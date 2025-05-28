document.addEventListener('DOMContentLoaded', function () {
    const GEO_API_URL = 'http://ip-api.com/json/?fields=status,countryCode';
    const IP_LANG_REDIRECTED_KEY = 'ipLangRedirected';

    // Map country codes to your language codes
    const countryToLangMap = {
        'GB': 'en', // United Kingdom
        'US': 'en', // United States
        'BG': 'bg', // Bulgaria
        'DE': 'de', // Germany
        'FR': 'fr', // France
        'ES': 'es', // Spain
        'IT': 'it', // Italy
        'RU': 'ru', // Russia
        'TR': 'tr', // Turkey
        'IN': 'in'  // India
        // Add more mappings as needed
    };

    // Language prefixes used in your URLs (e.g., 'de-' for German)
    const langUrlPrefixes = {
        'en': '', // English is the default, no prefix
        'bg': 'bg-',
        'de': 'de-',
        'fr': 'fe-', // As per your language-selector.js
        'es': 'esp-',// As per your language-selector.js
        'it': 'it-',
        'ru': 'russ-',// As per your language-selector.js
        'tr': 'tr-',
        'in': 'hi-' // As per your language-selector.js
    };

    function getCurrentPageName() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1] || 'index.html';
    }

    function getCurrentLangFromUrl() {
        const currentPage = getCurrentPageName();
        for (const lang in langUrlPrefixes) {
            if (langUrlPrefixes[lang] && currentPage.startsWith(langUrlPrefixes[lang])) {
                return lang;
            }
        }
        // Check if it's a non-prefixed page (could be English or needs detection)
        // A more robust check might be needed if 'index.html' could be 'en-index.html'
        // For now, if no known prefix, assume it might be English or default.
        let isPotentiallyEnglish = true;
        for (const lang in langUrlPrefixes) {
            if (langUrlPrefixes[lang] && currentPage.startsWith(langUrlPrefixes[lang]) && lang !== 'en') {
                isPotentiallyEnglish = false;
                break;
            }
        }
        return isPotentiallyEnglish ? 'en' : null; // Return 'en' if no other prefix matches
    }


    async function detectAndSetLanguage() {
        // Prevent redirect loops or overriding user's manual selection within the session
        if (sessionStorage.getItem(IP_LANG_REDIRECTED_KEY)) {
            console.log('IP-based language redirect already attempted this session.');
            return;
        }

        try {
            const response = await fetch(GEO_API_URL);
            if (!response.ok) {
                console.error('Failed to fetch IP geolocation:', response.statusText);
                return;
            }
            const data = await response.json();

            if (data.status === 'success' && data.countryCode) {
                const detectedLang = countryToLangMap[data.countryCode.toUpperCase()];
                const currentLang = getCurrentLangFromUrl();
                const currentPage = getCurrentPageName();
                
                console.log('Detected country:', data.countryCode, 'Mapped lang:', detectedLang);
                console.log('Current URL lang:', currentLang, 'Current page:', currentPage);

                if (detectedLang && detectedLang !== currentLang) {
                    const targetPrefix = langUrlPrefixes[detectedLang];
                    let currentPrefix = '';
                    if (currentLang && langUrlPrefixes[currentLang]) {
                        currentPrefix = langUrlPrefixes[currentLang];
                    }
                    
                    let basePageName = currentPage;
                    if (currentPrefix && currentPage.startsWith(currentPrefix)) {
                        basePageName = currentPage.substring(currentPrefix.length);
                    }

                    const newPageName = targetPrefix + basePageName;
                    const newPath = window.location.pathname.replace(currentPage, newPageName);

                    // Basic check if such a file might exist (e.g., 'de-index.html')
                    // This is a simplified check. A HEAD request would be more reliable but complex.
                    if (newPageName !== currentPage) {
                        console.log(`Attempting to redirect to: ${newPath}`);
                        sessionStorage.setItem(IP_LANG_REDIRECTED_KEY, 'true');
                        window.location.pathname = newPath;
                    } else {
                        console.log('Already on the correct or base language page.');
                        // Still mark as attempted to avoid re-running logic unnecessarily
                         sessionStorage.setItem(IP_LANG_REDIRECTED_KEY, 'true');
                    }
                } else if (detectedLang && detectedLang === currentLang) {
                    console.log('IP detected language matches current URL language.');
                     sessionStorage.setItem(IP_LANG_REDIRECTED_KEY, 'true'); // Mark as processed
                } else {
                    console.log('No specific language mapping for country or already on appropriate page.');
                     sessionStorage.setItem(IP_LANG_REDIRECTED_KEY, 'true'); // Mark as processed
                }
            } else {
                console.error('IP geolocation API error:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error during IP geolocation or redirect:', error);
        }
    }

    detectAndSetLanguage();
}); 