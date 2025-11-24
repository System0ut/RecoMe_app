import React, { useState, useContext, useCallback } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert, TouchableOpacity, Button } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import { ThemeContext } from "@/context/themeContext";
import Button2 from "@/components/Button";

import {  Provider as PaperProvider } from 'react-native-paper';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import AsyncStorage from '@react-native-async-storage/async-storage';


const addReco = () => {

  const { theme } = useContext(ThemeContext);
  const [inputTitle, setInputTitle] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  const [inputScore, setInputScore] = useState('');
  const [inputHashtag, setInputHashtag] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const { username } = useLocalSearchParams();
  const router = useRouter();

  const backPage = () => {
    router.back();
  };

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


  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso denegado", "Necesitas permitir el acceso a la galería para seleccionar una imagen.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const generateId = () => {
    const id = uuidv4(); 
    return id;
  };

  const uploadImageToS3 = async (imageUri) => {
    try {
        const fileName = imageUri.split('/').pop();
        const fileType = 'image/jpeg'; 
        console.log('genera imagen')

        const res = await fetch('http://xxx.xxx.xxx.xxx:3000/generate-upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName, fileType }),
        });

        const { uploadUrl, fileUrl } = await res.json();


        const imageBlob = await fetch(imageUri).then((res) => res.blob());
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': fileType },
            body: imageBlob,
        });


        return fileUrl; 
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        Alert.alert('Error', 'No se pudo subir la imagen.');
        return null;
    }
};

  const saveInfo = useCallback(async () => {

    if (!inputTitle || !inputDescription || !inputScore || !inputHashtag) {
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
      console.log('pulsado anadir');
      return;
    }

    if(inputScore>10 || inputScore<0){
      console.log(username)
      Alert.alert("Error", "Por favor, ingrese un valor entre 0 y 10")
      return;
    }

    let imageS3url = '';
    if(imageUri){
      imageS3url = await uploadImageToS3(imageUri);
      if(!imageS3url) return;
    }
    
    const newData = {
      id: generateId(),
      user_name: username,
      title: inputTitle,
      description: inputDescription,
      score: parseFloat(inputScore),
      hashtag: `{${inputHashtag.split(' ').join(',')}}`,
      image: imageS3url,
    };

    fetch('http://xxx.xxx.xxx.xxx:3000/posts', { 
      method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
              })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert('Éxito', 'Post agregado correctamente');
        console.log(data);
        backPage();
      })
      .catch((error) => {
        Alert.alert('Error', 'Hubo un problema al agregar el post.');
        console.error('Error:', error);
      });
  });


  const getScoreColor = (value) => {
    const numericValue = parseFloat(value);
    if (numericValue >= 0 && numericValue <= 4) {
      return "red"; // Rojo para valores entre 0 y 4
    } else if (numericValue >= 5 && numericValue <= 7) {
      return "orange"; // Amarillo para valores entre 5 y 7
    } else if (numericValue >= 8 && numericValue <= 10) {
      return "green"; // Verde para valores entre 8 y 10
    } else {
      return theme.text; 
    }
  };


  return(
    <PaperProvider>
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
        <View style={[styles.topBox, { backgroundColor: theme.containerUser }]}>
          <TouchableOpacity onPress={backPage}>
            <Icon name="arrow-back" size={40} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.topTitleText, { color: theme.text }]}>Create Post</Text>
        </View>
        <View style={[styles.sepLine, { backgroundColor: theme.border }]} />
          <ScrollView contentContainerStyle={{padding: 16}}>
            <Text style={[styles.contentTitle, { color: theme.text }]}>Title</Text>
            <TextInput
              style={[styles.response1, { backgroundColor: theme.search, color: theme.textHolder }]}
              placeholder="Enter Title"
              placeholderTextColor={theme.placeholder}
              onChangeText={setInputTitle}
            />
            <Text style={[styles.contentTitle, { color: theme.text }]}>Information</Text>
            <TextInput
              style={[styles.response2, { backgroundColor: theme.search, color: theme.textHolder }]}
              placeholder="Enter post information"
              placeholderTextColor={theme.placeholder}
              multiline
              onChangeText={setInputDescription}
            />
            <Text style={[styles.contentTitle, { color: theme.text }]}>Score</Text>
            <View style={styles.responseBox3}>
              <TextInput
                style={[styles.response3, { backgroundColor: theme.search, color: getScoreColor(inputScore)}]}
                placeholder="0"
                placeholderTextColor={theme.placeholder}
                keyboardType="number-pad"
                onChangeText={setInputScore}
                
              />
              <View style={[styles.scoreNumBox, { backgroundColor: theme.containerUser }]}>
                <Text style={[styles.scoreNum, { color: theme.text }]}>/ 10</Text>
              </View>
            </View>
            <Text style={[styles.contentTitle, { color: theme.text }]}>Hashtags</Text>
            <TextInput
              style={[styles.response1, { backgroundColor: theme.search, color: theme.textHolder }]}
              placeholder="Enter Hashtags"
              placeholderTextColor={theme.placeholder}
              onChangeText={setInputHashtag}
            />
            <Text style={[styles.contentTitle, { color: theme.text }]}>Image (optional)</Text>
            <View style={styles.imageContainer}>
              <View style={[styles.imageBox, { backgroundColor: theme.search }]}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <Image source={require('@/assets/images/imageIcon.png')} style={styles.image} />
                )}
              </View>
              <Button2 title="Upload Image" onPress={pickImage} style={[styles.uploadBox,{color: 'red'}]} />
            </View>
          </ScrollView>
          <View style={[styles.sepLine, { backgroundColor: theme.border }]} />
          <View style={[styles.doneContainer, { backgroundColor: theme.containerUser }]}>
            <Button2
            title='Done'
              style={styles.done}
              onPress={saveInfo}
              />
          </View>
    </SafeAreaView>
    </SafeAreaProvider>
    </GestureHandlerRootView>
    </PaperProvider>
  );
};


export default addReco;

const styles = StyleSheet.create({
  
  topBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  topTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  sepLine: {
    height: 1,
    width: '100%',
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
  },
  response1: {
    height: 50,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    fontWeight: 'bold'
  },
  response2: {
    height: 150,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    fontWeight: 'bold'
  },
  responseBox3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  response3: {
    height: 50,
    width: 80,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    padding: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scoreNumBox: {
    height: 50,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  scoreNum: {
    fontSize: 18,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  uploadBox: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 8,
  },
  doneContainer: {
    padding: 16,
    height: '10%',
    justifyContent: 'center',
    
  },

  done: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#5664F5',
  },

})