import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { UserContext } from '../userContext'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config'
import { Settings, ArrowLeft, Search } from 'lucide-react-native'
import { Image } from 'expo-image'
import Placeholder from '@/assets/icons/blankProfile.png'
import FriendCard from './(profile components)/friendCard'
import FriendRequestCard from './(profile components)/friendRequestCard'
import SearchCard from './(profile components)/searchCard'
import FriendPendingCard from './(profile components)/friendPendingCard'
import { doc, getDoc } from 'firebase/firestore'

const ProfilePage = () => {
  const userData = React.useContext(UserContext)
  console.log("Profile Page userData:", userData);
  const auth = FIREBASE_AUTH
  const [friendRequests, setFriendRequests] = useState<Array<{
    uid: string;
    name: string;
    profilePicture: string;
    id: string;
  }>>([])

  useEffect(() => {
    const fetchFriendRequests = async () => {
      console.log("Fetching friend requests, current array:", userData.friendRequests);
      
      // Clear friendRequests state if there are no requests
      if (!userData.friendRequests || userData.friendRequests.length === 0) {
        console.log("No friend requests, clearing state");
        setFriendRequests([]);
        return;
      }

      const requests = await Promise.all(
        userData.friendRequests.map(async (uid) => {
          const userDoc = await getDoc(doc(FIREBASE_DB, 'users', uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("Fetched friend request data:", data);
            return {
              uid: uid,
              name: data.name,
              id: data.id,
              profilePicture: data.profilePicture
            };
          }
          return null;
        })
      );
      const filteredRequests = requests.filter(request => request !== null);
      console.log("Setting friend requests to:", filteredRequests);
      setFriendRequests(filteredRequests);
    };

    fetchFriendRequests();
  }, [userData.friendRequests]);

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView>
      {/* Header */}
      <View className="flex-row justify-between items-center px-8">
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={() => router.back()}>
          <ArrowLeft size={30} color="#FFA1E7" fill="transparent" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={() => router.push('/(profile)/settingsPage')}>
          <Settings size={30} color="#FFA1E7" fill="transparent" />
        </TouchableOpacity>
      </View>
      {/* Profile Section */}
      <View className="flex-1 bg-secondary  justify-center px-5">
        <View className="flex items-center gap-y-5">
          <View>
            <Image 
              source={userData.profilePicture}
              style={{width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.25, shadowRadius: 4}}
              contentFit="cover"
              placeholder={Placeholder}
            />
          </View>
          <View>
            <Text className="text-primary text-5xl text-center font-f600">{userData.name}</Text>
            <Text className="text-grey text-xl text-center font-f200">#{userData.id.split('#')[1]}</Text>
          </View>
        </View>

        {/* Friend Section */}
        {userData.friend && (
          <View>
            <Text className="text-darkGrey text-2xl font-f200 py-5">Friend</Text>
            <View className="gap-y-5">
              <FriendCard uid={userData.friend} />
            </View>
          </View>
        )}
        
        {/* Friend Requests Section */}
        {!userData.friend && !userData.friendPending && (
          <View>
            <Text className="text-darkGrey text-2xl font-f200 py-5">Friend Requests</Text>
            <View className="gap-y-5">
              {friendRequests.map((request) => (
                <FriendRequestCard
                  key={request.uid}
                  uid={request.uid}
                  name={request.name}
                  profilePicture={request.profilePicture}
                  id={request.id}
                />
              ))}
              <SearchCard />
            </View>
          </View>
        )}

        {/* Friend Request Sent Section */}
        {userData.friendPending && (
          <View>
            <Text className="text-darkGrey text-2xl font-f200 py-5">Sent Request</Text>
            <View className="gap-y-5">
              <FriendPendingCard uid={userData.friendPending} />
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          onPress={async () => {
            try {
              await signOut(auth);
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }}
          className="mt-10 bg-red-500 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-f600">Logout</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfilePage