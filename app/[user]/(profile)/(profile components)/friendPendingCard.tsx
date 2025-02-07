import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'
import { getDoc, doc } from 'firebase/firestore'
import { FIREBASE_DB } from '@/firebase.config'

interface FriendPendingCardProps {
    uid: string;
}

const FriendPendingCard = ({ uid }: FriendPendingCardProps) => {
    const [friendRequest, setFriendRequest] = React.useState<{
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
                setFriendRequest({
                    name: data.name,
                    id: data.id,
                    profilePicture: data.profilePicture === 'default' || !data.profilePicture
                                ? require('@/assets/icons/blankProfile.png')
                                : data.profilePicture
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
                source={friendRequest.profilePicture}
                style={{width: 75, height: 75, borderRadius: 37.5}}
                contentFit="cover"
                placeholder={Placeholder}
                />
            </View>
            <View className="flex-1">
                <Text className="text-grey text-lg font-f400 ">Friend Request sent to:</Text>
                <Text className="text-primary text-2xl font-f600 ">{friendRequest.name} <Text className="text-grey text-lg font-f400">#{friendRequest.id.split('#')[1]}</Text></Text>
            </View>
        </View>
    </View>
  )
}

export default FriendPendingCard