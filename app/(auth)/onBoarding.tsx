import { View, Text, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { UserData } from './SignupForm';
import { Heart } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const onBoarding = () => {
    const params = useLocalSearchParams();
    const [userData, setUserData] = React.useState<UserData>({
      name: (params.name as string) || '',
      birthday: (params.birthday as string) || '',
      gender: (params.gender as string) || '',
      profilePicture: (params.profilePicture as string) || '',
      email: (params.email as string) || '',
      password: (params.password as string) || ''
    });
    const [step, setStep] = React.useState(0)
    const formValidation = (step: number) => {
        switch (step) {
            case 0:
                if (userData.name.trim() === '') {
                    return false
                }
                return true
            case 1:
                return true
            case 2:
                return true
            case 3:
                return true
        }
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
                        className={`w-full bg-white rounded-xl p-4 ${formValidation(step) ? 'opacity-100' : 'opacity-50'}`}
                        disabled={!formValidation(step)}
                        onPress={() => {
                            if (formValidation(step)) {
                                setStep(step + 1)
                            }
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
                        className={`w-full bg-white rounded-xl p-4 ${formValidation(step) ? 'opacity-100' : 'opacity-50'}`}
                        disabled={!formValidation(step)}
                        onPress={() => {
                            if (formValidation(step)) {
                                setStep(step + 1)
                                console.log(userData)
                            }
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
                        className={`w-full bg-white rounded-xl p-4 ${formValidation(step) ? 'opacity-100' : 'opacity-50'}`}
                        disabled={!formValidation(step)}
                        onPress={() => {
                            if (formValidation(step)) {
                                setStep(step + 1)
                                console.log(userData)
                            }
                        }}
                    >
                        <Text className="text-accent text-center font-f600">Next</Text>
                    </TouchableOpacity>
                </View>
            )
        case 3:
            return (
                <View className="flex items-center gap-y-8">
                    <Heart size={100} fill="white" color="white" />
                    <Text className="text-white text-6xl font-f600 text-center">Upload a profile picture</Text>
                </View> 
            )
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