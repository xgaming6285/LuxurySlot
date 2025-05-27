import os
import re

def update_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the inline language selector script
    content = re.sub(
        r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\',\s*function\s*\(\)\s*{\s*const\s*langDropdown\s*=\s*document\.getElementById\(\'footer-language-dropdown\'\);.*?}\);\s*</script>',
        '',
        content,
        flags=re.DOTALL
    )

    # Add the language-selector.js script before the closing body tag if it's not already there
    if 'language-selector.js' not in content:
        content = content.replace(
            '</body>',
            '    <script src="js/language-selector.js" defer></script>\n</body>'
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    # Get all HTML files in the current directory
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    # Update each HTML file
    for html_file in html_files:
        print(f'Updating {html_file}...')
        update_html_file(html_file)
        print(f'Updated {html_file}')

if __name__ == '__main__':
    main() 