(async () => {
    const api_url = 'https://reverse.mubi.tech/v1/chat/completions';

    // Function to fetch available models
    async function fetchAndGetReqModels() {
        try {
            const response = await fetch(api_url.replace('/chat/completions', '/models'));
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            let models = [];
            data.data.forEach(model => {
                if (model.type !== "chat.completions") return;
                models.push({ text: model.id, value: model.id });
            });
            return models;
        } catch (error) {
            console.error("Error fetching models:", error);
            return [];
        }
    }

    // Create and display a modal with a dropdown for model selection
    function showModelSelectionModal(models) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white'; // Set background for light mode
        modal.style.padding = '20px';
        modal.style.border = '1px solid black';
        modal.style.zIndex = '10000';
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';
        modal.style.color = 'black'; // Text color for light mode
        modal.style.borderRadius = '8px'; // Optional for rounded corners
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Adds shadow for better visibility

        const modelOptions = models.map(model => `<option value="${model.value}">${model.text}</option>`).join('');

        modal.innerHTML = `
            <h2 style="color: black;">Select a Model</h2>
            <select id="modelSelect" style="width: 100%; padding: 5px; color: black; background-color: white; border: 1px solid black;">
                ${modelOptions}
            </select>
            <br>
            <button id="selectModelButton" style="margin-top: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">Select Model</button>
        `;

        document.body.appendChild(modal);

        return new Promise((resolve) => {
            document.getElementById('selectModelButton').onclick = () => {
                const selectedModel = document.getElementById('modelSelect').value;
                document.body.removeChild(modal);
                resolve(selectedModel);
            };
        });
    }

    // Fetch models and show the model selection modal
    const models = await fetchAndGetReqModels();
    if (models.length === 0) {
        alert("No models available.");
        return;
    }

    const selectedModel = await showModelSelectionModal(models);
    if (!selectedModel) {
        alert("No model selected.");
        return;
    }

    const content = document.body.innerText || document.body.textContent;

    let additionalComments = prompt("Add any additional comments or context (optional):", "");

    let messages = [{ role: "user", content }];
    if (additionalComments) {
        messages.push({ role: "user", content: additionalComments });
    }

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://gptcall.net/',
                'Referer': 'https://gptcall.net/'
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                    { role: "user", content: "You are a browser console code that analyzes a webpage and provides answers. You have no memory, and you must respond in the language of the webpage or the language of the user's input. If the user asks a question in a specific language or if the webpage is in a certain language, respond in that language, not in English by default. Your developer is Justablock. Here is the webpage content and the user's message for your analysis:" },
                    ...messages
                ]
            }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content;

        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white'; // Background for light mode
        modal.style.padding = '20px';
        modal.style.border = '1px solid black';
        modal.style.zIndex = '10000';
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';
        modal.style.color = 'black'; // Text color for light mode
        modal.style.borderRadius = '8px'; // Optional rounded corners
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'; // Adds shadow for better visibility
        modal.innerHTML = `
            <h2>AI Analysis And Answer:</h2>
            <p>${botResponse}</p>
            <button id="closeModal" style="margin-top: 10px; padding: 5px 10px; background-color: #f44336; color: white; border: none; cursor: pointer;">Close</button>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);

    } catch (error) {
        alert("Error sending prompt to AI: " + error.message);
    }
})();
