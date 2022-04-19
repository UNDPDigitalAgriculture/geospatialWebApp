import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import EditProvider from '../src/components/context/EditMode'

import Map from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {


  const [stats, setStats] = useState('');
  const [password, setPassword] = useState('')

  const pull_data = (data) => {
    //console.log(data)
    setStats(data)
  }

  const handleChange = (e, v) => {
    console.log(e.target.value);
    setPassword(e.target.value)
  }




  return (

    password != `farms` ?
      <TextField onChange={handleChange}></TextField>

      : <EditProvider>
        <div className="App" >
          <Sidebar data={stats} />
          <Map func={pull_data} />
        </div >
      </EditProvider>


  )

}

export default App;
