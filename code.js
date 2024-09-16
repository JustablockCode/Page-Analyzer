(async () => {
    const api_url = 'https://reverse.mubi.tech/v1/chat/completions';
    
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

    const models = await fetchAndGetReqModels();
    if (models.length === 0) {
        alert("No models available.");
        return;
    }
    
    const modelNames = models.map(model => model.text).join("\n");
    const selectedModel = prompt(`Available models:\n${modelNames}\n\nEnter the model ID you want to use:`, models[0].value);
    
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
        { role: "user", content: "You are a browser console code that analyzes page and answers... You have no memory but answer user with language he asks you question about or language of website given, so if user asks question on for example russian and page is on russian too then don't answer user on english but answer on russian. Your developer is justablock. Here is website code and message given by user:" },
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
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.border = '1px solid black';
        modal.style.zIndex = '10000';
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';
        modal.style.color = 'black';
        modal.innerHTML = `
            <h2>AI Analysis And Answer:</h2>
            <p>${botResponse}</p>
            <button id="closeModal" style="margin-top: 10px; padding: 5px 10px; background-color: #f44336; color: white; border: none; cursor: pointer;">Close</button>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);

    } catch (error) {
        alert("Error sending prompt to GPT: " + error.message);
    }
})();
