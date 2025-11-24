import React, { useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';

import { ThemeContext } from "@/context/themeContext";
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Encrypt } from '@/constants/encrypt'

const login = () => {

    const router = useRouter();
    
    const [log, setLog] = useState(false);
    const [user, setUser] = useState();
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [email, setEmail] = useState();


    const switchLog = () => {
        setUser();
        setPassword();
        setPassword2();
        setEmail();
        setLog(prev => !prev);
    };

    const generateId = () => {
      const id = uuidv4(); 
      return id;
    };

    
    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('user.name', value);
      } catch (e) {
        console.log('errro: ', e);
      }
    };

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('user.name');
        if (value === null) {
          return;
        }
        return value;
      } catch (e) {
        console.log('error: ', e);
      }
    };
    
  

    const register_enter = useCallback(async () => {
      if(log){
        if(!user || !password || !password2 || !email) {
          Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
          return;
        }
      
        if(password != password2){
          Alert.alert("Error", "Password does not match");
          return;
        }

        try {
         
          const _user = Encrypt(user);
          const _email = Encrypt(email);
          const _password = Encrypt(password);

          const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/users?user=${_user}&email=${_email}&password=${_password}`);
          const data = await response.json();
          const stat = response.status;
          
          if(stat===200){

            const _body = {
              user_id: generateId(),
              username: user, 
              email: email, 
              user_password: password 
            }
            fetch('http://xxx.xxx.xxx.xxx:3000/users', { 
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(_body),
              })
              .then((resp) =>{
                Alert.alert('Done', 'User added, please login')
              })
              .catch((error) => {
                        Alert.alert('Error', 'Error in sign in');
                        console.error('Error:', error);
                      });

          }else{
            Alert.alert('Error', data['error'])
            return; 
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }else{
        if(!user || !password) {
          Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
          return;
        }
      
        try {

          const email = '_';

          const _user = Encrypt(user);
          const _email = Encrypt(email);
          const _password = Encrypt(password);

          const response = await fetch(`http://xxx.xxx.xxx.xxx:3000/users?user=${_user}&email=${_email}&password=${_password}`);
          const data = await response.json();
          const stat = response.status;

          if(stat === 200){
            const _user = await getData();
            if(_user == null){
              storeData(data['username']); 
            }
            if(_user != user){
              storeData(data['username']);
            }

            router.replace({ pathname: 'mainPage', params: { username: data['username'] } });
            
          }else{
            Alert.alert("Error", data['error']);
            return;
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    
    });
    
    return (
        <SafeAreaView style={{flex: 1} }>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1}}>
            <View style={styles.container}>
                <Text style={styles.title}>{log ? 'Register':'Login'}</Text>
                
                <View style={styles.infoBox}>
                    <TextInput
                    style={styles.input}
                    placeholder="User Name"
                    placeholderTextColor="#A9A9A9"
                    value={user}
                    onChangeText={setUser}
                    />

                    <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#A9A9A9"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    />

                    {log ? 
                        <>
                        <TextInput
                        style={styles.input}
                        placeholder=" Repeat Password"
                        placeholderTextColor="#A9A9A9"
                        secureTextEntry
                        value={password2}
                        onChangeText={setPassword2}
                        />   
                        <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#A9A9A9"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        /> 
                        </> : null 
                    }
                    

                    <TouchableOpacity style={styles.button} onPress={register_enter}>
                        <Text style={styles.buttonText}>{log ? 'Sign up' : 'Sign in'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={switchLog}>
                        <Text style={styles.singUp}>{log ? 'Sign in' : 'Sign up'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaProvider>
        </GestureHandlerRootView>
        </SafeAreaView>
  );
    
};

export default login;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoBox: {
    width: "80%",
    //height: '65%',
    padding: 20,
    borderColor: "#0A2A43",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#0B1C2E",
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 6,
    elevation: 10,
  },
  input: {
    backgroundColor: "#0A2A43",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 15
  },
  button: {
    backgroundColor: "#0A3A43",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  singUp: {
    color: 'red',
    fontSize: 18,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 40
  }
});