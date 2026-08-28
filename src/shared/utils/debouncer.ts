export const debouncer = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
    let timer: number;
    return (...args : Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback(...args);
        },delay)
    }
}