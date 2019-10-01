export default function dataFetch(url, params) {
    const apiConfig = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify(params)
    };

    return fetch(url, apiConfig)
        .then(function(response) {
            if (response.ok) {
                return response.json().then(json => {
                    return json; //Gets cascaded to the next then block
                });
            } else {
                console.error(`Response status ${response.status} during dataFetch for url ${response.url}.`);
                throw new Error(response);
            }
        })
        .catch(function(error) {
            throw error; //gets caught in the higher catch block
        });
}
