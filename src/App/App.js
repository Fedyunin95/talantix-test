import React, {Component} from 'react';

import Loader from '../Loader/Loader'

import Search from '../assets/images/icons/search'

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      articles: [],
      users: [],
    }
  }

  componentDidMount() {
    fetch('http://jsonplaceholder.typicode.com/posts', {
      method:'GET'
    })
      .then(res => res.json())
      .then(data => {
        // mainArticles добавил чтобы хранить данные пришедшие с сервера.
        // можно вынести в родительский элемент, но обычно выносится в стор и получается как пропсы
        this.setState({articles: data, mainArticles: data});
        this.checkIsLoaded();
      })
      .catch( error => (console.log(error)));

    fetch('http://jsonplaceholder.typicode.com/users', {
      method:'GET'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({users: data});
        this.checkIsLoaded();
      })
      .catch( error => (console.log(error)))
  }

  checkIsLoaded = () => {
    if (this.state.users.length > 0 && this.state.articles.length > 0) this.setState({isLoaded: true})
  };

  getUserName = (id) => {
      const currentUser = this.state.users.filter(user => user.id === id)[0];
      return currentUser ? currentUser.name : '';
  };

  filterHandler = (event) => {
    const value = event.target.value;
    if (value) {
      const user = this.state.users.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);

      let articles = [];

      this.state.mainArticles.forEach(article => {
        user.forEach(item => {
          if (article.userId === item.id) articles.push(article);
        })
      });

      this.setState({articles})
    } else {
      this.setState({articles: this.state.mainArticles })
    }
  };

  renderArticles = () => {
    return this.state.articles.map(article => {
      return (
        <div className="article" key={article.id}>
          <h3 className="article__title">{article.title}</h3>
          <p className="article__short-description">{article.body}</p>
          <p className="article__author">{this.getUserName(article.userId)}</p>
        </div>
      )
    })
  };

  render() {
    return (
      <div className="app">
        {this.state.isLoaded
          ? (
            <>
              <div className="input">
                <div className="icon">
                  <Search />
                </div>
                <input type="text" className="filter" onChange={this.filterHandler}/>
              </div>
              <div className="articles">
                {this.renderArticles()}
              </div>
            </>
          )
          : <Loader />}
      </div>
    );
  }
}

export default App;
