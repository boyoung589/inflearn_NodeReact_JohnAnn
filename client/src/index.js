import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import thunk from 'redux-thunk';
import reducer from './_reducers';



const createStoreWithMiddleware = applyMiddleware( promiseMiddleware, thunk)(createStore) 
/*객체 action만 받는 스토어가 프로미스와 함수도 받게 하기 위해 redux-promise, redux-thunk 미들웨어 적용
  promise, function을 action으로 사용하지 않는다면
  const store = createStore(reducer)로 쓰면 됨
*/

ReactDOM.render(
  <React.StrictMode>
    <Provider // provider를 이용해 app과 리덕스 연결
      store={createStoreWithMiddleware(reducer, //스토어 생성: 상태 저장공간
        window.__REDUX_DEVTOOLS_EXTENSION__ &&  //생성시 21 && 22번째 줄 추가해주면
        window.__REDUX_DEVTOOLS_EXTENSION__() //크롬 개발자 모드에서 리덕스의 상태 변화를 볼 수 있다.
      )}
    >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

/* 위의 코드 다른 방식으로 쓰기
const store = createStore(
  reducer,
  compose( 
      // compose(): 여러개의 저장소 인핸서를 적용하기 위해 사용 
      // ex) compose(applyMiddleware(thunk), DevTools.instrument())
      // 사실 여기선 다른 저장소 인핸서가 없어서 안써도 될 듯
    
    applyMiddleware(promiseMiddleware, thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

ReactDOM.render(
  <React.StrictMode>
    <Provider // provider를 이용해 app과 리덕스 연결
      store={store}
    >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
