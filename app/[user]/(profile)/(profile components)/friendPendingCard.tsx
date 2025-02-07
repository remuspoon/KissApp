import { View, Text, Modal, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'
import { getDoc, doc } from 'firebase/firestore'
import { FIREBASE_APP, FIREBASE_DB } from '@/firebase.config'
import { getFunctions } from 'firebase/functions'
import { httpsCallable } from 'firebase/functions'

interface FriendPendingCardProps {
    uid: string;
}

const FriendPendingCard = ({ uid }: FriendPendingCardProps) => {
    const [modalVisible, setModalVisible] = useState(false)
    const functions = getFunctions(FIREBASE_APP)
    const [loading, setLoading] = useState(false)
    const [friendRequest, setFriendRequest] = React.useState<{
        name: string;
        profilePicture: string;
        id: string;
    }>({
        name: '',
        profilePicture: '',
        id: ''
    })
    const removePendingFriendRequest = async () => {
        try {
          setLoading(true)
          const removePendingFriendRequest = httpsCallable(functions, "removePendingFriendRequest");
          await removePendingFriendRequest({ uid });
          setLoading(false)
        } catch (error) {
          console.error("Error removing pending friend request:", error);
          setLoading(false)
        }
      };

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
    <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <SafeAreaView className="flex-1 bg-black/30 justify-center items-center">
            <View className="flex justify-center items-center bg-white rounded-2xl p-10 gap-y-5">
              <Text className="text-darkGrey text-2xl font-f400">Remove your friend request?</Text>
              <View className="flex-row justify-center items-center gap-x-5">
                <TouchableOpacity 
                  className="bg-primary py-2 rounded-lg p-5" 
                  onPress={() => {removePendingFriendRequest(); setModalVisible(false)}}
                >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text className="text-white text-xl text-center font-f600">Remove</Text>}
          </TouchableOpacity>
          <TouchableOpacity className="bg-grey py-2 rounded-lg p-5" onPress={() => setModalVisible(false)}>
            <Text className="text-white text-xl text-center font-f600" disabled={loading}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  </Modal>
    <TouchableOpacity className="flex-row w-full items-center bg-white justify-between rounded-2xl p-3" onPress={() => setModalVisible(true)}>
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
    </TouchableOpacity>
    </View>
  )
}

export default FriendPendingCard