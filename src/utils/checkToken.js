const checkToken = (accessToken)=>{
    
    if (accessToken){
        const expirationTime = new Date(JSON.parse(localStorage.getItem('payload')).exp*1000);
        if (expirationTime < Date.now()){
            window.location = '/login'
            localStorage.removeItem('access');
            localStorage.removeItem('payload');
            return; 
        }
        else return JSON.parse(localStorage.getItem('payload')).user_id;
    }
    window.location = '/login';
    return; 
}

export {checkToken}