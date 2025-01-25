import { createContext, useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '@/firebase.config'
import { FIREBASE_DB } from '@/firebase.config'
import { doc, getDoc } from 'firebase/firestore'

// Define the interface for user data
interface UserContextType {
    name: string;
    birthday: string;
    gender: string;
    profilePicture: string;
    email: string;
    id: string;
    fetchUserData: () => Promise<void>;
}

// Create the context outside of any function
export const UserContext = createContext<UserContextType>({
    name: '',
    birthday: '',
    gender: '',
    profilePicture: '',
    email: '',
    id: '',
    fetchUserData: async () => {}
})

// Create a provider component
export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [userData, setUserData] = useState<UserContextType>({
        name: '',
        birthday: '',
        gender: '',
        profilePicture: '',
        email: '',
        id: '',
        fetchUserData: async () => {}
    });

    const fetchUserData = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(prev => ({
                    ...prev,
                    ...data,
                    fetchUserData
                }));
            }
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{...userData, fetchUserData}}>
            {children}
        </UserContext.Provider>
    );
}

// Add default export
export default UserContextProvider;