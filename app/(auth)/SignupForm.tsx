import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '@/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH

  const SignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log(response)
    } catch (error) {
        console.log(error)
        alert('Signup failed')
    } finally {
        setLoading(false)
    }
  }

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
        {errors.email ? (
          <Text className="text-red font-f400 mt-1">{errors.email}</Text>
        ) : null}
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
        onPress={() => SignUp()}
        >
        <View className="h-[28px] justify-center">
          { loading ? 
            <ActivityIndicator size="small" color="#FFA1E7" /> : 
            <Text className="text-primary text-center font-f600 text-lg">Sign Up</Text> 
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default SignupForm 