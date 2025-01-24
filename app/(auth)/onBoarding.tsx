import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { UserData } from './SignupForm';
import { Heart } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '@/firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const onBoarding = () => {
    const params = useLocalSearchParams();
    const [userData, setUserData] = React.useState<UserData>({
      name: (params.name as string) || '',
      birthday: (params.birthday as string) || '',
      gender: (params.gender as string) || '',
      profilePicture: '',  
      email: (params.email as string) || '',
      password: (params.password as string) || ''
    });
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')
    const auth = FIREBASE_AUTH
    const db = FIREBASE_DB
    const storage = FIREBASE_STORAGE

    React.useEffect(() => {
      setUserData(prev => ({
        ...prev,
        profilePicture: require('../../assets/icons/blankProfile.png')
      }));
    }, []);

    const [step, setStep] = React.useState(0)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1,1],
            quality: 1
        })
        console.log(userData)
        if (!result.canceled) {
            setUserData(prev => ({
                ...prev,
                profilePicture: result.assets[0].uri
            }))
        }
    }
    const formValidation = () => {
        if (userData.name.trim() === '') {
            return false
        }
        return true
    }
    const renderStep = (step: number) => {
        switch (step) {
        case 0:
            return (
                <View className="flex-1 items-center gap-y-8 w-full">
                    <Heart size={100} fill="white" color="white" />
                    <Text className="text-white text-6xl font-f600 text-center">What is your name?</Text>
                    <TextInput
                        className="w-full h-12 bg-white rounded-xl p-4"
                        placeholder="Name"
                        value={userData.name}
                        onChangeText={(text: string) => setUserData({ ...userData, name: text })}
                    />
                    <TouchableOpacity 
                        className={`w-full bg-white rounded-xl p-4 ${formValidation() ? 'opacity-100' : 'opacity-50'}`}
                        disabled={!formValidation()}
                        onPress={() => {
                            setStep(step + 1)
                        }}
                    >
                        <Text className="text-accent text-center font-f600">Next</Text>
                    </TouchableOpacity>
                </View>
            )
        case 1:
            return (
                <View className="flex-1 items-center gap-y-8 w-full">
                    <Heart size={100} fill="white" color="white" />
                    <Text className="text-white text-6xl font-f600 text-center">What is your birthday?</Text>
                    <View className="w-full bg-white rounded-xl p-2">
                        <DateTimePicker
                        value={userData.birthday ? new Date(userData.birthday) : new Date()}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => {
                            if (date) {
                                setUserData(prev => ({
                                    ...prev,
                                    birthday: date.toISOString().split('T')[0]
                                }))
                            }
                        }}
                        />
                    </View>
                    <TouchableOpacity 
                        className={`w-full bg-white rounded-xl p-4`}
                        onPress={() => {
                            setStep(step + 1)
                            console.log(userData)
                        }}
                    >
                        <Text className="text-accent text-center font-f600">Next</Text>
                    </TouchableOpacity>
                </View>
            )
        case 2:
            return (
                <View className="flex-1 items-center gap-y-8 w-full">
                    <Heart size={100} fill="white" color="white" />
                    <Text className="text-white text-6xl font-f600 text-center">What is your gender?</Text>
                    <View className="w-full bg-white rounded-xl">
                        <Picker
                            selectedValue={userData.gender}
                            onValueChange={(itemValue) => setUserData({ ...userData, gender: itemValue })}
                        >
                        <Picker.Item label="Man" value="man" />
                        <Picker.Item label="Woman" value="woman" />
                        <Picker.Item label="Non-binary" value="non-binary" />
                            <Picker.Item label="Prefer not to say" value="Prefer not to say" />
                        </Picker>
                    </View>
                    <TouchableOpacity 
                        className={`w-full bg-white rounded-xl p-4`}
                        onPress={() => {
                            setStep(step + 1)
                        }}
                    >
                        <Text className="text-accent text-center font-f600">Next</Text>
                    </TouchableOpacity>
                </View>
            )
        case 3:
            return (
                <View className="flex-1 items-center gap-y-8 w-full">
                    <Heart size={100} fill="white" color="white" />
                    <Text className="text-white text-6xl font-f600 text-center">Upload a profile picture</Text>
                    <TouchableOpacity className="flex items-center bg-white rounded-full p-2" onPress={pickImage}>
                        <Image 
                            className="w-[200px] h-[200px] rounded-full" 
                            source={typeof userData.profilePicture === 'string' 
                                ? { uri: userData.profilePicture }
                                : userData.profilePicture}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity className={`w-full bg-white rounded-xl p-4`}
                        onPress={() => {
                            createUser()
                        }}
                    >
                        {loading ? <ActivityIndicator size="small" color="#0000ff" /> : <Text className="text-accent text-center font-f600">Create Account</Text>}
                    </TouchableOpacity>
                </View> 
            )
        }
    }
    const createUser = async () => {
        setLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
            const user = userCredential.user
            let profileImageUrl = ''
            if (typeof userData.profilePicture === 'string' && userData.profilePicture.startsWith('file')) {
                try {
                    const storageRef = ref(storage, `profilePictures/${user.uid}.jpg`)
                    const response = await fetch(userData.profilePicture)
                    if (!response.ok) throw new Error('Failed to fetch image')
                    
                    const blob = await response.blob()
                    console.log('Blob size:', blob.size)
                    
                    await uploadBytes(storageRef, blob)
                    profileImageUrl = await getDownloadURL(storageRef)
                } catch (uploadError) {
                    console.log('Upload error:', uploadError)
                    profileImageUrl = 'default'
                }
            }

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: userData.name,
                birthday: userData.birthday,
                gender: userData.gender,
                email: userData.email,
                profilePicture: profileImageUrl || 'default' // Store URL or 'default' string
            })

            router.replace("/[...user]/(home)/homePage")
        } catch (error: any) {
            setError(error.message)
            alert('Error creating user: ' + error.message + ' Please try again.')
            router.replace("/(auth)/login")
        } finally {
            setLoading(false)
        }
    }
  return (
    <SafeAreaView className="bg-primary h-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
     <View className="flex-1 items-center p-8 gap-y-8">
       {renderStep(step)}
     </View>
    </ScrollView>
   </SafeAreaView>
  )
}

export default onBoarding