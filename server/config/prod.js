// 배포 한 후 환경변수를 정해줄 때
module.exports = {
    mongoURI : process.env.MONGO_URI 
    //heroku라는 배포 사이트를 이용시 사이트에 직접 uri을 적게 되어있고, 
    //config vars 에 적어주는 mongourl의 이름과 process.env."uri 이름"이 같게 만들어 줘야 함
}