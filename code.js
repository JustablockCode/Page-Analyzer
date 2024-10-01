(async () => {
    const api_url = 'https://proxy.mubilop.tech/v1/chat/completions';

async function fetchAndGetReqModels() {
        try {
            const response = await fetch(api_url.replace('/chat/completions', '/models'));
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();

            // Filter the models based on type "chat.completions"
            return data.data
                .filter(model => model.type === "chat.completions")  // Only include "chat.completions" models
                .map(model => ({ text: model.id, value: model.id }));  // Map to desired structure
        } catch (error) {
            return [];
        }
    }


    function createButton(text, bgColor, textColor, hoverColor) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            marginTop: '10px',
            padding: '5px 10px',
            backgroundColor: bgColor,
            color: textColor,
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
            transition: 'background-color 0.3s, transform 0.2s',
        });

        button.onmouseover = () => {
            button.style.backgroundColor = hoverColor;
            button.style.transform = 'scale(1.05)';
        };

        button.onmouseout = () => {
            button.style.backgroundColor = bgColor;
            button.style.transform = 'scale(1)';
        };

        return button;
    }

    function showModelSelectionModal(models) {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            zIndex: '10000',
            maxHeight: '80%',
            overflowY: 'auto',
            color: 'black',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        });

        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '5px';
        select.style.color = 'black';
        select.style.backgroundColor = 'white';
        select.style.border = '1px solid black';

        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            select.appendChild(option);
        });

        const button = createButton('Select Model', '#4CAF50', 'white', '#45a049');

        const heading = document.createElement('h2');
        heading.textContent = 'Select a Model';
        heading.style.color = 'black';

        modal.appendChild(heading);
        modal.appendChild(select);
        modal.appendChild(document.createElement('br'));
        modal.appendChild(button);

        document.body.appendChild(modal);

        return new Promise((resolve) => {
            button.onclick = () => {
                const selectedModel = select.value;
                document.body.removeChild(modal);
                resolve(selectedModel);
            };
        });
    }

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

    function showInputModal() {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            zIndex: '10000',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        });

        const input = document.createElement('textarea');
        input.placeholder = 'Add any additional comments or context (optional)';
        input.style.width = '100%';
        input.style.height = '100px';
        input.style.marginBottom = '10px';

        const button = createButton('Submit', '#4CAF50', 'white', '#45a049');

        modal.appendChild(input);
        modal.appendChild(document.createElement('br'));
        modal.appendChild(button);

        document.body.appendChild(modal);

        return new Promise((resolve) => {
            button.onclick = () => {
                const additionalComments = input.value.trim();
                document.body.removeChild(modal);
                resolve(additionalComments);
            };
        });
    }

    const additionalComments = await showInputModal();

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
                    { role: "user", content: "You are a browser console code that analyzes a webpage and provides answers. You have no memory, and you must respond in the language of the webpage or the language of the user's input. If the user asks a question in a specific language or if the webpage is in a certain language, respond in that language, not in English by default. Your developer is Justablock. Here is the webpage content and the user's message for your analysis: If sending *text*, it won't show 'fat', and neither `code` nor anything else like that will work." },
                    ...messages
                ]
            }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content;

        const resultModal = document.createElement('div');
        Object.assign(resultModal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black',
            zIndex: '10000',
            maxHeight: '80%',
            overflowY: 'auto',
            color: 'black',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        });

        const responseHeading = document.createElement('h2');
        responseHeading.textContent = "AI Analysis And Answer:";

        const responseParagraph = document.createElement('p');
        responseParagraph.textContent = botResponse;

        const closeButton = createButton("Close", '#f44336', 'white', '#e53935');

        resultModal.appendChild(responseHeading);
        resultModal.appendChild(responseParagraph);
        resultModal.appendChild(closeButton);

        document.body.appendChild(resultModal);

        closeButton.onclick = () => document.body.removeChild(resultModal);

    } catch (error) {
        alert("Error sending prompt to AI: " + error.message);
    }
})();
