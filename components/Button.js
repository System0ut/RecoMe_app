import React, { useState, useContext, useCallback } from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ThemeContext } from "@/context/themeContext";


const Button2 = ({ title, onPress, style, textStyle, disabled, loading }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[
        styles.Button2,
        { backgroundColor: theme.tint }, 
        style,
        disabled && styles.disabledButton2,
      ]}
      onPress={onPress}
      disabled={disabled || loading} 
      activeOpacity={0.7} 
    >
      {loading ? (
        <ActivityIndicator color={theme.text} />
      ) : (
        <Text style={[styles.Button2Text, { color: theme.textButton2 }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Button2: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  Button2Text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton2: {
    opacity: 0.6, 
  },
});

export default Button2;