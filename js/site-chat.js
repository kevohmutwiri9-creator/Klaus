(() => {
    if (document.getElementById('site-chat-launcher')) return;

    const widget = document.createElement('div');
    widget.className = 'site-chat-widget';
    widget.innerHTML = `
        <button class="site-chat-launcher" id="site-chat-launcher" type="button" aria-label="Open chat with Klaus" aria-controls="site-chat-panel" aria-expanded="false">
            <span aria-hidden="true"></span>
        </button>
        <section class="site-chat-panel" id="site-chat-panel" role="dialog" aria-labelledby="site-chat-title" aria-hidden="true" hidden>
            <header class="site-chat-header">
                <div>
                    <h2 id="site-chat-title">Ask about my work</h2>
                    <p>Messages go to Groq. Don't share sensitive information.</p>
                </div>
                <button class="site-chat-close" id="site-chat-close" type="button" aria-label="Close chat">&times;</button>
            </header>
            <div class="site-chat-messages" id="site-chat-messages" role="log" aria-live="polite" aria-relevant="additions text">
                <p class="site-chat-message site-chat-message-assistant">Hi! Ask me about my projects, skills, tutorials, or how to get in touch.</p>
            </div>
            <form class="site-chat-form" id="site-chat-form">
                <label class="site-chat-sr-only" for="site-chat-input">Your message</label>
                <textarea id="site-chat-input" name="message" rows="2" maxlength="2000" placeholder="Write a message..." required></textarea>
                <div class="site-chat-form-bottom">
                    <span class="site-chat-status" id="site-chat-status" role="status" aria-live="polite">Enter to send, Shift+Enter for a new line</span>
                    <button class="site-chat-send" id="site-chat-send" type="submit" aria-label="Send message">
                        <span aria-hidden="true">&#10148;</span>
                    </button>
                </div>
            </form>
        </section>
    `;
    document.body.append(widget);

    const launcher = widget.querySelector('#site-chat-launcher');
    const panel = widget.querySelector('#site-chat-panel');
    const closeButton = widget.querySelector('#site-chat-close');
    const messagesElement = widget.querySelector('#site-chat-messages');
    const form = widget.querySelector('#site-chat-form');
    const input = widget.querySelector('#site-chat-input');
    const sendButton = widget.querySelector('#site-chat-send');
    const status = widget.querySelector('#site-chat-status');
    const history = [];

    const setOpen = (open, restoreFocus = false) => {
        panel.hidden = !open;
        panel.setAttribute('aria-hidden', String(!open));
        launcher.setAttribute('aria-expanded', String(open));
        launcher.setAttribute('aria-label', open ? 'Close chat with Klaus' : 'Open chat with Klaus');
        if (open) input.focus();
        else if (restoreFocus) launcher.focus();
    };

    const appendMessage = (role, content) => {
        const message = document.createElement('p');
        message.className = `site-chat-message site-chat-message-${role}`;
        message.textContent = content;
        messagesElement.append(message);
        messagesElement.scrollTop = messagesElement.scrollHeight;
    };

    launcher.addEventListener('click', () => {
        setOpen(panel.hidden);
    });
    closeButton.addEventListener('click', () => setOpen(false, true));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !panel.hidden) setOpen(false, true);
        if (event.key === 'Enter' && !event.shiftKey && document.activeElement === input) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const content = input.value.trim();
        if (!content || sendButton.disabled) return;

        input.value = '';
        appendMessage('user', content);
        history.push({ role: 'user', content });
        history.splice(0, Math.max(0, history.length - 12));
        sendButton.disabled = true;
        status.textContent = 'Thinking...';

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
                signal: AbortSignal.timeout(25000)
            });
            const result = await response.json().catch(() => null);
            if (!result || typeof result !== 'object') {
                throw new Error('Chat needs Netlify Functions. Start the site with Netlify Dev and try again.');
            }
            if (!response.ok) throw new Error(result.error || 'The assistant could not respond.');
            if (typeof result.reply !== 'string' || !result.reply.trim()) {
                throw new Error('The assistant returned an empty response.');
            }

            appendMessage('assistant', result.reply.trim());
            history.push({ role: 'assistant', content: result.reply.trim() });
            history.splice(0, Math.max(0, history.length - 12));
            status.textContent = '';
        } catch (error) {
            appendMessage('assistant', error.name === 'TimeoutError'
                ? 'That took too long. Please try again.'
                : error.message || 'Chat is unavailable right now. Please try again later.');
            status.textContent = 'Message not sent';
        } finally {
            sendButton.disabled = false;
            input.focus();
        }
    });
})();
