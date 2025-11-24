import { View, Text, StyleSheet, Button, Alert,
  Appearance, Image, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, Pressable,
  Modal, KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, ScrollView, } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { recoItems } from '@/constants/RecomenExample';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useContext, useEffect } from 'react';

import { ThemeContext } from "@/context/themeContext";

import { Encrypt } from "@/constants/encrypt";

const app = () => {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [modalVisible, setModalVisible] = useState(false);

  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [ userPhoto, setUserPhoto ] = useState(null);

  const [ title, setTitle] = useState(null);
  const [ hashtag, setHashtag] = useState(null);
  

  const getUserName = async () => {
    try{
      router.push({
        pathname: '/userPage',
        params: {username: username}
      })
    } catch (e) {
      console.error('error', e);
    }
  }
  const addPageR = async () => {
    try{
      router.push({
        pathname: '/addPage',
        params: {username: username}
      })
    } catch (e) {
      console.error('error', e);
    }
  }

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('user.name');
      
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.error('error: ', e);
    }
  };
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {

        const user = await getUser();

        const _user = Encrypt(username);

        const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/posts?user=${_user}`);
        const data = await response.json();
        const getPhoto = await fetch(`http://xxx.xxx.xxx.xxx:3000/userPhoto?user=${_user}`);
        const photo = await getPhoto.json();
        setUserPhoto(photo['user_photo']);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const randomSelect = async () => {
    try {
      const response = await fetch('http://xxx.xxx.xxx.xxx:3000/randomPost');
      const data = await response.json();
      if (data.length > 0) {
        router.push({ pathname: "/recomPage", params: { id: data[0]["id"] } });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const routeSearch = () => {
    if(title == null & hashtag == null){
      Alert.alert('Error', 'Add a title or a hashtag');
    }else{
      if(title != null & hashtag == null){
        setTitle(null);
        setHashtag(null);
        router.push({pathname: '/searchPage', params: { title: title, hashtag: '' }});
      }
      if(title == null & hashtag != null){
        setTitle(null);
        setHashtag(null);
        router.push({pathname: '/searchPage', params: { title: '', hashtag: hashtag }});
      }
      if(title != null & hashtag != null){
        setTitle(null);
        setHashtag(null);
        router.push({pathname: '/searchPage', params: { title: title, hashtag: hashtag }});
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
        <KeyboardAvoidingView 
          behavior='height'
          style={{flex: 1}}
        >
          {/* Header */}
          <View style={{width:1,height: 5}} />
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.textLogo}>RecoMe</Text>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
               
                setModalVisible(!modalVisible);
              }}>
                <View style={styles.popupContainer}>
                  <View style={[styles.popUpBox,{backgroundColor: theme.backgroundColorPopUp,
                     shadowColor: theme.shadowColorPopUp, borderColor: theme.borderColorPopUp}]}>
                    <View style={styles.boxClearIcon}>
                      <TouchableOpacity onPress={() => {
                        setModalVisible(!modalVisible)
                        setTitle(null);
                        setHashtag(null);
                      }} >
                        <Icon name='clear' size={34} color={theme.icon} style={{color: theme.clearIcon}}/>
                      </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'flex-start', width: '100%', padding: 12}}>
                      <Text style={[styles.searchText,{color: theme.text}]}>TITLE: </Text>
                      <TextInput
                        style={[styles.inputSearch, {backgroundColor: theme.inputContainer}]}
                        placeholder="Enter a title"
                        placeholderTextColor={theme.inputContainerText}
                        value={title}
                        onChangeText={setTitle}
                      />
                      <Text style={[styles.searchText,{color: theme.text}]}>HASHTAG: </Text>
                      <TextInput
                        style={[styles.inputSearch, {backgroundColor: theme.inputContainer}]}
                        placeholder="Enter zero, one or more hashtags"
                        placeholderTextColor={theme.inputContainerText}
                        value={hashtag}
                        onChangeText={setHashtag}
                      />
                      <View style={{justifyContent: 'center', alignSelf: 'center'}}>
                        <TouchableOpacity 
                          style={[styles.buttonSearch,
                                 {backgroundColor: theme.backgroundButton}]} 
                          onPress={routeSearch}
                        >
                          <Text style={[styles.buttonSearchText, {color: theme.text}]}>Search</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <View style={[styles.searchBox, {backgroundColor: theme.search}]}>
              <Text style={styles.input}>Buscar...</Text>               
              <Icon name="search" size={24} color={theme.icon} style={styles.searchIcon} />
            </View>
            </TouchableOpacity>
            <Link href='/settingsPage'>
              <Icon name="settings" size={40} color={theme.iconSettings} style={styles.settingIcon} />
            </Link>
          </View>

          {/* Lista de Recomendaciones */}
          <View style={{width:1,height: 20}} />
          {loading ? (
            <View style={{flex: 1, alignItems: 'center', alignContent: 'center'}}>
            <ActivityIndicator size="large" style={{justifyContent:'center', alignSelf:'center'}} color="#0000ff" />
            </View>  
          ) : (
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
          )}
          <View style={[styles.navBar, {backgroundColor: theme.background}]}>
            <TouchableOpacity onPress={getUserName}>
              <Image source={userPhoto ?
                (
                  {uri: userPhoto}
                ) : (
                  require('@/assets/images/noUserPhoto.jpg')
                )
              }
              style={styles.navIcon} 
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={addPageR}>
              <View style={styles.addIcon}>
                <Icon name="add-circle" size={50} color={theme.randomIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={randomSelect}>
              <Icon2 name="random" size={40} color={theme.randomIcon} />
              </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
  }

export default app;

const styles = StyleSheet.create({
container: {
flex: 1,
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginVertical: 10,
paddingHorizontal: 15,
},
logo: {
  width: 140,
  height: 40,
  backgroundColor: '#EC713D',
  borderRadius: 25,
  justifyContent: 'center',
  
},
textLogo: {
fontSize: 24,
color: 'white',
fontWeight: 'bold',
alignSelf: 'center'
},
searchBox: {
flexDirection: 'row',
borderRadius: 10,
paddingHorizontal: 10,
alignItems: 'center',
flex: 1,
marginHorizontal: 10,
},
input: {
paddingVertical: 5,
fontSize: 16,
color: 'black',
paddingRight: '15%'
},
searchIcon: {
marginLeft: 5,
},
popupContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
popUpBox: {
  width: '70%',
  borderRadius: 20,
  borderWidth: 2,
  alignItems: 'center',
  shadowOffset: {
    width: 2,
    height: 4,
  },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 10,
},
boxClearIcon:{
  alignItems: 'flex-end',
  width: '100%',
  paddingTop: 15,
  paddingRight: 15,
},
searchText: {
  fontSize: 18,
  fontWeight: 'bold'
},
buttonSearch: {
  padding: 12,
  borderRadius: 8,
  marginTop: 8,
  alignItems: "center",
},
buttonSearchText: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "bold",
},
inputSearch: {
  color: "#FFFFFF",
  padding: 12,
  borderRadius: 8,
  marginBottom: 15,
  marginTop: 15,
  width: '100%'
},
settingIcon: {
padding: 5,
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
navBar: {
flexDirection: 'row',
justifyContent: 'space-around',
alignItems: 'center',
backgroundColor: '#1C1C1C',
paddingVertical: 10,
},
navIcon: {
width: 50,
height: 50,
borderRadius: 25,
},
addIcon:{
  width: 50,
  height: 50,
  borderRadius: 25,
}
});
