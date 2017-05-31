const todoReducer = (state = [], action) => {
  console.log(state, action);
  switch(action.type) {
    case 'ADDTODO':
      return [...state, action.todo];
    default: 
      return state;
  }
}

const { createStore } = Redux;
const store = createStore(todoReducer);
  
class Todo extends React.Component {
  constructor() {
    super();
    this.addTodo = this.addTodo.bind(this);
  }
  
  addTodo(evt) {
    store.dispatch({
      type: 'ADDTODO',
      todo: evt.target.previousSibling.value
    })
  }
  
  render() {
    let data = this.props.data;
    let list = "";
    
    if(typeof data !== "undefined") {
        list = data.map((v,i) => {
          return <li key={i}>{v}</li>
        });
    }
    
    return(
      <div>
        <input type="text" placeholder="input todo"/>
        <button onClick={this.addTodo}>입력</button>
        <ul>{list}</ul>
      </div>
    )
  }
}

const render = () => {
  console.log("call render")
  ReactDOM.render(
    <Todo data={store.getState()}/>, document.querySelector("#wrap")
  );
};

store.subscribe(render);

render();
