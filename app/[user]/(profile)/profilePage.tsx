import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router'
import { UserContext } from '../userContext'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '@/firebase.config'
import { Settings, ArrowLeft } from 'lucide-react-native'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'

const ProfilePage = () => {
  const userData = React.useContext(UserContext)
  const auth = FIREBASE_AUTH

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="flex-row justify-between items-center px-8">
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={() => router.back()}>
          <ArrowLeft size={30} color="#FFA1E7" fill="transparent" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={() => router.push('/(profile)/settingsPage')}>
          <Settings size={30} color="#FFA1E7" fill="transparent" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-secondary  justify-center px-5">
        <View className="flex items-center gap-y-5">
          <View>
            <Image 
              source={userData.profilePicture}
              style={{width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.25, shadowRadius: 4}}
              contentFit="cover"
              placeholder={Placeholder}
            />
          </View>
          <View>
            <Text className="text-primary text-5xl text-center font-f600">{userData.name}</Text>
            <Text className="text-grey text-xl text-center font-f200">#{userData.id.split('#')[1]}</Text>
          </View>
        </View>
        <View>
          <Text className="text-grey text-2xl font-f200 py-5">Friend</Text>
          <View className="flex-row bg-white gap-x-5">
            <Text>Friend</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={async () => {
            try {
              await signOut(auth);
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }}
          className="mt-10 bg-red-500 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-f600">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ProfilePage