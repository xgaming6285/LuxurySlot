document.addEventListener('DOMContentLoaded', function() {
    // Get all links in the footer
    const footerLinks = document.querySelectorAll('.footer-links a');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            
            // Skip if it's an external link or a hash link
            if (href.startsWith('http') || href.startsWith('//') || href === '#') {
                window.location.href = href;
                return;
            }
            
            // Get the current language prefix from the URL
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop() || 'index.html';
            let currentLang = '';
            
            // Check for language prefix in current URL
            const langPrefixes = {
                'bg-': 'bg',
                'de-': 'de',
                'fe-': 'fr',
                'esp-': 'es',
                'it-': 'it',
                'hi-': 'in',
                'russ-': 'ru',
                'tr-': 'tr'
            };
            
            for (const [prefix, lang] of Object.entries(langPrefixes)) {
                if (currentFile.startsWith(prefix)) {
                    currentLang = lang;
                    break;
                }
            }
            
            // Construct the target URL with the current language prefix
            let targetUrl = href;
            if (currentLang && currentLang !== 'en') {
                const langPrefix = Object.entries(langPrefixes).find(([_, lang]) => lang === currentLang)?.[0];
                if (langPrefix) {
                    // Remove any existing language prefix from the href
                    let baseHref = href;
                    for (const prefix of Object.keys(langPrefixes)) {
                        if (baseHref.startsWith(prefix)) {
                            baseHref = baseHref.substring(prefix.length);
                            break;
                        }
                    }
                    targetUrl = langPrefix + baseHref;
                }
            }
            
            // Try to fetch the target page
            fetch(targetUrl)
                .then(response => {
                    if (response.ok) {
                        // If the page exists, navigate to it
                        window.location.href = targetUrl;
                    } else {
                        // If the page doesn't exist, redirect to the homepage of the current language
                        const homepage = currentLang ? `${Object.entries(langPrefixes).find(([_, lang]) => lang === currentLang)?.[0]}index.html` : 'index.html';
                        window.location.href = homepage;
                    }
                })
                .catch(() => {
                    // If there's an error fetching, redirect to the homepage
                    const homepage = currentLang ? `${Object.entries(langPrefixes).find(([_, lang]) => lang === currentLang)?.[0]}index.html` : 'index.html';
                    window.location.href = homepage;
                });
        });
    });
}); 