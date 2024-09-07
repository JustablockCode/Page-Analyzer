(async () => {
    const api_url = 'https://reverse.mubi.tech/v1/chat/completions';
    const model = 'gpt-4o';

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
                model: model,
                messages: messages
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
        modal.style.color = 'black'; // Set text color to black
        modal.innerHTML = `
            <h2>GPT-4 Analysis</h2>
            <p>${botResponse}</p>
            <button id="closeModal" style="margin-top: 10px; padding: 5px 10px; background-color: #f44336; color: white; border: none; cursor: pointer;">Close</button>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeModal').onclick = () => document.body.removeChild(modal);

    } catch (error) {
        alert("Error sending prompt to GPT: " + error.message);
    }
})();
