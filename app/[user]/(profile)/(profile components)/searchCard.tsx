import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Search } from 'lucide-react-native'
import { router } from 'expo-router'

const SearchCard = () => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => router.push('/(profile)/searchPage')}
        className="flex-row w-full items-center bg-white rounded-2xl p-5 gap-x-5"
      >
        <Search size={30} color="#6c7278" fill="transparent" />
        <Text className="text-darkGrey text-2xl font-f400">Find your friend</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SearchCard