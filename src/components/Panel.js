import React, { Component, useContext, useState } from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { SidebarContext } from "../context/sidebar";
import img from './chart.webp'


const Panel = () => {

    const [state, setState] = useState({
        isPaneOpen: false,
    });
    const { isOpen, setIsOpen } = useContext(SidebarContext)

    return (



        <div>
            {/* <button onClick={() => setState({ isPaneOpen: true })}>
                Click me to open right pane!
            </button> */}
            <SlidingPane
                className="some-custom-class"
                overlayClassName="some-custom-overlay-class"
                // isOpen={state.isPaneOpen}
                isOpen={isOpen}
                width={'50%'}
                title="Data Trends"
                //subtitle="Optional subtitle."
                onRequestClose={() => {
                    // triggered on "<" on left top click or on outside click
                    //setState({ isPaneOpen: false });
                    setIsOpen(false)
                }}
            >
                <div>cool charts and graphs!</div>
                <img src={img} />
                <br />
            </SlidingPane>

        </div>
    );

}

export default Panel;