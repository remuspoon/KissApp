import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type ToggleProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Toggle = ({ activeTab, setActiveTab }: ToggleProps) => {
  return (
    <View className="flex-row w-full bg-lightGrey rounded-xl p-2">
      <TouchableOpacity 
        className={`flex-1 p-3 ${activeTab === 'login' ? 'bg-white' : ''} rounded-lg`}
        onPress={() => setActiveTab('login')}
      >
        <Text className={`text-center font-f500 text-lg ${activeTab === 'login' ? 'text-accent' : 'text-darkGrey'}`}>
          Log In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className={`flex-1 p-3 ${activeTab === 'signup' ? 'bg-white' : ''} rounded-lg`}
        onPress={() => setActiveTab('signup')}
      >
        <Text className={`text-center font-f500 text-lg ${activeTab === 'signup' ? 'text-accent' : 'text-darkGrey'}`}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Toggle
