import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import { Heart } from 'lucide-react-native'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'
import { FIREBASE_DB } from '@/firebase.config'
import { getDoc, doc } from 'firebase/firestore'

interface HomePageState {
  state: "friend" | "noFriend" | "pending"
}

const HomePage = () => {
  const userData = useContext(UserContext)
  const [homePageState, setHomePageState] = React.useState<HomePageState>({state: "noFriend"})
  const [friendName, setFriendName] = React.useState("")
  const [pendingFriendName, setPendingFriendName] = React.useState("")
  useEffect(() => {
    const fetchFriendName = async () => {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userData.friend))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setFriendName(data.name)
        setHomePageState({state: "friend"})
      }
    }
    const fetchPendingFriendName = async () => {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userData.friendPending))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setPendingFriendName(data.name)
        setHomePageState({state: "pending"})
      }
    }
    if (userData.friend) {
      fetchFriendName()
    } else if (userData.friendPending) {
      fetchPendingFriendName()
    } else {
      setHomePageState({state: "noFriend"})
    }

  }, [userData.friend, userData.friendPending])

  const renderHomePage = () => {
    switch (homePageState.state) {
      case "noFriend":
        return (
          <View className="flex-1 bg-secondary items-center justify-center gap-y-10 px-5" >
        <TouchableOpacity 
          className="w-2/3 aspect-square rounded-full bg-white items-center justify-center"
          activeOpacity={.5}
          disabled={true}>
            <View className="pt-6 items-center justify-center">
              <Heart size={150} fill="#9D9D9D" color="#9D9D9D" />
              <Text className="absolute text-white text-8xl font-f500 pt-8">?</Text>
            </View>
            <View>
              
            </View>
          </TouchableOpacity>
        <View className="flex-col items-center justify-center gap-y-2">
          <Text className="text-grey text-4xl text-center font-f500">Tap your profile picture to add your friend!</Text>
        </View>
      </View>
        )
      case "pending":
        return (
          <View className="flex-1 bg-secondary items-center justify-center gap-y-10 px-5" >
        <TouchableOpacity 
          className="w-2/3 aspect-square rounded-full bg-white items-center justify-center"
          activeOpacity={.5}
          disabled={true}>
            <View className="pt-6 items-center justify-center">
              <Heart size={150} fill="#9D9D9D" color="#9D9D9D" />
              <Text className="absolute text-white text-8xl font-f500 pt-8">?</Text>
            </View>
            <View>
              
            </View>
          </TouchableOpacity>
        <View className="flex-col items-center justify-center gap-y-2">
          <Text className="text-grey text-4xl text-center font-f500">Waiting for {pendingFriendName} to accept your request!</Text>
        </View>
      </View>
        )
      case "friend":
        return (
          <View className="flex-1 bg-secondary items-center justify-center gap-y-10 px-5">
            <TouchableOpacity 
              className="w-2/3 aspect-square rounded-full bg-white items-center justify-center"
              activeOpacity={0.5}>
              <View className="pt-6">
                <Heart size={150} fill="#FF6C6E" color="#FF6C6E" />
              </View>
            </TouchableOpacity>
            <View className="flex-col items-center justify-center gap-y-2">
              <Text className="text-primary text-5xl text-center font-f500">Send</Text>
              <Text className="text-primary text-6xl text-center font-f600">{friendName}</Text>
              <Text className="text-primary text-5xl text-center font-f500">a kiss</Text>
            </View>
          </View>
        )
    }
  }
  
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="bg-secondary items-end px-5">
        <TouchableOpacity 
          onPress={() => router.push('/(profile)/profilePage')}>
          <View>
            <Image 
              source={userData.profilePicture} 
              style={{width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.25, shadowRadius: 4}}
              contentFit="cover"
              placeholder={Placeholder}
            />
          </View>
        </TouchableOpacity>
      </View>
      {renderHomePage()}
    </SafeAreaView>
  )
}

export default HomePage