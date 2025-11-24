import React, { useState, useContext, useEffect } from "react";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, RefreshControl } from "react-native";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from 'react-native-check-box'

import { ThemeContext } from "@/context/themeContext";
import { RadioButton } from 'react-native-paper';

import { Encrypt } from "@/constants/encrypt";


const searchPage = () => {

    const { theme } = useContext(ThemeContext);
    let { title, hashtag } = useLocalSearchParams();
    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [ sort, setSort ] = useState(true);
 

    const router = useRouter();

    useEffect(() => {
        const findPost = async () => {
            try {
                if(hashtag !== ''){
                    hashtag = hashtag.split(' ').map(tag => `'${tag.trim()}'`).filter(tag => tag !== '').join(', ');
                }
            
                const _title = Encrypt(title.trim());
                const _hashtag = Encrypt(hashtag);

                const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/getFetch?title=${_title}&hashtag=${_hashtag}`);
                const data = await response.json();
                const _data = data.map((post, index) => {
                    return {
                        ...post,
                        index: index
                    };
                });
                setPosts(_data);
            } catch (e) {
                console.error(error, e);
            }finally{
                setLoading(false);
            }
        };

        findPost();

    }, []);

    const backPage = () => {
        router.back();
      };

      const sortData = () => {
        if(!sort){
            const _data = [...posts].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
            setPosts(_data);
            setRefresh(!refresh);
        }else{
            const _data = [...posts].sort((a, b) => a.index - b.index);
            setPosts(_data);
            setRefresh(!refresh);
        }
        setModalVisible(!modalVisible) 

    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
        <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
            <View style={styles.header}>
                        <TouchableOpacity onPress={backPage}>
                          <Icon name="arrow-back" size={30} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Search</Text>
                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{alignItems: 'flex-end', flex: 1, marginRight: 5}}>
                            <View style={[styles.sortBox, {backgroundColor: theme.sortBox}]}>
                                <Icon name="sort" size={35} color={theme.text} />
                                <Text style={[styles.textSort, {color: theme.text}]}>Sort</Text>
                            </View>
                        </TouchableOpacity>
            </View>
            {loading ? (
                ''
            ) : (
                <FlatList 
                    style={{paddingHorizontal: 15, marginTop: 15}}
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    extraData={refresh}
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
                        <View style={{justifyContent: 'center', alignItems: 'center', width: '80%'}}>
                            <Text style={[{fontSize: 40, alignSelf: 'center', marginLeft: 15, paddingBottom: 10}, {color: theme.text}]}>Sort</Text>
                        </View>
                        <TouchableOpacity
                         style={{ height: '100%', alignItems: 'flex-end', marginLeft: 10}}
                         onPress={() => {
                            setModalVisible(!modalVisible)                            
                        }} >
                            <Icon name='clear' size={36} color={theme.icon} style={{color: theme.clearIcon}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'flex-start', width: '100%', padding: 12, marginLeft: 10}}>
                        <View style={styles.checkBoxContainer}>

                            <RadioButton
                                value={sort}
                                status={ sort === false ? 'checked' : 'unchecked' }
                                onPress={() => setSort(false)}
                            />
                            <Text style={[styles.checkBoxText, {color: theme.text}]}>By Score</Text>                            
                        </View>
                        <View style={styles.checkBoxContainer}>
                            <RadioButton
                                value={sort}
                                status={ sort === true ? 'checked' : 'unchecked' }
                                onPress={() => setSort(true)}
                            />
                            <Text style={[styles.checkBoxText, {color: theme.text}]}>By Default</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignSelf: 'center'}}>
                            <TouchableOpacity 
                                style={[styles.buttonDone,
                                        {backgroundColor: theme.backgroundButton}]} 
                                onPress={sortData}
                            >
                                <Text style={[styles.buttonDoneText, {color: theme.text}]}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>

        </SafeAreaView>
        </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default searchPage;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    containerReco: {
        paddingHorizontal: 15,
        backgroundColor: '#2C2C2C',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    sortBox: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 10,
        borderRadius: 10
    },
    textSort: {
        marginLeft: 5,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
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
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popUpBox: {
        width: '55%',
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
        flexDirection: 'row',
        alignItems: 'flex-end',
        width: '100%',
        paddingTop: 15,
        paddingRight: 15,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkBox: {
        height: 25,
        marginRight: 20
    },
    checkBoxText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonDone: {
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 10,
        alignItems: "center",
    },
    buttonDoneText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
      },
});