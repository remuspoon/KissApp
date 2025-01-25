import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { UserContext } from '../userContext'
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '@/firebase.config'
import { ArrowLeft } from 'lucide-react-native'
import * as ImagePicker from 'expo-image-picker'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'

const SettingsPage = () => {
  const userData = React.useContext(UserContext)
  const auth = FIREBASE_AUTH
  const [loading, setLoading] = React.useState(false)
  const profilePicture = userData.profilePicture === 'default' || !userData.profilePicture
    ? require('@/assets/icons/blankProfile.png')
    : { uri: userData.profilePicture }
  const [name, setName] = React.useState(userData.name)
  const [id, setId] = React.useState(userData.id)
  const [newProfilePicture, setNewProfilePicture] = React.useState('')

  const handleNameChange = (newName: string) => {
    setName(newName)
    const identifier = userData.id.split('#')[1]
    const newId = `${newName.replace(/\s+/g, '').toLowerCase()}#${identifier}`
    setId(newId)
  }

  const saveChanges = async () => {
    setLoading(true)
    try {
      const user = auth.currentUser
      if (!user) return

      let profileImageUrl = userData.profilePicture

      // Upload new profile picture if changed
      if (newProfilePicture) {
        const storageRef = ref(FIREBASE_STORAGE, `profilePictures/${user.uid}`)
        const response = await fetch(newProfilePicture)
        const blob = await response.blob()
        await uploadBytes(storageRef, blob)
        profileImageUrl = await getDownloadURL(storageRef)
      }

      // Update Firestore
      await updateDoc(doc(FIREBASE_DB, 'users', user.uid), {
        name,
        id,
        profilePicture: profileImageUrl
      })

      // Refresh user data
      await userData.fetchUserData()
      router.back()
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1,1],
      quality: 1
    })
    
    if (!result.canceled) {
      setNewProfilePicture(result.assets[0].uri)
    }
  }

  // Update the profile picture source to use newProfilePicture when available
  const displayPicture = newProfilePicture 
    ? { uri: newProfilePicture }
    : (userData.profilePicture === 'default' || !userData.profilePicture
        ? require('@/assets/icons/blankProfile.png')
        : { uri: userData.profilePicture })

  return (
    <SafeAreaView className="flex-1 bg-secondary">
        {/* Navbar */}
      <View className="flex-row justify-between items-center px-8 mb-5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-white rounded-full p-2"
        >
          <ArrowLeft size={30} color="#FFA1E7" fill="transparent" />
        </TouchableOpacity>
      </View>
        {/* Profile */}
      <View className="flex-1 bg-secondary px-8">
        <View className="flex items-center gap-y-10">
          <TouchableOpacity onPress={pickImage}>
            <Image source={displayPicture} className="w-44 h-44 rounded-full" />
          </TouchableOpacity>
          <View className="flex-row bg-white w-full p-5 rounded-2xl">
            <View className="flex gap-y-5 w-1/2">
              <Text className="text-darkGrey font-f600 text-xl border-b border-lightGrey pb-4">Name</Text>
              <Text className="text-darkGrey font-f600 text-xl border-b border-lightGrey pb-4">ID</Text>
              <Text className="text-darkGrey font-f600 text-xl border-b border-lightGrey pb-4">Birthday</Text>
              <Text className="text-darkGrey font-f600 text-xl">Gender</Text>
            </View>
            <View className="flex gap-y-5 w-1/2">
              <TextInput className="text-black text-xl border-b border-lightGrey pb-4"
                value={name}
                onChangeText={handleNameChange}
              />
              <Text className="text-darkGrey text-xl border-b border-lightGrey pb-4">{id}</Text>
              <Text className="text-darkGrey text-xl border-b border-lightGrey pb-4">{userData.birthday}</Text>
              <Text className="text-darkGrey text-xl capitalize">{userData.gender}</Text>
            </View>
          </View>
          <TouchableOpacity 
            className="bg-white p-4 rounded-xl"
            onPress={saveChanges}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ED40C5" />
            ) : (
              <Text className="text-accent text-center text-lg font-f600">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SettingsPage