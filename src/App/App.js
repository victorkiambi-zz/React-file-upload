import React, {Component} from 'react';
import Upload from './Upload/Upload'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  render() {
    return (
        <div className="App">
         <div className="Card col-md-8">
             <Upload/>
         </div>
        </div>
    );
  }
}

export default App;
