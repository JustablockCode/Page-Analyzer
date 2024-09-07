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
        console.log("GPT-4 Analysis:", botResponse);
    } catch (error) {
        console.error("Error sending prompt to GPT:", error.message);
    }
})();
