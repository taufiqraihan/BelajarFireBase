import React, { Component } from 'react';
import './App.css';
import firebase from './firebase/index'

class App extends Component {
    constructor() {
      super()
      this.state = {
        todo: "",
        todos: []
      }
    }

    componentDidMount(){

      firebase.database().ref('todos/').on('value', (snapshot) => {
        console.log(snapshot.val());
        const todosFirebase = snapshot.val()
        const todos = Object.keys(snapshot.val()).map(key => {
          console.log(todosFirebase[key].todoText)
          return{
            key:key,
            todoText: todosFirebase[key].todoText
          }
        })
        this.setState({todos:todos})
      })
    }

    handleChange = (e) => {
      this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {

      const newTodoKey = firebase.database().ref('todos/').push().key
      firebase.database().ref('todos/').update({
        [newTodoKey]: {
          todoText: this.state.todo
        }
      })

      e.preventDefault()
    }

    handleRemove = (key) =>{
      firebase.database().ref(`todos/${key}`).remove()
    }

    render(){
      return (
      <div className="App">
        <h1>Data Realtime Todo</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="todo"
            onChange={this.handleChange}
            value={this.state.todo} />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {
            this.state.todos.map((data, index) => {
              return(
                <li key={index}>
                  {data.todoText}
                  <button onClick={(key) => this.handleRemove(data.key)}>Hapus</button>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

export default App;
