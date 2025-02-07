import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useState, useContext } from 'react'
import { FIREBASE_AUTH } from '@/firebase.config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'expo-router'
import { UserContext } from '../[user]/userContext'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH
  const router = useRouter()

  const SignIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      console.log(response)
      router.replace("/[user]/homePage")
    } catch (error: any) {
        console.log(error)
        alert('Login failed: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <View className="w-full gap-y-4">
      <View>
        <Text className="text-darkGrey font-f400 mb-2">Email</Text>
        <TextInput 
          className="bg-white p-4 rounded-xl font-f400"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9D9D9D"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View>
        <Text className="text-darkGrey font-f400 mb-2">Password</Text>
        <TextInput 
          className="bg-white p-4 rounded-xl font-f400"
          placeholder="Enter your password"
          placeholderTextColor="#9D9D9D"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity onPress={()=>SignIn()} className="bg-white p-4 rounded-xl mt-4">
        <View className="h-[28px] justify-center">
          { loading ? 
            <ActivityIndicator size="small" color="#FFA1E7" /> : 
            <Text className="text-primary text-center font-f600 text-lg">Log In</Text> 
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default LoginForm 