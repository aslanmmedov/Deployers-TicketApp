const baseUrl = "https://spotted-bumpy-soap.glitch.me"; 

export const get = async (endpoint) => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`GET request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const post = async (endpoint, data) => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`POST request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const patch = async (endpoint, data) => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`PATCH request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const del = async (endpoint) => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: "DELETE",
        });

        console.log('Response Status:', response.status);
        console.log('Response Body:', await response.text());

        if (!response.ok) {
            throw new Error(`DELETE request failed: ${response.statusText} at ${baseUrl}${endpoint}`);
        }
    } catch (error) {
        console.error('Error in DELETE request:', error);
        throw error;
    }
};

