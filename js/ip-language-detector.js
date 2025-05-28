document.addEventListener('DOMContentLoaded', function () {
    const AUTO_LANG_REDIRECTED_KEY = 'autoLangRedirectedV2'; // Changed key to ensure fresh run

    // Language prefixes used in your URLs (e.g., 'de-' for German)
    const langUrlPrefixes = {
        'en': '',    // English is the default, no prefix
        'bg': 'bg-',
        'de': 'de-',
        'fr': 'fe-', // As per your language-selector.js
        'es': 'esp-',// As per your language-selector.js
        'it': 'it-',
        'ru': 'russ-',// As per your language-selector.js
        'tr': 'tr-',
        'in': 'hi-'  // Hindi (India) uses 'hi-' prefix as per language-selector.js
    };

    function getCurrentPageName() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1] || 'index.html';
    }

    function getCurrentLangFromUrl() {
        const currentPage = getCurrentPageName();
        for (const lang in langUrlPrefixes) {
            // Skip 'en' in this initial check because its prefix is empty.
            // We are looking for pages that explicitly start with a language prefix.
            if (lang === 'en') continue; 
            
            if (langUrlPrefixes[lang] && currentPage.startsWith(langUrlPrefixes[lang])) {
                return lang; // Returns 'de', 'bg', etc. for prefixed pages
            }
        }
        // If no other language prefix is found, assume it's English (default).
        return 'en'; 
    }
    
    function getBrowserPreferredLanguage() {
        const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];
        if (browserLangs && browserLangs.length > 0) {
            // Get the primary language code, e.g., 'en' from 'en-US'
            let lang = browserLangs[0].split('-')[0].toLowerCase(); 
            
            // Handle cases where browser language code might differ from your site's convention
            // For example, browser might report 'hi' for Hindi. Your site uses 'in' for the 'hi-' prefix.
            if (lang === 'hi') {
                return 'in'; // Map browser 'hi' to your site's 'in' (for 'hi-' prefix)
            }
            // Add other mappings here if necessary
            // e.g. if (lang === 'nb') return 'no'; // Norwegian Bokmål to general Norwegian

            return lang;
        }
        return null; // No language preference found
    }

    function setLanguageByBrowserPreference() {
        // Check if we've already tried to set language this session
        if (sessionStorage.getItem(AUTO_LANG_REDIRECTED_KEY)) {
            console.log('Browser-based language redirect already attempted this session.');
            return;
        }

        const preferredBrowserLang = getBrowserPreferredLanguage();
        const currentUrlLang = getCurrentLangFromUrl();
        const currentPageName = getCurrentPageName();

        console.log('Browser preferred language code:', preferredBrowserLang);
        console.log('Current page language based on URL:', currentUrlLang);
        console.log('Current page name:', currentPageName);

        if (preferredBrowserLang && langUrlPrefixes.hasOwnProperty(preferredBrowserLang)) {
            // If preferred browser language is supported and different from current page's language
            if (preferredBrowserLang !== currentUrlLang) {
                const targetPrefix = langUrlPrefixes[preferredBrowserLang];
                let basePageName = currentPageName;

                // Determine the base page name by removing the current language prefix (if any)
                const currentLangPrefix = langUrlPrefixes[currentUrlLang];
                if (currentLangPrefix && currentPageName.startsWith(currentLangPrefix)) {
                    basePageName = currentPageName.substring(currentLangPrefix.length);
                }
                
                const newPageName = targetPrefix + basePageName;
                
                // Ensure we are not trying to redirect to the same page name (e.g. if basePageName was empty)
                if (newPageName !== currentPageName && newPageName !== '') {
                    const currentPath = window.location.pathname;
                    const newPath = currentPath.substring(0, currentPath.lastIndexOf("/") + 1) + newPageName;

                    console.log(`Attempting redirect to: ${newPath} (based on browser preference: ${preferredBrowserLang})`);
                    sessionStorage.setItem(AUTO_LANG_REDIRECTED_KEY, 'true');
                    window.location.href = newPath; // Perform the redirect
                    return; 
                } else {
                     console.log('Calculated new page name is same as current, or empty. No redirect needed for browser preference.');
                }
            } else {
                console.log('Browser preferred language already matches the current page language. No redirect needed.');
            }
        } else {
            console.log('Browser preferred language (' + preferredBrowserLang + ') is not directly supported by a URL prefix or could not be determined. No redirect.');
        }
        
        // If no redirect happened, mark as processed for this session to prevent re-running.
        sessionStorage.setItem(AUTO_LANG_REDIRECTED_KEY, 'true');
    }

    setLanguageByBrowserPreference();

    /*
    // --- IP Geolocation (Commented out for now - was using ipinfo.io) ---
    // const GEO_API_URL = 'https://ipinfo.io/json';
    // const countryToLangMap = {
    //     'GB': 'en', 'US': 'en', 'BG': 'bg', 'DE': 'de', 'FR': 'fr', 
    //     'ES': 'es', 'IT': 'it', 'RU': 'ru', 'TR': 'tr', 'IN': 'in'
    // };

    // async function detectAndSetLanguageViaIP() { ... } 
    // detectAndSetLanguageViaIP(); 
    */
}); 