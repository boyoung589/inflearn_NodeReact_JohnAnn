const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const cookiparser = require('cookie-parser');
const { User } = require('./models/User');
const config = require('./config/key');
const {auth} = require('./middleware/auth');

//application/x-www-form-urlencoded 이런 데이터를 분석해서 서버가 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));

//application/json 인 데이터를 분석해서 가져올 수있게 함
app.use(bodyParser.json());
app.use(cookiparser());
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
)


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...')) //연결이 잘 됐는지 확인
    .catch(() => console.log('err')) //연결 에러시 표시

// mongoose.connect(`mongodb+srv://boyoung-yang:<password>@boilerplate.uybsm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
//     useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: falsle
// }) => 였으나
// // useNewUrlParser, useUnifiedTopology, useCreateIndex, useFindAndModify 설정을 기본으로 갖게 업데이트 하면서 설정이름들을 더이상 지원하지 않음


app.get('/', (req,res) => res.send("안녕 세상"))

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요!!!!!!!!!!!!!!!!')
})


app.post('/api/users/register', (req, res) => {
    
    const user = new User(req.body) //req.body를 받아오는 인스턴스 생성
    
    //회원가입할 때 필요한 정보들을 클라이언트에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    // => 모델(User.js)만든 것을 가져와서 연결해 줘야 함
    // const { User } = require('./models/User'); 위에 추가
    //클라이언트에서 가저온 정보를 req.body로 가져오기 위해 바디파서 연결
    //const bodyparser = require('body-parser');

    //user.save(콜백)는 몽고db의 메소드 user에 온 정보들이 user에 저장됨 콜백은 데이터에 에러가 났을 때 안났을 때 취할 행동 지정
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err}); //에러가 나면 success: false라는 말과 함께 에러 코드 보내주기
        return res.status(200).json({
            success: true
        })
    })

    
})

app.post('/api/users/login', (req,res) => {
    //요청된 이메일을 데이터베이스에 있는지 찾는다.
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        user.comparePassword(req.body.password, (err, isMatch) => {//err가 아니라 두번째 파라미터 user이면
            
            if(!isMatch){
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                })
            }
            
            //비밀번호까지 맞다면 토큰을 생성하기
            user.generateToken((err, user)=> {
                //사용장지정 메소드 generateToken을 모델 User.js에 만듦
                if(err){
                    res.status(400).send(err);
                }else{
                    //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등
                    //쿠키에 저장하기 위한 라이브러리: cookiparser
                    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    })
                }
            })
    
        })
    })

})
//express의 Router을 쓸 예정이기 때문에 /api/users/endpoint, /api/product/endpoint,  /api/comment/endpoint로 정리하면 좋음

app.get('/api/users/auth', auth, (req, res) => { //auth:미들웨어
  //여기까지 미들웨어를 통과했 왔다는 얘기는 Authentication이 true라는 말.
  //클라이언트한테 정보를 전해줘야함

  res.status(200).json({

      _id: req.user._id,
      isAdmin: req.user.role === 0? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname
  })
}) 


app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) =>{
            
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})
app.listen(port, () => console.log(`example app listening on port ${port}`))