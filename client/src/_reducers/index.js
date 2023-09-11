import { combineReducers } from "redux"; 
/*여러가지 리듀서를 root reducer로 모아주는 것
  combineReducers로 리듀서를 만들었다면 인수는 전달했던 것과 같은 
  키 구조를 가지는 평범한 객체여야 합니다. 
  그렇지 않다면 리듀서가 이해할 수 있는 어떤 것도 사용할 수 있습니다.
*/
//import user from './user_reducer';

const rootReducer = combineReducers({
    //user
})

export default rootReducer;