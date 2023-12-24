const checkToken = (accessToken)=>{
    
    if (accessToken){
        const expirationTime = new Date(JSON.parse(localStorage.getItem('payload')).exp*1000);
        if (expirationTime < Date.now()){
            localStorage.removeItem('access');
            localStorage.removeItem('payload');
            console.log('access 기간 만료');
            window.location = '/login'
            return; 
        }
        else return JSON.parse(localStorage.getItem('payload')).user_id;
    }
    console.log('access 없음');
    window.location = '/login';
    return; 
}

export {checkToken}