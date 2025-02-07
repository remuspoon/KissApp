import { Image } from 'expo-image'
import React from 'react'
import { View, Text, TouchableOpacity, Modal, SafeAreaView, ActivityIndicator } from 'react-native'
import Placeholder from '@/assets/icons/blankProfile.png'
import { doc } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore';
import { FIREBASE_APP, FIREBASE_DB } from '@/firebase.config'
import { getFunctions, httpsCallable } from 'firebase/functions'

interface FriendCardProps {
    uid: string;
}

const FriendCard = ({uid}: FriendCardProps) => {
    const [modalVisible, setModalVisible] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const functions = getFunctions(FIREBASE_APP)
    const removeFriend = async () => {
        try {
          setLoading(true)
          const removeFriend = httpsCallable(functions, "removeFriend");
          await removeFriend({ uid });
          setLoading(false)
        } catch (error) {
          console.error("Error removing pending friend request:", error);
          setLoading(false)
        }
      };
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
    <>
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
              <Text className="text-darkGrey text-2xl font-f400">Remove your friend?</Text>
              <View className="flex-row justify-center items-center gap-x-5">
                <TouchableOpacity 
                  className="bg-primary py-2 rounded-lg p-5" 
                  onPress={async () => {await removeFriend(); setModalVisible(false)}}
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
    </TouchableOpacity>
    </>
    )
}

export default FriendCard