const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({

    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //이메일 중 띄어쓰기 있는 것을 없애줌 ex) boyoung yang@gmail.com => boyoungyang@gmail.com
        unique: 1, //이메일중복X unique: true도 가능
        required: true, //필수값
        lowercase: true //소문자여야함-소문자로 자동변환되는것인지 확인필요
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    birth: {
        type: Date,
        default: Date.now //기본 값으로 현재 시간 넣음
    },
    role: {
        //role을 주는 이유는 관리자 유저인지 일반 유저인지 설정 가능
        type: Number, // 1이면 관리자, 0이면 일반유저
        default : 0 //따로 설정하지 않는 경우 0(일반유저)로 자동설정
    },
    image: String,
    token: {
        type: String //유효성관리
    },
    tokenExp: {
        //토큰 유효기간
        type: Number
    }
})

userSchema.pre('save', function(next){
    //비밀번호를 암호화시킨다.
    //bcrypt를 가져온다(암호화를 위한 라이브러리)
    //위에
    //salt를 이용해서 비밀번호를 암호화해야함
    //=> salt생성해야함
    //saltRounds는 salt가 몇글자인지 정해주는 것 
    let user = this; //위 userSchema의 내용을 가져온다
    if(user.isModified('password')){
        //패스워드가 변환될 때만 아래 암호화 함수가 실행되게 함
        //이 부분을 설정해주지 않으면 이름, 이메일등 다른 데이터를 변경해서 
        //새로 저장할 때마다 비밀번호 재암호화가 진행됨
        bcrypt.genSalt(saltRounds, function(err, salt) { //genSalt: salt를 만든다
            
            if(err){
                return next(err); 
                //next를 하면 "userSchema.pre('save', callback)"의 'save'활동으로 넘어감
                //index.js의 user.save()부분
            }
            const myPlaintextPassword = user.password;
            bcrypt.hash(myPlaintextPassword, salt, function(err, hash) { 
                //bcrypt.hash: hashing(암호화)하는 메소드
                //myPlaintextPassword: 암호화 전 비밀번호
                //파라미터의 hash: 암호화된 비밀번호
    
                if(err){
                    return next(err);
                } else{
                    //hash 성공
                    user.password = hash;
                    next();
                    //이 부분을 위해 userSchema.pre()안에 user = this;를 넣어준 것.
                }
            });
        }); //bcrypt 공식문서의 사용법 참조:https://www.npmjs.com/package/bcrypt
    } else {
        next();
        //비밀번호를 바꾸는 게 아니라 다른 데이터를 post하는 요청이면 pre함수를 빠져나와서 'save'진행
    }
    
})

userSchema.methods.comparePassword = function(plainPassword, cb){

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err){
            return cb(err);
        }
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    //jsonwebtoken을 이용해서 token을 생성하기
    let user = this;
    console.log("유저아이디",user._id)
    //유저아이디 new ObjectId("61c35704807db261052986b8")
    console.log("유저아이디 투스트링", user._id.toString())
    // 유저아이디 투스트링 61c35704807db261052986b8
    console.log("유저아이디 투 핵스스트링!!", user._id.toHexString())
    // 유저아이디 투 핵스스트링!! 61c35704807db261052986b8

    const token = jwt.sign(user._id.toHexString(),'secretToken')
    
    // user._id + 'secreteToken' = token
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){
    let user = this;
    //토큰을 디코드 한다
    // user._id + '' = token

    jwt.verify(token, 'secretToken', function(err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음
        //클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}




const User = mongoose.model('User', userSchema) 
//모델의 이름과 스키마를 이용해서 모델을 변수처럼 설정
//const 변수명 = mongoose.model('모델 명', 사용 스키마)

module.exports = {User} //만든 User 모델을 다른 곳에서도 쓸 수 있게 해줌