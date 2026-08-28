export const raceForAbortOrRetry = (signal : AbortSignal, attempts: number) => {
    const backoff = 400 * 2 ** attempts;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, backoff);
        signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true })
    })
}