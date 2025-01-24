import { SplashScreen, Stack, useRouter } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
    "Fredoka-Light": require("../assets/fonts/Fredoka-Light.ttf"),
    "Fredoka-Medium": require("../assets/fonts/Fredoka-Medium.ttf"),
    "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
    "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (fontsError) throw fontsError;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setTimeout(() => {
        setIsLoading(false);
        router.replace("/(auth)/login");
      }, 1000);
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) return null;

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
        initialParams={{ isLoading }} 
      />
      <Stack.Screen 
        name="(auth)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="[user]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}