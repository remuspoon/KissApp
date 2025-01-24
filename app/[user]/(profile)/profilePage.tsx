import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { UserContext } from '../userContext'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '@/firebase.config'

const ProfilePage = () => {
  const userData = React.useContext(UserContext)
  const auth = FIREBASE_AUTH
  const profilePicture = userData.profilePicture === 'default' || !userData.profilePicture
    ? require('@/assets/icons/blankProfile.png')
    : { uri: userData.profilePicture }

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="flex-row justify-start items-center px-5">
        <TouchableOpacity
          onPress={() => router.back()}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-secondary  justify-center px-5">
        <View className="flex items-center gap-y-5">
          <View>
            <Image source={profilePicture} className="w-60 h-60 rounded-full" />
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