import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import reframe from 'reframe.js';
import {YoutubePlayer} from './components/youtube.js';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

const list = [
    {
      title: 'React',
      url: 'https://facebook.github.io/react/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://github.com/reactjs/redux',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result:null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories();
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({result: { ...this.state.result, hits: updatedHits }});
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  render() {
    const { searchTerm, result } = this.state;
    if(!result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        { result ?
        <Table
          list={result.hits}
          onDismiss={this.onDismiss}
        />
        :
          null
        }
      </div>
    );
  }
}

const Button = ({onClick, className, children}) =>
  <button onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

const Search = ({value, onChange, children, onSubmit}) =>
      <form onSubmit={onSubmit}> 
        <input type="text"
          value={value}
          onChange={onChange}
        />
        <button type="submit">
          {children}
        </button>
      </form>

const Table = ({list, pattern, onDismiss}) =>
  <div className="table">
    {list.map(item =>
    <div key={item.objectID} className="table-row">
      <span style={largeColumn} className="table-header">
        <a href={item.url} style={{"overflow": "hidden", "text-overflow": "ellipsis"}}>{item.title}</a>
       </span>
       <span style={mediumColumn}>{item.author}</span>
       <span style={smallColumn}>{item.num_comments}</span>
       <span style={smallColumn}>{item.points}</span>
       <span style={smallColumn}>
          <Button onClick={() => onDismiss(item.objectID)}
            className="button-inline">
            Dismiss
          </Button>
       </span>
      </div>
       )}
    </div>

const largeColumn = {
  width: '40%'
}

const mediumColumn = {
  width: '30%'
}

const smallColumn = {
  width: '10%'
}

export default App;
