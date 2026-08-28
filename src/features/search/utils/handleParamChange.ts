export const handleParamChange = <T>( value: T, paramName: string ) => {
    const params = new URLSearchParams(window.location.search);
    if(value){
      params.set(paramName, String(value))
    } else { 
      params.delete(paramName);
    }

    const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : `${window.location.pathname}`;
    window.history.pushState({}, '', newUrl);
}