import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config'
import { doc, getDoc } from 'firebase/firestore'

const HomePage = () => {
  const [userName, setUserName] = useState('')
  const auth = FIREBASE_AUTH

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser
        if (user) {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid))
          if (userDoc.exists()) {
            setUserName(userDoc.data().name)
          }
        }
      } catch (error) {
        console.log("Error fetching user name:", error)
      }
    }

    fetchUserName()
  }, [])

  return (
    <View>
      <Text className="text-xl font-f600">Hello, {userName}!</Text>
    </View>
  )
}

export default HomePage