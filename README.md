# Commit log 
- 제목과 본문은 공백라인으로 구분할 것
- 제목은 50자 이내로 작성할 것
- 제목의 시작은 대문자로
- 제목에는 마침표를 쓰지 않는게 좋다
- 제목은 동사의 현재형으로 시작
- 본문은 한줄에 72자 이내로 작성
- 본문은 어떻게가 아닌 무엇을, 왜에 대해서 작성할 것

# Closure
### 부모함수의 변수를 자식함수가 접근할수 있는 변수스코프 
```JavaScript
function parent(){
  var i = 0; //i 는 parent함수가 생성한 지역변수
 function child(){
    console.log(i); //부모함수에서 선언한 i를 사용 
 }
  child();
}

parent(); //0
```
