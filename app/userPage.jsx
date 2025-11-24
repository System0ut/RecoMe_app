import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from "@/context/themeContext";
import { stackItems } from '@/constants/stackExample';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Button } from "react-native-paper";

import { Encrypt } from "@/constants/encrypt";

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const { username } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [ userInfo, setUserInfo ] = useState(null);
  const [ postInfo, setPostInfo ] = useState(null);
  const [self, setSelf] = useState(true);
  const [follow, setFollow] = useState(false);
  const [ posts, setPosts ] = useState(null);

  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Stack'},
    { key: 'second', title: 'All posts'},
  ])

  const stackRoute = () => ( 
    <FlatList
    data={postInfo}
    keyExtractor={(item) => item.toString()}
    numColumns={2}
    renderItem={({ item }) => (
      
      <View style={styles.imageBox}>
        <TouchableOpacity style={{flex: 1}} onPress={() => userPostsRoute(item)}>
          <ImageBackground
            source={require('@/assets/images/imagenesPrueba/backgroundBooks.jpg')}
            style={styles.stackBox}
          >
            
            <Text style={[styles.stackText, { color: theme.textButton }]}>
              Recomendación {item}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      
    )} />
  );

  const allRoute = () => (
    <FlatList 
        style={{paddingHorizontal: 15}}
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <Link href={{ pathname: '/recomPage', params: { id: item.id } }} asChild>
            <TouchableOpacity>
                <View style={[styles.containerReco,{backgroundColor: theme.containerUser}]}> 
                <View style={styles.containerUser1}>
                    <Image source={userInfo.user_photo ? (
                            {uri: userInfo.user_photo}
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
  );

  const renderTab = SceneMap({
    first: stackRoute,
    second: allRoute,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.text }}
      style={{ backgroundColor: '#6200ee', marginBottom: 10 }}
    />
  );

  useEffect(() => {

    const obtainUserInfo = async () => {
      try {

        const _username = Encrypt(username);

        const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/userProfile?user=${_username}`); 
        const data = await response.json(); 
        setUserInfo(data[0])

        const response2 = await fetch(`http://xxx.xxx.xxx.xxx:3000/hashtags?user=${_username}`); 
        const data2 = await response2.json();
        if(data2[0] == null){
          setPostInfo(null);
        }else{
          const hastags = [...new Set(data2.map(item => item.hashtag[0]).filter(Boolean))];
          setPostInfo(hastags);
        }
        const user = await AsyncStorage.getItem('user.name');
        const _user = Encrypt(user);  

        const response3 = await fetch(`http://xxx.xxx.xxx.xxx:3000/follow2?myUser=${_user}&otherUser=${_username}`);
        const data3 = await response3.json();
        setFollow(data3[0]['is_following'])
        if(user === username){
          setSelf(false);
        }

        const responsePosts = await fetch(`http://xxx.xxx.xxx.xxx:3000/postsUser?user=${_username}`);
        const dataPosts = await responsePosts.json();
        setPosts(dataPosts);
      } catch (error) {
        console.error(data[0]['error'], error);
      } finally {
        setLoading(false);
      }
    };

    if(username){
      obtainUserInfo();
    }
  }, [username]);

  const userPostsRoute = (value) => {
    router.push({ pathname: 'userPosts', params: { hashtag: value, user: username } });
  };

  const switchFollow = async () => {
    try{
      const user = await AsyncStorage.getItem('user.name');
      if(follow){
        // pa unfollow
        await fetch('http://xxx.xxx.xxx.xxx:3000/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ myUser: user, otherUser: username, isFollow: false }),
        });
        setFollow(prev => !prev);
      }else{
        // pa follow
        await fetch('http://xxx.xxx.xxx.xxx:3000/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ myUser: user, otherUser: username, isFollow: true }),
        });
        setFollow(prev => !prev);
      }
    } catch (e) {
        console.error(e);
    }
  };

  const userFollowers = () => {
    router.push({ pathname: 'viewFollowers', params: { user: username } });
  };
  

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          {loading ? (
            <View style={{flex: 1, alignItems: 'center', alignContent: 'center'}}>
              <ActivityIndicator size="large" style={{justifyContent:'center', alignSelf:'center'}} color="#0000ff" />
            </View>
          ) : (
            <><ImageBackground
                source={require('@/assets/images/imagenesPrueba/fondoProfile.jpg')}
                style={styles.namePhoto}
              >
                <View style={styles.userPhotoBox}>
                  <Image
                    source={userInfo?.user_photo ? (
                      { uri: userInfo.user_photo }
                    ) : (
                      require('@/assets/images/noUserPhoto.jpg')
                    )}
                    style={styles.userPhoto} />
                </View>
                <View style={styles.userNameBox}>
                  <Text style={[styles.followersText, { color: 'white' }]}>Followers: {userInfo?.num_followers ? userInfo.num_followers : '0'}</Text>
                  <Text style={[styles.nameText, { color: 'white' }]}>{userInfo?.username ? (userInfo.username) : 'User'}</Text>
                  {self ? (
                    <TouchableOpacity onPress={switchFollow}>
                      <View style={[styles.followBox, follow ? ({backgroundColor: theme.followingBox, width: '60%'}) : ({backgroundColor: theme.followBox,width: '45%'})]}>
                        {follow ? 
                        (
                          <Text style={[styles.followText, {color: theme.followText}]}>Following</Text>
                        ) : (
                          <Text style={[styles.followText, {color: theme.followText}]}>Follow</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={userFollowers}>
                        <View style={[styles.followers,{backgroundColor: theme.fondoBoton}]}>
                          <Text style={[styles.followersText,{color: theme.followText}]}>Followers</Text>
                        </View>
                      </TouchableOpacity>
                  )}
                </View>
              </ImageBackground>
              <View style={styles.listBox}>
                  {postInfo ? (
                    // flatList
                    <TabView
                      navigationState={{ index, routes }}
                      renderScene={renderTab}
                      onIndexChange={setIndex}
                      renderTabBar={renderTabBar}
                    />
                  ) : (
                    <Text style={{color: 'white'}}>No posts yet</Text>
                  )}
                  
              </View></>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  namePhoto: {
    height: 175,
    flexDirection: 'row',
    resizeMode: 'cover',
  },
  userPhotoBox: {
    height: 150,
    width: 150,
    borderRadius: 75,
    margin: 15,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#EC713D',
  },
  userPhoto: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  userNameBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 20,
  },
  followersText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 28,
    fontFamily: 'IrishGrover',
  },
  followBox: {
    marginTop: 15,
    height: 35,
    borderRadius: 20/2,
  },
  followText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  listBox: {
    flex: 1,
    padding: 10,
  },
  imageBox:{
    height: 180,
    width: '45%', 
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
  },
  stackBox: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    borderRadius: 10,
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
  followers:{
    marginTop: 20,
    height: '50%',
    width: '80%',
    borderRadius: 20/2,
    justifyContent: 'center',
    alignItems: 'center'
  }
});