import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

/**
 * by Gleiser Wesley
 * Tela de Login que permite ao usuário autenticar-se com o Google.
 * Armazena o token de autenticação no AsyncStorage em caso de sucesso.
 *
 * @param {object} navigation - Objeto de navegação para redirecionamento de tela.
 */
export default function LoginScreen({ navigation }) {
  // Configuração da autenticação do Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '505212998691-04a20ss2lii7l73eic52pdft6d1qhlkp.apps.googleusercontent.com', // Substitua pelo seu Client ID do Google
    scopes: ['profile', 'email'],
  });

  // Efeito para lidar com a resposta do Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication) {
        handleGoogleSignIn(authentication.accessToken);
      }
    }
  }, [response]);

  // Função para processar o login com Google
  const handleGoogleSignIn = async (token) => {
    try {
      // Salva o token no AsyncStorage
      await AsyncStorage.setItem('token', token);
      Alert.alert("Login com Google bem-sucedido!");
      navigation.navigate('Users');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer o login.");
      console.error("Erro no login com Google:", error);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://example.com/background-image.jpg' }} // URL da imagem de fundo
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo de Volta</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        {/* Botão de login com Google */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => {
            promptAsync();
          }}
          disabled={!request}
        >
          <Text style={styles.googleButtonText}>Entrar com Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 20,
  },
  googleButton: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#4285F4',
    marginTop: 20,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
