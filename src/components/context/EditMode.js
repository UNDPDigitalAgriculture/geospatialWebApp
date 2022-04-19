import React, { createContext, useContext, useEffect, useState } from 'react';


export const EditContext = createContext();

function EditProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false)


    return (
        <EditContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </EditContext.Provider>
    );
}

export default EditProvider;