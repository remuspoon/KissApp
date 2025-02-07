import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react-native'
import { router } from 'expo-router'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { FIREBASE_DB } from '@/firebase.config'
import AddFriend from './addFriend'
const searchPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState<any>(null)
    const [newSearch, setNewSearch] = useState(false)
    const [firstSearch, setFirstSearch] = useState(true)

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const usersRef = collection(FIREBASE_DB, 'users')
            const q = query(usersRef, where('id', '==', search.toLowerCase().trim()))
            const querySnapshot = await getDocs(q)

            if(!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                
                setSearchResult({
                    ...userData,
                    docUid: userDoc.id,
                    profilePicture: userData.profilePicture === 'default' || !userData.profilePicture
                                ? require('@/assets/icons/blankProfile.png')
                                : userData.profilePicture
                })  
                console.log('Full user data with docUid:', {
                    ...userData,
                    docUid: userDoc.id
                });
            } else {
                setSearchResult(null)
                console.log('User not found')
            }

        } catch (error) {
            console.error(error)
            setSearchResult(error)
        } finally {
            setIsLoading(false)
        }
    }

    const renderCase = () => {
        switch(searchResult) {
            case null:
                return (
                    <View className="flex items-center gap-y-8 w-full p-8">
                        <Text className="text-darkGrey text-3xl font-f500 text-center">User not found</Text>
                    </View>
                )
            case 'error':
                return (
                    <View className="flex items-center gap-y-8 w-full p-8">
                        <Text className="text-primary text-4xl font-f500 text-center">Something went wrong</Text>
                    </View>
                )
            default:
                return (
                    <View className="flex items-center gap-y-5">
                        <AddFriend 
                            userProfile={searchResult.profilePicture} 
                            uid={searchResult.docUid}
                            userName={searchResult.name} 
                            userId={searchResult.id} 
                            userFriendRequests={searchResult.friendRequests || []}
                            userFriend={searchResult.friend || null}
                        />
                    </View>
                )
        }
    }

  return (
    <SafeAreaView className="bg-secondary h-full">
    <ScrollView contentContainerStyle={{ height: "100%" }}>
        <KeyboardAvoidingView>
            <View className="flex-row justify-between items-center px-8">
                <TouchableOpacity
                className="bg-white rounded-full p-2"
                onPress={() => router.back()}>
                    <ArrowLeft size={30} color="#FFA1E7" fill="transparent" />
                </TouchableOpacity>
            </View>
            <View className="flex items-center gap-y-8 w-full p-8">
                    <Text className="text-primary text-4xl font-f500 text-center">Find your friend</Text>
                    <View className="w-full flex-row bg-white rounded-2xl p-2">
                        <TextInput
                            className="w-10/12 rounded-xl px-4"
                            placeholder="for example: John#4h2nc"
                            placeholderTextColor="#6C7278"
                            value={search}
                            onChangeText={(text: string) => {
                                setSearch(text)
                                setNewSearch(true)
                            }}
                        />
                        <TouchableOpacity 
                            className="bg-primary rounded-xl p-4 justify-center items-center"
                            disabled={!newSearch}
                            onPress={() => {
                                handleSearch()
                                setNewSearch(false)
                                setFirstSearch(false)
                            }}
                        >
                            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Search size={20} color="white" fill="transparent" />}
                        </TouchableOpacity>
                    </View>
            </View>
            <View className="flex bg-secondary justify-center px-8">
                {!isLoading && !firstSearch && renderCase()}
            </View>
        </KeyboardAvoidingView>
    </ScrollView>
   </SafeAreaView>
  )
}

export default searchPage