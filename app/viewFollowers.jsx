import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeContext } from "@/context/themeContext";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Encrypt } from "@/constants/encrypt";

const FollowersScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useLocalSearchParams();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const user = await AsyncStorage.getItem('user.name');
        const _user = Encrypt(user);
        const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/getFollowers?user=${_user}`);
        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [user]);

  const goBackToUserPage = () => {
    router.back({
      pathname: '/userPage',
      params: { username: user },
    });
  };

  const renderFollowerItem = ({ item }) => (
    <Link href={{ pathname: '/userPage', params: { username: item.username } }} asChild>
      <TouchableOpacity>
        <View style={[styles.followerContainer, { backgroundColor: theme.containerUser }]}>
          <Image
            source={item.user_photo ? { uri: item.user_photo } : require('@/assets/images/noUserPhoto.jpg')}
            style={styles.followerImage}
          />
          <Text style={[styles.followerName, { color: theme.text }]}>{item.username}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.text} />
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={goBackToUserPage}>
                  <Icon name="arrow-back" size={30} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Followers</Text>
              </View>
              <FlatList
                data={followers}
                keyExtractor={(item) => item.username}
                renderItem={renderFollowerItem}
                contentContainerStyle={styles.listContainer}
              />
            </>
          )}
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default FollowersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  followerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  followerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  followerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});