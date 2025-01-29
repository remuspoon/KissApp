import { Image } from 'expo-image'
import React from 'react'
import { View, Text } from 'react-native'
import Placeholder from '@/assets/icons/blankProfile.png'

const FriendCard = () => {
  return (
    <View className="flex-row w-full items-center bg-white justify-between rounded-2xl p-3">
        <View className="flex-row items-center gap-x-5 w-4/5">
            <View className="bg-white rounded-full">
                <Image 
                source={Placeholder}
                style={{width: 75, height: 75, borderRadius: 37.5}}
                contentFit="cover"
                placeholder={Placeholder}
                />
            </View>
            <View className="flex-1">
                <Text className="text-primary text-2xl font-f600 ">Amaranta</Text>
            </View>
        </View>
        <View className="flex items-center gap-y-3">
            <Text>123 😘</Text>
            <Text>123 🔥</Text>
        </View>
    </View>
    )
}

export default FriendCard