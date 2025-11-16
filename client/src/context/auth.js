import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState({
        user:null,
        token:''
    })
    axios.defaults.headers.common['Authorization'] = auth?.token

    useEffect(() => {
        const data = localStorage.getItem('auth')
        if(data){
            try {
                const parseData = JSON.parse(data)
                if(parseData && parseData.user && parseData.token) {
                    setAuth({
                        user: parseData.user,
                        token: parseData.token
                    })
                }
            } catch(error) {
                console.log('Auth parsing error:', error)
                localStorage.removeItem('auth')
            }
        }
    }, [])
    return (
        <AuthContext.Provider value={[auth,setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext)

export {useAuth,AuthProvider}