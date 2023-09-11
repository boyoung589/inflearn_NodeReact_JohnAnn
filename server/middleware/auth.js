const {User} = require('../models/User');

let auth = (req, res, next) => {
  //인증처리를 하는 곳
  //클라이언트 쿠키에서 토큰을 가져온다 => cookie parser
  let token = req.cookies.x_auth;
  //토큰을 복호화한 후 유저를 찾는다
  User.findByToken(token, (err, user)=> {
      if(err) throw err;
      if(!user) return res.json({isAuth: false, error: true})

      req.token = token; //토큰과 유저를 리퀘스트에 넣음으로 index.js에서 리퀘스트.user 하면 user 정보를 사용할 수 있게 하기 위해 넣어줌.
      req.user = user;
      next();
  })
  //유저가 있으면 인증 ok 
  //유저가 없으면 인증 no
}

module.exports = {auth};