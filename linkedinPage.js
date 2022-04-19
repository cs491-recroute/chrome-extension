function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const getAPIKey = () => {
    return new Promise(function(resolve) {
        chrome.storage.sync.get(['apiKey'], function(result) {
            resolve(result.apiKey);
        });
    });
}

const retrieveMail = async () => {
    await waitForElm("#top-card-text-details-contact-info");
    await document.querySelector('#top-card-text-details-contact-info').click();
    await waitForElm("[href^='mailto']");
    const href = document.querySelector("[href^='mailto']").href;
    await document.querySelector('[aria-label="Dismiss"]').click();
    return href.split(":")[1];
};

const createFlowSelectionHTML = async (container, apiKey) => {
    let activeFlows = [];
    try {
        // TODO: Fetch active flows
        // const response = await fetch('ENDPOINT');
        // activeFlows = await response.json();
        
        activeFlows = [
            {
                "_id": "62489d583f3474ce0cd64c02",
                "name": "Ahmet Active"
            },
            {
                "_id": "6255f7bd62dd1f2f7407fc4c",
                "name": "Aybars Flow - 2"
            }
        ];
    } catch (error) {
        container.append('API key is not valid!');
        return;
    }

    if (activeFlows.length === 0) {
        container.append('No active flows found!');
        return;
    };

    // Create send button
    button = document.createElement('button');
    button.id = 'recroute-sendButton';
    button.innerText = 'Send Invitation';
    button.addEventListener('click', async () => {
        const flow = document.querySelector('#recroute-flowSelector').value;
        if (!flow) return;

        const mail = await retrieveMail();
        console.log({ mail, flow, apiKey });
        // TODO: Send HTTP request to server with mail and flowID
    });
    
    // Create flow selector
    const select = document.createElement('select');
    select.id = 'recroute-flowSelector';
    const initialOption = document.createElement('option');
    initialOption.setAttribute('data-display', 'Select a flow to send invitation mail to this person:');
    select.append(initialOption);
    activeFlows.forEach(flow => {
        const option = document.createElement('option');
        option.value = flow._id;
        option.innerText = flow.name;
        select.append(option);
    });

    container.append(select);
    container.append(button);
    $('select').niceSelect();
}

const run = async () => {
    // Create floating button
    const floatingButton = document.createElement('div');
    floatingButton.id = 'recroute-floatingButton';
    floatingButton.addEventListener('click', async () => {
        const container = document.querySelector('#recroute-container');
    
        // Initialize inside of the modal
        container.innerHTML = '';
    
        const apiKey = await getAPIKey();
    
        if (apiKey) {
            await createFlowSelectionHTML(container, apiKey);
        } else {
            container.append('Please specify your api key first!')
        }
        container.classList.toggle('visible');
    });
    
    // Insert recroute logo to floating button
    const buttonIcon = document.createElement('img');
    buttonIcon.id = 'recroute-floatingButtonIcon';
    buttonIcon.src = chrome.runtime.getURL('/images/icon48.png');
    floatingButton.append(buttonIcon);
    
    document.querySelector('body').append(floatingButton);

    window.addEventListener('mousedown', event => {
        const container = document.querySelector('#recroute-container');
        const floatingButton = document.querySelector('#recroute-floatingButton');
        if (container.contains(event.target) || floatingButton.contains(event.target)) {
            return;
        }
        if (container.classList.contains('visible')) {
            container.classList.remove('visible');
        }
    });
    
    // Create container div
    const div = document.createElement('div');
    div.id = 'recroute-container';
    document.querySelector('body').append(div);
};

run();
