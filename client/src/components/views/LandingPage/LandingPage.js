import React, {useEffect} from 'react';
import axios from 'axios';

function LandingPage() {

    useEffect(() => {
        axios.get('/api/hello')
        .then((response) => {console.log(response.data)})
        .catch((err)=>{console.log("에러다!!!", err)})
        //Proxy가 5000포트 가져오므로 그 이후 주소 씀
    }, [])


    return (
        <div>
            LandingPage 랜딩페이지
        </div>
    )
}

export default LandingPage
