## This is javascript code for the browser console that will use cicerorph's API(thanks to cicerorph)) to tell GPT the contents of the page and return the analyzed string.
### Getting code:
You can just copy code.js file, you can copy short PASTETHIS.js file or you can copy this: 
```
(function() {
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
```

### Usage:
1. Open console(on windows: ctr + shift + i and then press console)
2. Paste the code into the browser console.
3. Press enter.
4. Choose model(If you get error 500 then choose another model).
5. Input additional string(optional)
6. Wait for GPT to answer!

### Usage 2:
1. Create new bookmark.
2. In bookmark link put
```
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

```
3. Choose model(If you get error 500 then choose another model).
4. Input additional string(optional)
5. Wait for GPT to answer!

### After usage:
1. Press button "Close" on bottom of popup.

### Extra:
If you find any bugs then report them in the issues tab!
Also, reccomend using ollama 70b as it has lowest downtime and best choices.
You wont be able to use it in some websites so if you are not then paste code from code.js instead(It is not able to fix the court code but in update v4 I fixed so long code is able to run in almost every website).
