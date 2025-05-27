document.addEventListener('DOMContentLoaded', function () {
    const langDropdown = document.getElementById('footer-language-dropdown');
    const flagImg = document.getElementById('footer-flag');
    const flagLabel = document.getElementById('footer-flag-label');

    if (langDropdown) {
        // Set initial selected language based on current page URL
        const currentPath = window.location.pathname;
        const currentLang = getCurrentLanguageFromPath(currentPath);
        if (currentLang) {
            langDropdown.value = currentLang;
            updateFlagAndLabel();
            // Update links on initial load
            updateNavigationLinks(currentLang);
        }

        // Add change event listener
        langDropdown.addEventListener('change', function () {
            updateFlagAndLabel();
            redirectToLanguageVersion();
        });
    }

    function getCurrentLanguageFromPath(path) {
        const langPrefixes = {
            '/bg-': 'bg',
            '/de-': 'de',
            '/fe-': 'fr',
            '/esp-': 'es',
            '/it-': 'it',
            '/hi-': 'in',
            '/russ-': 'ru',
            '/tr-': 'tr'
        };

        for (const [prefix, lang] of Object.entries(langPrefixes)) {
            if (path.includes(prefix)) {
                return lang;
            }
        }
        return 'en'; // Default to English if no language prefix found
    }

    function updateFlagAndLabel() {
        const selectedOption = langDropdown.options[langDropdown.selectedIndex];
        const flagPath = selectedOption.getAttribute('data-flag');
        const langName = selectedOption.textContent.trim();

        if (flagImg && flagPath) {
            flagImg.src = flagPath;
            flagImg.alt = langName + " Flag";
        }
        if (flagLabel) {
            flagLabel.textContent = langName;
        }
    }

    function updateNavigationLinks(selectedLang) {
        // Update all navigation links to point to the correct language version
        const allLinks = document.querySelectorAll('a[href]');
        const langPrefixes = ['bg-', 'de-', 'fe-', 'esp-', 'it-', 'hi-', 'russ-', 'tr-'];

        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Skip external links and pure hash links
            if (!href || href.startsWith('http') || href.startsWith('//') || href === '#') {
                return;
            }

            // Split href into filename and hash parts
            let [filename, ...hashParts] = href.split('#');
            let hash = hashParts.length > 0 ? '#' + hashParts.join('#') : '';

            // If it's just a hash link on the current page, skip it
            if (!filename && hash) {
                return;
            }

            // If filename is empty (current page), use current page name
            if (!filename) {
                filename = window.location.pathname.split('/').pop() || 'index.html';
            }

            // Remove any existing language prefix
            let baseFilename = filename;
            for (const prefix of langPrefixes) {
                if (baseFilename.startsWith(prefix)) {
                    baseFilename = baseFilename.substring(prefix.length);
                    break;
                }
            }

            // Add new language prefix if not English
            let newHref;
            if (selectedLang === 'en') {
                newHref = baseFilename;
            } else {
                const langPrefix = {
                    'bg': 'bg-',
                    'de': 'de-',
                    'fr': 'fe-',
                    'es': 'esp-',
                    'it': 'it-',
                    'in': 'hi-',
                    'ru': 'russ-',
                    'tr': 'tr-'
                }[selectedLang];
                newHref = langPrefix + baseFilename;
            }

            // Reattach hash if it exists
            if (hash) {
                newHref += hash;
            }

            link.setAttribute('href', newHref);
        });
    }

    function redirectToLanguageVersion() {
        const selectedLang = langDropdown.value;
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';
        let newPath;

        // Remove any existing language prefix
        let baseFile = currentFile;
        const langPrefixes = ['bg-', 'de-', 'fe-', 'esp-', 'it-', 'hi-', 'russ-', 'tr-'];
        for (const prefix of langPrefixes) {
            if (currentFile.startsWith(prefix)) {
                baseFile = currentFile.substring(prefix.length);
                break;
            }
        }

        // Construct new path based on selected language
        if (selectedLang === 'en') {
            newPath = baseFile;
        } else {
            const langPrefix = {
                'bg': 'bg-',
                'de': 'de-',
                'fr': 'fe-',
                'es': 'esp-',
                'it': 'it-',
                'in': 'hi-',
                'ru': 'russ-',
                'tr': 'tr-'
            }[selectedLang];
            newPath = langPrefix + baseFile;
        }

        // Update all navigation links before redirecting
        updateNavigationLinks(selectedLang);

        // Redirect to new URL
        if (newPath && newPath !== currentFile) {
            window.location.href = newPath;
        }
    }
}); 