import React, { createContext, useContext, useEffect, useState } from 'react';


export const SidebarContext = createContext();

function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false)


    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export default SidebarProvider;