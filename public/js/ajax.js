/**
 * NextBoard - A Modern Bulletin Board System
 * "Where discussions take the next step."
 * 
 * Author: Sam Wilcox
 * Email: sam@nextboard.org
 * Website: https://www.nextboard.org
 * GitHub: https://github.com/samwilcox/nextboard
 * 
 * License: GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 * For full license details, visit: https://license.nextboard.org
 */

/**
 * Perform an AJAX GET request.
 * 
 * @param {string} action - The action to perform.
 * @param {Object} [data=null] - Optional data parameters.   
 * @param {Function} fn - The callback function. 
 * @param {Object} [options={}] - Options for AJAX GET request.
 * @param {boolean} [options.adminCP=false] - True to send request to the AdminCP, false not to. 
 */
const ajaxGet = (action, fn, data = null, options = {}) => {
    const { adminCP = false } = options;
    const queryString = data ? `?${new URLSearchParams(data).toString()}` : '';
    const url = adminCP ? `${ajaxUrl}/admincp/ajax/${action}${queryString}` : `${ajaxUrl}/ajax/${action}${queryString}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error. Status: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            if (typeof fn === 'function') {
                fn(data);
            } else {
                console.error('Callback function is not defined or not a function');
            }
        })
        .catch(error => {
            console.error('An error occured while processing an AJAX GET request:', error);
        });
};

/**
 * Perform an AJAX POST request.
 * 
 * @param {string} action - The action to perform.
 * @param {Object} data - The data parameters. 
 * @param {Function} fn - THe callback function. 
 * @param {Object} [options={}] - Options for AJAX POST request.
 * @param {boolean} [options.adminCP=false] - True to send request to the AdminCP, false not to. 
 */
const ajaxPost = (action, data, fn, options = {}) => {
    const { adminCP = false } = options;
    const url = adminCP ? `${ajaxUrl}/admincp/ajax/${action}` : `${ajaxUrl}/ajax/${action}`;
    const headers = csrfEnabled ? { 'X-CSRF-Token': csrfToken } : {};

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Http error. Status: ${response.status}`);
        }

        return response.text();
    })
    .then(text => {
        if (!text) {
            console.warn('Empty response received');
            return;
        }

        return JSON.parse(text);
    })
    .then(data => {
        fn(data);
    })
    .catch(error => {
        console.error('An error occured while processing an AJAX POST request:', error);
    });
};

/**
 * Perform an AJAX file upload.
 * 
 * @param {string} action - The action to perform.
 * @param {File} file - The file to upload. 
 * @param {Object} [data=null] - Optional additional data parameters (e.g., metadata). 
 * @param {Function} fn - The callback function. 
 * @param {Object} [options={}] - Options for AJAX file upload request. 
 */
const ajaxFileUpload = (action, file, data = null, fn, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    if (data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }
    }

    const url = `${ajaxUrl}/ajax/${action}`;
    const headers = csrfEnabled ? { 'X-CSRF-Token': csrfToken } : undefined;

    fetch(url, {
        method: 'POST',
        headers: headers || {},
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        return contentType && contentType.includes('application/json') ? response.json() : {};
    })
    .then(data => {
        fn(data);
    })
    .catch(error => {
        console.error('An error occured while uploading the file:', error);
    });
};