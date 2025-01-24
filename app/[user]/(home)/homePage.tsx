import { View, Text, Image, SafeAreaView, TouchableOpacity, Animated } from 'react-native'
import React, { useContext, useRef } from 'react'
import { UserContext } from '../userContext'
import { Heart } from 'lucide-react-native'
import { router } from 'expo-router'

const HomePage = () => {
  const userData = useContext(UserContext)
  const profilePicture = userData.profilePicture === 'default' || !userData.profilePicture
    ? require('@/assets/icons/blankProfile.png')
    : { uri: userData.profilePicture }
  
  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="bg-secondary items-end p-5">
        <TouchableOpacity 
          onPress={() => router.push('/(profile)/profilePage')}>
          <View>
            <Image source={profilePicture} className="w-20 h-20 rounded-full" />
          </View>
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-secondary items-center justify-center gap-y-10 px-5" >
        <TouchableOpacity 
          className="w-2/3 aspect-square rounded-full bg-white items-center justify-center"
          activeOpacity={.5}>
            <View className="pt-6">
              <Heart size={170} fill="#FF6C6E" color="#FF6C6E" />
            </View>
          </TouchableOpacity>
        <View className="flex-col items-center justify-center gap-y-2">
          <Text className="text-primary text-5xl text-center font-f500">Send</Text>
          <Text className="text-primary text-6xl text-center font-f600">{userData.name}</Text>
          <Text className="text-primary text-5xl text-center font-f500">a kiss</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomePage