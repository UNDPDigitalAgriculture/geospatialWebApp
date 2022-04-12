import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import img from '../images/UNDP_logo.png';
import Map from './Map';
import Compare from './Compare';


const Menu = () => {

    return (
        <>
            <div className='menu'>
                <h1 style={{ padding: 0, margin: 0 }}>UNDP Agriculture</h1>
                <img style={{ top: 0, left: 0, position: 'absolute' }} src={img} alt='undp' />
                <div style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around', }}>
                    <li><Link to={'/'} > Home </Link></li>
                    <li><Link to={'/compare'} >Compare</Link></li>
                </div>
            </div>

        </>
    )
}

export default Menu;