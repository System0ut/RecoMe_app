import React, { useContext, useState, useEffect } from "react";
import { View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from "expo-router";

import { ThemeContext } from "@/context/themeContext";
import { CopyRight } from '@/constants/copyrightMit';

const LegalPage = () => {

    const { theme } = useContext(ThemeContext);
    const route = useRouter();

    const backRoute = () => {
        route.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={backRoute}>
                    <Icon name="arrow-back" size={30} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Back</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <Text style={[styles.textMit, {color: theme.text}]}>
                    {CopyRight}
                </Text>
            </ScrollView>
        </SafeAreaProvider>
        </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default LegalPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030303'
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
    scrollView:{
        flex: 1,
    },
    textMit: {
        fontSize: 18,
        padding: 16,
    }
});