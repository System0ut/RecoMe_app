import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import { Link, useNavigation, useRouter } from 'expo-router'

import AsyncStorage from "@react-native-async-storage/async-storage";

const app = () => {

  const [connected, setConnected] = useState(false);
  const router = useRouter();


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
  
  useEffect(() => {
    const checkLogin = async () => {
      try{
        await new Promise(resolve => setTimeout(resolve, 3000));
        const name = await getData();
        if(name != null){
          router.replace({ pathname: 'mainPage', params: { username: name } });
        }else{
          router.replace('loginPage')
        }
      }catch(e){
        console.error('error: ',e);
      }
    };

    checkLogin();
  }, [connected, router]);

  return (
    <View style={{backgroundColor: 'black',flex:1}}>
      <View style={styles.containerLogo}>
        <View style={styles.rectanguloLogo}>
          <Text style={styles.textoPrueba}>RecoMe</Text>
        </View>
      </View>
      <ActivityIndicator
        style={styles.loader}
        size='large'
        color='white'
      />
    </View>
  )
}
export default app

const styles = StyleSheet.create({
  containerLogo: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rectanguloLogo: {
    width: 319,
    height: 122,
    backgroundColor: '#EC713D',
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '60%'
  },
  textoPrueba: {
    color: 'white',
    fontSize: 64,
    fontFamily: 'IrishGrover',
    textAlign: 'center',
  },
  loader: {
    alignContent: 'center',
    marginTop: '20%',
    marginBottom: 100 
  }
})