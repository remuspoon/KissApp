import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'expo-router'
import { doc, setDoc } from 'firebase/firestore'

type UserData = {
  name: string;
  birthday: string;
  gender: string;
  profilePicture: string | null;
}

const SignupForm = ({ setShowLogin }: { setShowLogin: (show: boolean) => void }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [onboarding, setOnboarding] = useState(false)
  const [step, setStep] = React.useState(0)
  const [userData, setUserData] = React.useState<UserData>({
    name: '',
    birthday: '',
    gender: '',
    profilePicture: ''
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH
  const router = useRouter()

  useEffect(() => {
    setShowLogin(!onboarding)
  }, [onboarding])

  const SignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log(response)
    } catch (error: any) {
        console.log(error)
        alert('Signup failed: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

  const saveUserData = async () => {
    try {
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(FIREBASE_DB, "users", user.uid), userData);
        router.replace("/(home)/homePage");
      }
    } catch (error) {
      console.log(error);
      alert('Failed to save user data');
    }
  }

  const handleContinue = () => {
    if (step === 0 && userData.name.trim() === '') {
      alert('Please enter your name')
      return
    }
    if (step === 1 && userData.birthday.trim() === '') {
      alert('Please enter your birthday')
      return
    }
    if (step === 2 && userData.gender.trim() === '') {
      alert('Please enter your gender')
      return
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return(
          <View>
            <Text className="text-white font-f400 mb-2">Name</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl font-f400"
              placeholder="Enter your name"
              value={userData.name}
              onChangeText={(text) => setUserData({...userData, name: text})}
            />
          </View>
        )
      case 1:
        return(
          <View>
            <Text className="text-white font-f400 mb-2">Birthday</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl font-f400"
              placeholder="DD/MM/YYYY"
              value={userData.birthday}
              onChangeText={(text) => setUserData({...userData, birthday: text})}
            />
          </View>
        )
      case 2:
        return(
          <View>
            <Text className="text-white font-f400 mb-2">Gender</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl font-f400"
              placeholder="Enter your gender"
              value={userData.gender}
              onChangeText={(text) => setUserData({...userData, gender: text})}
            />
          </View>
        )
      case 3:
        return(
          <View></View>
        )
    }
  }

  //Form Validation Functions

  const validateEmail = (value: string) => {
    setEmail(value)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        email: ''
      }))
    }
  }

  const validatePassword = (value: string) => {
    setPassword(value)
    if (value.length < 8) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must be at least 8 characters long'
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        password: ''
      }))
    }
  }

  const validateConfirmPassword = (value: string) => {
    setConfirmPassword(value)
    if (value !== password) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }))
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }))
    }
  }

  return (
    <View className="w-full gap-y-4">
      {!onboarding ? (<>
          <View>
            <Text className="text-darkGrey font-f400 mb-2">Email</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl font-f400"
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor="#9D9D9D"
              value={email}
              onChangeText={validateEmail}
              autoCapitalize="none"
            />
            {errors.email && <Text className="text-red font-f400 mt-1">{errors.email}</Text>}
          </View>
          <View>
            <Text className="text-darkGrey font-f400 mb-2">Password</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl font-f400"
              placeholder="Enter your password"
              placeholderTextColor="#9D9D9D"
              secureTextEntry
              value={password}
              onChangeText={validatePassword}
            />
            {errors.password ? (
              <Text className="text-red font-f400 mt-1">{errors.password}</Text>
            ) : null}
          </View>
          <View>
            <Text className="text-darkGrey font-f400 mb-2">Confirm Password</Text>
            <TextInput 
              className="bg-white p-4 rounded-xl font-f400"
              placeholder="Confirm your password"
              placeholderTextColor="#9D9D9D"
              secureTextEntry
              value={confirmPassword}
              onChangeText={validateConfirmPassword}
            />
            {errors.confirmPassword ? (
              <Text className="text-red font-f400 mt-1">{errors.confirmPassword}</Text>
            ) : null}
          </View>
          <TouchableOpacity 
            className={`bg-white p-4 rounded-xl mt-4 ${
              (errors.email || errors.password || errors.confirmPassword || !email || !password || !confirmPassword) 
              ? 'opacity-50' 
              : 'opacity-100'
            }`}
            disabled={!!errors.email || !!errors.password || !!errors.confirmPassword || !email || !password || !confirmPassword}
            onPress={() => {
              setOnboarding(true)
            }}
            >
            <View className="h-[28px] justify-center">
              { loading ? 
                <ActivityIndicator size="small" color="#FFA1E7" /> : 
                <Text className="text-primary text-center font-f600 text-lg">Sign Up</Text> 
              }
            </View>
          </TouchableOpacity>
        </>
      ) : (
      <View className="flex-1 bg-primary p-8">
        <View className="gap-y-4">
          {renderStep()}
          {step < 3 && (
            <TouchableOpacity 
            className="bg-white p-4 rounded-xl mt-4"
            onPress={() => {
            handleContinue()
            setStep(step + 1)
            }}>
            <Text className="text-primary text-center font-f600 text-lg">
              Continue
            </Text>
            </TouchableOpacity>
           )}
          {step === 3 && (
            <TouchableOpacity 
              className="bg-white p-4 rounded-xl mt-4"
              onPress={() => {
                SignUp()
                saveUserData()
              }}
            >
            <Text className="text-primary text-center font-f600 text-lg">
              Create Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>        
      )}
    </View>
  )
}

export default SignupForm 