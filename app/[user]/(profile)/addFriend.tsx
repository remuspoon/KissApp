import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { getFunctions, httpsCallable } from 'firebase/functions'
import Placeholder from '@/assets/icons/blankProfile.png'
import { FIREBASE_APP } from '@/firebase.config';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '@/firebase.config';

interface FriendSearchCardProps {
    userProfile: string;
    userName: string;
    userId: string;
    uid: string;
    userFriendRequests: string[];
    userFriend: string | null;
}

const AddFriend = ({ userProfile, userName, userId, uid, userFriendRequests, userFriend }: FriendSearchCardProps) => {
  const auth = FIREBASE_AUTH;
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (userFriendRequests.includes(auth.currentUser?.uid || '')) {
      setPending(true)
    }
  }, [userFriendRequests])

  const handleAddFriend = async () => {
    try {
      setLoading(true)
      const functions = getFunctions(FIREBASE_APP);
      const addFriendRequest = httpsCallable(functions, 'addFriendRequest');
      
      const result = await addFriendRequest({ uid });
      console.log('Friend request sent:', result.data);
      setLoading(false)
      setPending(true)
    } catch (error) {
      console.error('Error sending friend request:', error);
      setLoading(false)
    }
  };
  return (
    <View className="flex rounded-2xl p-4 items-center gap-y-5">
      <Image 
        source={userProfile || Placeholder} 
        style={{width: 200, height: 200, borderRadius: 100, borderWidth: 6, borderColor: 'white', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.25, shadowRadius: 4}} 
        contentFit="cover"
        placeholder={Placeholder}
      />
      <View className="flex items-center">
        <Text className="text-primary text-5xl font-f600 text-center">{userName}</Text>
        <Text className="text-grey text-xl font-f200 text-center">#{userId.split('#')[1]}</Text>
      </View>
      {!pending ? (<TouchableOpacity className="bg-primary rounded-xl px-5 py-4 justify-center items-center"
        onPress={handleAddFriend}
      >
        {loading ? (<ActivityIndicator size="small" color="#fff" />):(<Text className="text-white text-xl font-f500">Add Friend</Text>)}
      </TouchableOpacity>):(
        <TouchableOpacity className="bg-grey rounded-xl px-5 py-4 justify-center items-center"
        disabled={true}
      >
        <Text className="text-white text-xl font-f500">Pending</Text>
      </TouchableOpacity> 
      )}
      
    </View>
  )
}

export default AddFriend