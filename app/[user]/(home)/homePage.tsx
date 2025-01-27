import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { UserContext } from '../userContext'
import { Heart } from 'lucide-react-native'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'

const HomePage = () => {
  const userData = useContext(UserContext)
  useEffect(() => {
    console.log(userData.profilePicture)
  }, [])
  
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
      <View className="flex-1 bg-secondary items-center justify-center gap-y-10 px-5" >
        <TouchableOpacity 
          className="w-2/3 aspect-square rounded-full bg-white items-center justify-center"
          activeOpacity={.5}>
            <View className="pt-6">
              <Heart size={150} fill="#FF6C6E" color="#FF6C6E" />
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