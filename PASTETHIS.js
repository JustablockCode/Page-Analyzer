javascript:(function() {
    fetch('https://raw.githubusercontent.com/JustablockCode/Page-Analyzer/main/code.js')
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch the script.');
            }
            return res.text();
        })
        .then(scriptContent => {
            try {
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                scriptElement.textContent = scriptContent;
                document.documentElement.appendChild(scriptElement);
              
                if (!scriptElement.parentNode) {
                    throw new Error('Script injection failed due to Trusted Types or CSP restrictions.');
                }
            } catch (e) {
                alert('Failed to execute the script: ' + e.message);
            }
        })
        .catch(error => {
            alert('Error fetching the script: ' + error.message);
        });
})();
