import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { FIREBASE_APP } from '@/firebase.config'

interface FriendRequestCardProps {
    uid: string;
    name: string;
    id: string;
    profilePicture?: string;
}

const FriendRequestCard = ({ uid, name, id, profilePicture }: FriendRequestCardProps) => {
  const functions = getFunctions(FIREBASE_APP, 'us-central1');
  const [acceptLoading, setAcceptLoading] = React.useState(false)
  const [rejectLoading, setRejectLoading] = React.useState(false)

  const handleAccept = async () => {
    try {
      setAcceptLoading(true)
      const acceptFriendRequest = httpsCallable(functions, "acceptFriendRequest");
      await acceptFriendRequest({ uid });
      setAcceptLoading(false)
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setAcceptLoading(false)
    }
  };

  const handleReject = async () => {
    try {
        setRejectLoading(true)
        const rejectFriendRequest = httpsCallable(functions, "rejectFriendRequest");
        await rejectFriendRequest({ uid });
        setRejectLoading(false)
    } catch (error: any) {
        console.error("Error rejecting friend request:", error);
        setRejectLoading(false)
    }
  }
  
  return (
    <View className="flex-row w-full items-center bg-white rounded-2xl p-5">
        <View className="flex-row items-center gap-x-5 w-full">
            <View className="bg-white rounded-full">
                <Image 
                source={profilePicture}
                style={{width: 75, height: 75, borderRadius: 37.5}}
                contentFit="cover"
                placeholder={Placeholder}
                />
            </View>
            <View className="flex-1 gap-y-3">
                <Text className="text-primary text-2xl font-f600 ">{name} <Text className="text-grey text-lg font-f400">#{id.split('#')[1]}</Text></Text>
                <View className="flex-row w-full justify-between gap-x-3">
                    <TouchableOpacity className="flex-1 bg-primary rounded-lg px-4 py-2" disabled={acceptLoading || rejectLoading}
                    onPress={handleAccept}>
                        {acceptLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-white text-md font-f500 text-center">Confirm</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-grey rounded-lg px-4 py-2" disabled={rejectLoading || acceptLoading}
                    onPress={handleReject}>
                        {rejectLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-white text-md font-f500 text-center">Delete</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        
    </View>
  )
}

export default FriendRequestCard