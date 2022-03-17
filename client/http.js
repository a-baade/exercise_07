import {useEffect, useState} from "react";

export function useLoading(loadingFn) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [data, setData] = useState(undefined);

    async function load() {
        try {
            setLoading(true);
            setError(undefined);
            setData(await loadingFn());
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);
    return {loading, error, data}
}

export async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
    }
    return await res.json();
}

export async function postJSON(url, body) {
    const res = await fetch(url, {
        method: "post",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`)
    }
}