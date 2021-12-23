interface FetchOptions {
    contentType?: string;
    useAutoContentType?: boolean;
    emptyResponse?: boolean;
}

interface ApiError {
    message: string;
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof Object && error.hasOwnProperty('message');
}

let apiUrl: string = 'https://dev-eks3f9sr.us.auth0.com/api/v2';
let apiToken: string;


async function doFetch(method: string, url: string, body: any, options?: FetchOptions) {
    if (!apiUrl) {
        throw new Error('apiUrl is not defined. Make sure to call ApiUtils.setApiUrl.');
    }

    if (!apiToken) {
        const res = await fetch('https://dev-eks3f9sr.us.auth0.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'client_credentials', // eslint-disable-line
                client_id:"xQ2OLdoTEGL93sJBNGVbPJfY9vd4fqJg", // eslint-disable-line
                client_secret:"1gPjfw_ljl-v4CHTAV1TZJRgW4p5INogFn6YePQqJ8Lb78ae7RG8N2sFDR1aKfMB", // eslint-disable-line
                audience: 'https://dev-eks3f9sr.us.auth0.com/api/v2/'
            })
        });

        apiToken = (await res.json()).access_token;
    }

    const response: Response = await fetch(apiUrl + url, {
        method,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${apiToken}`,
            ...(!options?.useAutoContentType && {
                'Content-Type': options?.contentType || 'application/json'
            })
        },
        ...(!!body && { body })
    });

    if (options?.emptyResponse) {
        if (!response.ok) {
            throw await response.json();
        }

        return response;
    }

    const json = response.json();

    if (!response.ok) {
        throw await json;
    }

    return json;
}


const apiUtils = {
    setApiUrl(newApiUrl: string) {
        apiUrl = newApiUrl;
    },

    setApiToken(newApiToken: string) {
        apiToken = newApiToken;
    },

    get(url: string, params?: GetParams, options?: FetchOptions) {
        if (params) {
            const urlParams = new URLSearchParams(params);
            url = `${url}?${urlParams.toString()}`;
        }

        return doFetch('GET', url, null, options);
    },

    patch(url: string, body: any, options?: FetchOptions) {
        if (!options?.useAutoContentType) {
            body = JSON.stringify(body);
        }

        return doFetch('PATCH', url, body, options);
    },

    post(url: string, body: any, options?: FetchOptions) {
        if (!options?.useAutoContentType) {
            body = JSON.stringify(body);
        }

        return doFetch('POST', url, body, options);
    },

    put(url: string, body: any, options?: FetchOptions) {
        if (!options?.useAutoContentType) {
            body = JSON.stringify(body);
        }

        return doFetch('PUT', url, body, options);
    },

    delete(url: string, options?: FetchOptions) {
        return doFetch('DELETE', url, null, {
            emptyResponse: true,
            ...options
        });
    }
};

export default apiUtils;

interface GetParams {
    [key: string]: any;
}
