
const sendAjax = (method, url, func) => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", func);
    req.open(method, url);
    req.send();
};

const reducer = (state = {post:[],currIdx:0}, action) => {
    switch(action.type) {
        case 'ChangeCurr':
            return Object.asign(state, {currIdx: action.idx});
        case 'GetAjax':
            return Object.asign(state, {post: action.post});
        default :
            return state;
    }
}

const { createStore } = Redux;
const store = createStore(reducer);

const NavList = (props) => {
    let navHTML = props.post.map((v,i) => {
      let clsName = (i !== props.currIdx) ? "" : "selected";
      return (
          <li key={v.title} onClick={props.onClick.bind(null, i)} className={clsName}>{v.title}</li>
      )
    });
    
    return (
        <ul className="navUl">
            {navHTML}
        </ul>
    )
    
};


class TabUI extends React.Component {
    constructor() {
        super();
        this.changeCurr = this.changeCurr.bind(this);
    }

    changeCurr(idx) {
        store.dispatch({
            type: 'ChangeCurr',
            idx: idx
        })
    }

    componentDidMount() {
        sendAjax('GET', 'http://127.0.0.1:8000/data.json', (req) => {
            store.dispatch({
                type: 'GetAjax',
                post: JSON.parse(req.responseData)
            });
        }); 
    }

    render() {
        const data = this.props.data.posts;
        const idx = this.props.data.currIdx;
        const curTitle = data[idx].title;
        const curBody = data[idx].body;
        let viewHTML = (
          <div>
            <h3>{curTitle}</h3>
            <p>{curBody}</p>
           </div>
        );  
       return (
       <div>     
       <nav className="nav">
            <NavList
                onClick={this.changeCurr}
                post={data}
                currIdx={idx}
            />
       </nav>
       <article className="content">
            {viewHTML}
       </article>
       </div>
       )
    }
}

const render = () => {
    ReactDOM.render(
        <TabUI data={store.getState()}/>, document.querySelector("#wrap")
    );
}

sendAjax('GET', 'http://127.0.0.1:8000/data.json', () => {
    store.dispatch({
        type: 'GetAjax',
        post: JSON.parse(req.responseData)
    });
}); 

store.subscribe(render);

render();
