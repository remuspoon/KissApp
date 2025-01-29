import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'

interface FriendSearchCardProps {
    friendProfile: string;
    friendName: string;
    friendId: string;
}

const AddFriend = ({ friendProfile, friendName, friendId }: FriendSearchCardProps) => {
  return (
    <View className="flex rounded-2xl p-4 items-center gap-y-5">
      <Image 
        source={friendProfile || Placeholder} 
        style={{width: 200, height: 200, borderRadius: 100, borderWidth: 6, borderColor: 'white', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.25, shadowRadius: 4}} 
        contentFit="cover"
        placeholder={Placeholder}
      />
      <View className="flex items-center">
        <Text className="text-primary text-5xl font-f600 text-center">{friendName}</Text>
        <Text className="text-grey text-xl font-f200 text-center">#{friendId.split('#')[1]}</Text>
      </View>
      <TouchableOpacity className="bg-primary rounded-xl px-5 py-4 justify-center items-center">
        <Text className="text-white text-xl font-f500">Add Friend</Text>
      </TouchableOpacity> 
    </View>
  )
}

export default AddFriend