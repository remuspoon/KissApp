import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config'
import { doc, getDoc } from 'firebase/firestore'

const HomePage = () => {
  const [userName, setUserName] = useState('')
  const auth = FIREBASE_AUTH
  const [userProfilePicture, setUserProfilePicture] = useState('')
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser
        if (user) {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid))
          if (userDoc.exists()) {
            setUserName(userDoc.data().name)
            setUserProfilePicture(userDoc.data().profilePicture)
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
      <View className="flex-row items-center">
        <Image 
          source={
            userProfilePicture 
              ? { uri: userProfilePicture }
              : require('@/assets/icons/blankProfile.png')
          } 
          className="w-20 h-20 rounded-full" 
        />
      </View>
    </View>
  )
}

export default HomePage