import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from './components/Map';
import Compare from './components/Compare';
import Menu from './components/Menu';
import Panel from './components/Panel';

import { initializeApp } from "firebase/app";

import SidebarProvider from './context/sidebar';




function App() {

  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
  });

  const firebaseConfig = {

    apiKey: "AIzaSyANvYurLON2pl8b_XO3i3EuvYA-N4TrssM",
    authDomain: "agtest-cb996.firebaseapp.com",
    projectId: "agtest-cb996",
    storageBucket: "agtest-cb996.appspot.com",
    messagingSenderId: "720408516443",
    appId: "1:720408516443:web:5a94d6fa4fa4c85c4eac7e",
    measurementId: "G-RYK6SVH6SE"
  };


  const app = initializeApp(firebaseConfig);

  return (
    <SidebarProvider>
      <div className="App">
        <Menu />
        <Panel />
        <div className='main'>
          <Main />
        </div>
      </div>
    </SidebarProvider>
  );
}

const Main = () => (
  <Routes>
    <Route path='/' element={<Map />}></Route>
    <Route path='/explore' element={<Map />}></Route>
    <Route path='/compare' element={<Compare />}></Route>
  </Routes>
);


export default App;
