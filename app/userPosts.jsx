import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeContext } from "@/context/themeContext";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

import { Encrypt } from "@/constants/encrypt";


const userPosts = () => {
  
    const { theme } = useContext(ThemeContext);
    const { hashtag, user } = useLocalSearchParams();
    const [ posts, setPosts] = useState(null);
    const [ loading, setLoading] = useState(true);

    const router = useRouter();
    useEffect(() => {
    
        const obtainUserInfo = async () => {
          try {

            const _user = Encrypt(user);
            const _hashtag = Encrypt(hashtag);

            const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/postsByHashtag?user=${_user}&hashtag=${_hashtag}`); 
            const data = await response.json(); 
            setPosts(data);

          } catch (e){
            console.error(e);
          } finally {
            setLoading(false);
          }
        }
    
        obtainUserInfo();
    }, [user,hashtag]);


    const getUserName = async () => {
        try{
          router.back({
            pathname: '/userPage',
            params: {username: user}
          })
        } catch (e) {
          console.error('error', e);
        }
      }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1 }}>
            {loading ? (
                <View style={{flex: 1, alignItems: 'center', alignContent: 'center'}}>
                <ActivityIndicator size="large" style={{justifyContent:'center', alignSelf:'center'}} color="#0000ff" />
            </View>
            ) : (
                <>
                <View style={styles.header}>
                            <TouchableOpacity onPress={getUserName}>
                              <Icon name="arrow-back" size={30} color={theme.text} />
                            </TouchableOpacity>
                            <Text style={[styles.headerTitle, { color: theme.text }]}>Posts</Text>
                </View>
                <FlatList 
                    style={{paddingHorizontal: 15}}
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Link href={{ pathname: '/recomPage', params: { id: item.id } }} asChild>
                        <TouchableOpacity>
                            <View style={[styles.containerReco,{backgroundColor: theme.containerUser}]}> 
                            <View style={styles.containerUser1}>
                                <Image source={item.user_photo ? (
                                        {uri: item.user_photo}
                                        ) : (
                                        require('@/assets/images/noUserPhoto.jpg')
                                        )}
                                        style={styles.userItemImage} 
                                />
                                <View style={styles.textItemContainer}> 
                                <Text style={[styles.textTitle,{color: theme.text}]}>{item.title}</Text> 
                                <Text style={styles.textDescription}>
                                    {item.description.length > 50 
                                    ? `${item.description.substring(0, 50)}...` 
                                    : item.description}</Text> 
                                </View>
                                {item.image ? (
                                <Image source={{uri: item.image}} style={styles.imageItem} />
                                ) : ""} 
                            </View>                
                            <View style={styles.hashtagContainer}>
                                <Text style={styles.textHashtag}>
                                {item.hashtag.join(', ')}
                                </Text>
                            </View>
                            </View>
                        </TouchableOpacity>
                        </Link>
                    )}
                /> 
            </>
            )}
            
        </SafeAreaProvider>
        </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default userPosts;

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
    containerReco: {
        paddingHorizontal: 15,
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
        containerUser1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
        userItemImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
        textItemContainer: {
        flex: 1,
    },
    textTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    textDescription: {
        fontSize: 14,
        color: 'gray',
    },
    hashtagContainer:{
        padding: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    textHashtag: {
        fontSize: 18,
        color: '#EC713D',
        marginTop: 5,
        fontWeight: 'bold'
    },
    imageItem: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
});