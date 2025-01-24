import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Heart } from 'lucide-react-native'
import Toggle from './accountToggle'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center p-8 gap-y-8">
            <View className="flex items-center">
              <Heart size={100} fill="white" color="white" />
              <Text className="text-white text-6xl font-f600 text-center">Welcome to Kiss</Text>
            </View>
            <Toggle activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'login' ? 
              <LoginForm /> : 
              <SignupForm />
            }
            <View className="flex-row items-center mt-4">
              <View className="flex-1 h-[1px] bg-white" />
              <Text className="text-darkGrey mx-4 font-f400">Or login with</Text>
              <View className="flex-1 h-[1px] bg-white" />
            </View>        
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login