const NavList = (props) => {
    let navHTML = props.post.map((v,i) => {
            if(i !== props.currIdx) {
                return (
                    <li key={i} onClick={props.onClick.bind(null, i)}>
                        {v.title}
                    </li>
                )
            } else {
                return (
                    <li key={i} onClick={props.onClick.bind(null, i)} className="selected">
                        {v.title}
                    </li>
                )
            }
        }
    );
    
    return (
        <ul className="navUl">
            {navHTML}
        </ul>
    )
    
};

class TabUI extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: [
                {
                    "title": "One",
                    "body": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci beatae voluptates assumenda cumque libero ducimus sit debitis dicta. Ut itaque possimus adipisci ea praesentium tempore inventore ad alias temporibus laborum?"
                },
                {
                    "title":"Two",
                    "body":"Ut quia, a recusandae possimus explicabo consequatur laudantium velit nisi commodi provident animi? Quis, natus illum fugiat explicabo nostrum iste quos iure velit inventore veritatis! Quos nam non repellendus fugiat!"
                },
                {
                    "title":"Three",
                    "body":"Veritatis dolores officiis maiores, quia sit non. Eius quae dolores veritatis aut natus sit explicabo, reiciendis cumque ipsum aliquam officiis quis exercitationem rem odio voluptatum. Earum magni velit quasi illo."
                },
                {
                    "title":"Four",
                    "body":"Quas eveniet a blanditiis eius maiores maxime amet, pariatur architecto, cupiditate assumenda, aliquam iusto eum quia. Unde possimus, accusantium numquam quis ipsum repellat maiores, neque esse explicabo, reprehenderit blanditiis voluptatem."
                }
            ],
            currIdx : 0
        }
    }

    changeCurr(idx) {
        this.setState({'currIdx':idx});
    }

    render() {
        const data = this.state.posts;
        const idx = this.state.currIdx;
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
       <nav>
            <NavList
                onClick={this.changeCurr.bind(this)}
                post={data}
                currIdx={idx}
            />
       </nav>
       <article>
            {viewHTML}
       </article>
       </div>
       )
    }
}

ReactDOM.render(
    <TabUI/>, document.querySelector("#wrap")
);