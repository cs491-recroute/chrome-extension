chrome.storage.sync.get('apiKey', function(result) {
    document.querySelector('#apiKeyReset').addEventListener('click', () => {
        chrome.storage.sync.remove('apiKey', function() {
            document.querySelector('#apiKeyMissing').style.display = 'block';
            document.querySelector('#apiKeyFound').style.display = 'none';
        });
    });
    document.querySelector('#apiKeySubmit').addEventListener('click', () => {
        const input = document.querySelector('#newApiKeyInput');
        if (!input?.value) return;
        chrome.storage.sync.set({ apiKey: input.value }, function() {
            document.querySelector('#apiKeyMissing').style.display = 'none';
            document.querySelector('#apiKeyFound').style.display = 'block';
            document.querySelector('#apiKey').innerHTML = input.value;
        });
    });
    if (result.apiKey) {
        document.querySelector('#apiKeyMissing').style.display = 'none';
        document.querySelector('#apiKey').innerHTML = result.apiKey;
    } else {
        document.querySelector('#apiKeyFound').style.display = 'none';
    }
});