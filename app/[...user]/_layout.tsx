import React from 'react'
import { Stack } from 'expo-router'

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="(home)/homePage" options={{ headerShown: false }} />
      <Stack.Screen name="(profile)/profilePage" options={{ headerShown: false }} />
    </Stack>
  )
}