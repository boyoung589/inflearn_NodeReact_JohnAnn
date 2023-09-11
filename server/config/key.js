//환경변수가 배포단계이면 프로드 파일에서 몽고디비 유알아이을 가져오고 아니면 데브에서 가져온다
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}