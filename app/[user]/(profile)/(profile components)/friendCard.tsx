import { Image } from 'expo-image'
import React from 'react'
import { View, Text } from 'react-native'
import Placeholder from '@/assets/icons/blankProfile.png'
import { doc } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config'

interface FriendCardProps {
    uid: string;
}

const FriendCard = ({uid}: FriendCardProps) => {
    const [friend, setFriend] = React.useState<{
        name: string;
        profilePicture: string;
        id: string;
    }>({
        name: '',
        profilePicture: '',
        id: ''
    })

    React.useEffect(() => {
        const fetchSentRequest = async () => {
            const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid))
            if (userDoc.exists()) {
                const data = userDoc.data()
                setFriend({
                    name: data.name,
                    profilePicture: data.profilePicture === 'default' || !data.profilePicture
                                ? require('@/assets/icons/blankProfile.png')
                                : data.profilePicture,
                    id: data.id
                })
            }
        }

        if (uid) {
            fetchSentRequest()
        }
    }, [uid])
  return (
    <View className="flex-row w-full items-center bg-white justify-between rounded-2xl p-3">
        <View className="flex-row items-center gap-x-5 w-4/5">
            <View className="bg-white rounded-full">
                <Image 
                source={friend.profilePicture}
                style={{width: 75, height: 75, borderRadius: 37.5}}
                contentFit="cover"
                placeholder={Placeholder}
                />
            </View>
            <View className="flex-1">
                <Text className="text-primary text-2xl font-f600 ">{friend.name}</Text>
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