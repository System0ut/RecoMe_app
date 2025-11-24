import React, { useContext, useState, useEffect } from "react";
import { View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors"; 
import { Licence } from "@/constants/copyrightMit";

import { ThemeContext } from "@/context/themeContext";
import { useNavigation } from 'expo-router'


const SettingsScreen = () => {

  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  const [isEnabled, setIsEnabled] = useState(isDark);
  const navigation = useNavigation();

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem('user.name');
    } catch (e) {
      console.log('error: ', e);
    }
  };

  const logOut = () => {
    removeData();
    navigation.replace('index');
  };

  const legalRoute = () => {
    navigation.push('legalPage');
  }; 

  useEffect(() => {
    setIsEnabled(isDark);
  }, [isDark]);

  return (
    
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Settings</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
      <TouchableOpacity>
        <SettingsItem title="Profile" icon="person" theme={theme} />
      </TouchableOpacity>
      <TouchableOpacity onPress={legalRoute}>
        <SettingsItem title="Privacy" icon="lock-closed" theme={theme} />
        </TouchableOpacity>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
      <SettingsItem title="Push Notifications" icon="notifications" theme={theme} isSwitch />
      <SettingsItem title="Message Alerts" icon="chatbox" theme={theme} isSwitch />

      {/* Preferences */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
      <SettingsItem title="Dark Mode" icon="moon" theme={theme} isSwitch isEnabled={isDark} toggleTheme={toggleTheme} />
      
      <View style={{flexDirection: 'column-reverse',height: '50%', alignItems: 'center'}}>
        <TouchableOpacity onPress={logOut}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
   
  );
};

const SettingsItem = ({ title, icon, theme, isSwitch, isEnabled, toggleTheme }) => {
    return (
      <View style={[styles.itemContainer, { borderBottomColor: theme.border }]}>
        <View style={styles.itemTextContainer}>
          <Ionicons name={icon} size={24} color={theme.text} style={styles.icon} />
          <Text style={[styles.itemText, { color: theme.text }]}>{title}</Text>
        </View>
        {isSwitch ? (
          <Switch 
            trackColor={{false: '#767577', true: '#5664F5'}}
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={toggleTheme}
            value={isEnabled}
          />
        ) : null}
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
  },
  logoutText: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default SettingsScreen;

