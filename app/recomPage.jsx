import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from "@/context/themeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Encrypt } from "@/constants/encrypt";

const Post = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useLocalSearchParams();
  const [liked, setLiked] = useState(false);

  const [post, setPost] = useState();
  const [loading, setLoading] = useState(true);
  const [follow, setFollow] = useState(false);
  const router = useRouter();
  const [self, setSelf] = useState(true);

  useEffect(() => {
      const fetchPosts = async () => {
        try {
          const user = await AsyncStorage.getItem('user.name');

          const _user = Encrypt(user);
          const _id = Encrypt(id);

          const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/post?user=${_user}&postId=${_id}`); 
          const data = await response.json();
          setPost(data[0]);
          setFollow(data[0]['is_following'])
          if(user === data[0]['username']){
            setSelf(false);
          }
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, []);

  const colorScore = (value) => {
    const numericValue = parseFloat(value);
    if (numericValue >= 0 && numericValue <= 4) {
      return "red"; 
    } else if (numericValue >= 5 && numericValue <= 7) {
      return "orange";
    } else if (numericValue >= 8 && numericValue <= 10) {
      return "green";
    } else {
      return "";
    }
  }; 

  const userPage = () => {
    router.push({pathname:'/userPage', params:{username : post.username}})
  };

  const backPage = () => {
    router.back();
  };

  const switchFollow = async () => {
    try{
      const user = await AsyncStorage.getItem('user.name');
      if(follow){
        // pa unfollow
        const response = await fetch('http://xxx.xxx.xxx.xxx:3000/follow', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ myUser: user, otherUser: post.username, isFollow: false }),
        });
        setFollow(prev => !prev);
      }else{
        // pa follow
        const response = await fetch('http://xxx.xxx.xxx.xxx:3000/follow', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ myUser: user, otherUser: post.username, isFollow: true }),
        });
        setFollow(prev => !prev);
      }
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={backPage}>
              <Icon name="arrow-back" size={30} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Publicación</Text>
          </View>

          <View style={{flex: 1,}}>
          {loading ? (
            <ActivityIndicator size="large" style={{justifyContent: 'center', alignContent: 'center'}} color="#0000ff" />
          ):(
            <ScrollView style={{ flex: 1 }}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled">
              <Text style={[styles.title, { color: theme.text }]}>{post.title}</Text>

              {post.image ? (
                <Image
                  source={{uri: post.image}}
                  style={styles.image}
                />
              ) : ( "" )}
              
              <Text style={[styles.description, { color: theme.text }]}>{post.description}</Text>
              <View style={[styles.scoreBox,{flexDirection: 'row'}]}>
                <Text style={[styles.scoreText, {color: colorScore(post.score)}]}>{post.score} </Text>
                <Text style={{fontSize: 50,fontWeight: 'bold', color: theme.tintLike}}>/10</Text>
              </View>
              <View style={styles.hashtagsContainer}>
                  <Text style={[styles.hashtag, { color: theme.tintHastag }]}>
                  {post.hashtag.join(', ')}
                  </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={userPage}>
                  <Image                 
                    source={post.user_photo ? (
                      {uri: post.user_photo}
                    ) : (
                      require('@/assets/images/noUserPhoto.jpg')
                    )}
                    style={styles.userItemImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={userPage} style={{alignSelf: 'center'}}>
                  <Text style={[styles.usernameText, {color: theme.text}]}>
                    {post.username.length > 9 ? 
                    `${post.username.substring(0, 9)}...`
                    : post.username}
                  </Text>
                </TouchableOpacity>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  {self ? (
                  <TouchableOpacity onPress={switchFollow}>
                    <View style={[styles.followBox, follow ? ({backgroundColor: theme.followingBox}) : ({backgroundColor: theme.followBox})]}>
                      {follow ? 
                      (
                        <Text style={[styles.followText, {color: theme.followText}]}>Following</Text>
                      ) : (
                        <Text style={[styles.followText, {color: theme.followText}]}>Follow</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  ) : (
                    ""
                  )}
                  
                </View>
              </View>

              <View style={styles.interactionContainer}>
                <TouchableOpacity style={styles.interactionButton} onPress={() => setLiked(!liked)}>
                  <Icon name="favorite" size={24} color={liked ? 'red' : theme.tintLike} />
                  <Text style={[styles.interactionText, { color: theme.text }]}>{post.likes} Likes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionButton}>
                  <Icon name="comment" size={24} color={theme.tint} />
                  <Text style={[styles.interactionText, { color: theme.text }]}>{post.comments} Comentarios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactionButton}>
                  <Icon name="share" size={24} color={theme.tint} />
                  <Text style={[styles.interactionText, { color: theme.text }]}>Compartir</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            )}
          </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Post;

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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center'
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  scoreBox: {
    justifyContent: 'center'
  },
  scoreText: {
    fontSize: 50,
    fontWeight: 'bold'
  },  
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  hashtag: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
    marginBottom: 8,
  },
  userItemImage: {
    width: 75,
    height: 75,
    borderRadius: 75/2,
    marginRight: 10,
    marginBottom: 15
    },
  usernameText: {
    fontSize: 30,
    marginLeft: 15, 
    alignSelf: 'center'
  },
  followBox: {
    alignSelf: 'center',
    height: 35,
    borderRadius: 20/2
  },
  followText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  interactionButton: {
    alignItems: 'center',
  },
  interactionText: {
    fontSize: 14,
    marginTop: 4,
  },
});