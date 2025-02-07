import { createContext, useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '@/firebase.config'
import { FIREBASE_DB } from '@/firebase.config'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

// Define the interface for user data
export interface UserContextType {
    name: string;
    birthday: string;
    gender: string;
    profilePicture: string;
    email: string;
    id: string;
    friend: string;
    friendPending: string;
    friendRequests: string[];
}

// Create the context outside of any function
export const UserContext = createContext<UserContextType>({
    name: '',
    birthday: '',
    gender: '',
    profilePicture: '',
    email: '',
    id: '',
    friend: '',
    friendPending: '',
    friendRequests: [],
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
        friend: '',
        friendPending: '',
        friendRequests: [],
    });

    useEffect(() => {
        let unsubscribeFirestore = () => {};

        const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            // Clean up previous listener if exists
            unsubscribeFirestore();
            
            // reset userData when auth state changes
            setUserData({
                name: '',
                birthday: '',
                gender: '',
                profilePicture: '',
                email: '',
                id: '',
                friend: '',
                friendPending: '',
                friendRequests: [],
            });

            if (!user) {
                return;
            }
            
            unsubscribeFirestore = onSnapshot(doc(FIREBASE_DB, 'users', user.uid), (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setUserData(prev => ({
                        ...prev,
                        ...data,
                        profilePicture: data.profilePicture === 'default' || !data.profilePicture
                            ? require('@/assets/icons/blankProfile.png')
                            : data.profilePicture,
                        friendRequests: data.friendRequests || [] // Ensure this is always an array
                    }));
                }
            }, (error) => {
                if (FIREBASE_AUTH.currentUser) {
                    console.error("Firestore listener error:", error);
                }
            });
        });

        return () => {
            unsubscribeFirestore();
            unsubscribeAuth();
        };
    }, []);

    return (
        <UserContext.Provider value={userData}>
            {children}
        </UserContext.Provider>
    );
}

// Add default export
export default UserContextProvider;