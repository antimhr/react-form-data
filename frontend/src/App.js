import './App.css';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar } from "react-bootstrap";
import axios from 'axios';


class App extends Component {

  state = {
    uploadPercentage: 0,
    title: '',
    content: '',
    image: null
  };
  

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  };

  handleImageChange = (e) => {
    this.setState({
      image: e.target.files[0]
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    let form_data = new FormData();
    form_data.append('image', this.state.image, this.state.image.name);
    form_data.append('title', this.state.title);
    form_data.append('content', this.state.content);

    const options = {
      onUploadProgress: (progressEvent) => {
        const {loaded, total} = progressEvent;
        let percent = Math.floor( (loaded * 100) / total )
        console.log( `${loaded}bytes of ${total}bytes | ${percent}%` );

        if( percent < 100 ){
          this.setState({ uploadPercentage: percent })
        }
      }
    }

    let url = 'http://localhost:8000/api/posts/';
    axios.post(url, form_data, options, {
      headers: {
        'content-type': 'multipart/form-data'
      },

    })
        .then(res => {
          console.log(res.data);

          this.setState({ uploadPercentage: 100 }, ()=>{
            setTimeout(() => {
              this.setState({ uploadPercentage: 0 })
            }, 1000);
          })

        })
        .catch(err => console.log(err))

  };

  render() {

    const {uploadPercentage} = this.state;

    const mystyle = {
      width: "40%",
      padding: "10px",
      margin: "1em 1em 1em 30%"
    };

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <p>
            <input type="text" placeholder='Title' id='title' value={this.state.title} onChange={this.handleChange} required/>
          </p>
          <p>
            <input type="text" placeholder='Content' id='content' value={this.state.content} onChange={this.handleChange} required/>

          </p>
          <p>
            <input type="file"
                   id="image"
                   accept="image/png, image/jpeg"  onChange={this.handleImageChange} required/>
          </p>

          <input type="submit"/>
          
          <div style={mystyle}>
          { uploadPercentage > 0 && <ProgressBar animated now={uploadPercentage} active label={`${uploadPercentage}%`} /> }
          </div>
          
        </form>
      </div>
    );
  }
}

export default App;




