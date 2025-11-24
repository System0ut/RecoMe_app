import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Appearance } from 'react-native';
import React from 'react';

import { Colors } from '@/constants/Colors';

import { ThemeProvider } from '@/context/themeContext';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme()
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light; 

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    IrishGrover: require('../assets/fonts/IrishGrover-Regular.ttf'),
    lexendDeca: require('../assets/fonts/LexendDeca-VariableFont_wght.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
    <Stack screenOptions={{ headerStyle: {backgroundColor: theme.headerBackground},
     headerTintColor: theme.text, headerShadowVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Index', headerShown: false}} />
      <Stack.Screen name="mainPage" options={{ title: 'Main', headerShown: false }} />  
      <Stack.Screen name="settingsPage" options={{ title: 'Settings', headerShown: false }} />
      <Stack.Screen name="userPage" options={{ title: 'userProfile', headerShown: false }} />
      <Stack.Screen name="recomPage" options={{ title: 'recomendation', headerShown: false }} />
      <Stack.Screen name="addPage" options={{ title: 'addReco', headerShown: false }} />
      <Stack.Screen name="loginPage" options={{ title: 'login', headerShown: false }} />
      <Stack.Screen name="userPosts" options={{ title: 'postsUser', headerShown: false }} />
      <Stack.Screen name="viewFollowers" options={{ title: 'viewFollowersUser', headerShown: false }} />
      <Stack.Screen name="searchPage" options={{ title: 'searchPosts', headerShown: false }} />
      <Stack.Screen name="legalPage" options={{ title: 'infoLegal', headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
    </ThemeProvider>
  );
}
