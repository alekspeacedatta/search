    How Requirements 3, 4, and 5 interact

    The whole system revolves around one thing: filters state. It doesn't matter whether that state changed because the user clicked a filter or because they pressed Back/Forward (popstate) either way, the end result is the same: a change to the filters object, which triggers a single useEffect that owns the debounce → fetch → retry chain.

    Debounce (debouncer) controls the delay before a request even starts — on every keystroke, clearTimeout cancels whatever fetch hasn't fired yet. Retry/backoff (raceForAbortOrRetry) controls the internal logic of a cycle that has already started — on a 503, it waits 400 * 2^i ms while listening to the signal. These two mechanisms are independent and don't substitute for each other: debounce stops a request that hasn't started yet, while AbortController.abort() stops a retry cycle that's already running, including while it's paused in backoff.

    For URL sync, the URL is the source of truth for filters state, not the other way around. A user-initiated change calls setFilters and history.pushState (a new history entry). On Back/Forward, the browser changes the URL itself, a popstate event fires, readParamsFromUrl reads the URL, and setFilters runs — pushState is never called in this path, which is what prevents duplicate history entries. Both paths ultimately converge on the same filters state change, so the fetch/abort logic never needs to know where the change came from.

    Specific scenario: pressing Back while a retry is pending on a debounced search

    Say the user picked a filter, the 350ms debounce elapsed, getProducts ran, the first fetch came back with 503, and we're now sitting inside raceForAbortOrRetry's backoff pause, waiting on setTimeout(400ms). At exactly this moment, the user presses Back.

    First, a popstate event fires from the browser, since the URL has already been changed by the browser itself. handlePopState calls readParamsFromUrl, which reads the new URL and returns the result to setFilters. The filters state changes, and Search re-renders. useEffect([filters]) runs again, and its very first line, controllerRef.current?.abort(), fires on the old, 503 controller.

    That abort() synchronously triggers the signal.addEventListener('abort', ...) listener living inside raceForAbortOrRetry, which calls clearTimeout on the 400ms backoff timer and rejects the Promise with an AbortError. That rejection throws at the await raceForAbortOrRetry(...) line, and the exception bubbles up out of getProducts' for loop straight to the catch block — the loop's second iteration (attempt 1) never fires, and no further fetch is sent for the old filters.

    Still within the same useEffect run, synchronously, a new AbortController is created, stored in controllerRef.current, and debouncedGetProducts is called with the new filters and the new signal. After the 350ms debounce, getProducts runs with the new, URL-derived filters, and a fresh retry cycle starts from scratch if needed.

    As a result, the old 503 retry cycle is fully and permanently cancelled mid-backoff, without waiting for that 400ms to elapse — no extra fetch is ever sent for the stale filters, and the new, URL-derived search proceeds independently, protected from stale-response race conditions by the seq and signal.aborted checks.

    count and /search can disagree (the mock server admits this). We let the
    results response win because the badge must describe the list actually on
    screen — a count of 12 over 9 rendered cards is a visible contradiction,
    while a stale-but-fast number that gets corrected is just a loading state.
    resultsArrivedRef latches per-search so a slow /count can never overwrite
    a count already derived from results.