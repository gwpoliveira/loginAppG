import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * by Gleiser Wesley
 * Tela para editar os dados de um usuário específico.
 *
 * Permite ao usuário visualizar e atualizar o primeiro e o último nome do usuário.
 *
 * @param {object} route - Contém parâmetros de navegação, incluindo userId.
 * @param {object} navigation - Objeto de navegação para redirecionamento de tela.
 */
export default function EditUserScreen({ route, navigation }) {
  // Extração do ID do usuário a partir dos parâmetros da rota
  const { userId } = route.params;

  // Estados para armazenar os detalhes do usuário e controlar o carregamento
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  /**
   * Hook de efeito para buscar detalhes do usuário ao carregar a tela.
   * Utiliza o userId da rota para fazer a requisição GET autenticada com o token.
   */
  useEffect(() => {
    const fetchUserDetails = async () => {
      // Busca o token de autenticação no AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // Redireciona para a tela de login caso o token não exista
        navigation.navigate('Login');
        return;
      }

      try {
        // Realiza a requisição GET com o token de autenticação no cabeçalho
        const response = await fetch(`https://reqres.in/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` } // Correção com backticks
        });
        const data = await response.json();
        setUser(data.data);
        setFirstName(data.data.first_name);
        setLastName(data.data.last_name);
      } catch (error) {
        console.error("Erro ao carregar detalhes do usuário", error);
      } finally {
        setLoading(false); // Conclui o carregamento
      }
    };

    fetchUserDetails();
  }, [userId, navigation]);

  /**
   * Função para salvar as alterações do usuário.
   * Realiza uma requisição PUT para atualizar o nome e sobrenome do usuário.
   */
  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Correção com backticks
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName })
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Usuário atualizado!");
        navigation.goBack(); // Retorna para a tela anterior após o salvamento
      } else {
        Alert.alert("Erro", "Não foi possível atualizar o usuário.");
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário", error);
    }
  };

  // Exibe o indicador de carregamento enquanto os dados do usuário estão sendo buscados
  if (loading) {
    return <ActivityIndicator size="large" color="#5D5FEF" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {/* Campo para editar o primeiro nome do usuário */}
      <Text style={styles.label}>Primeiro Nome:</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
        placeholder="Primeiro Nome"
        placeholderTextColor="#aaa"
      />

      {/* Campo para editar o último nome do usuário */}
      <Text style={styles.label}>Último Nome:</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
        placeholder="Último Nome"
        placeholderTextColor="#aaa"
      />

      {/* Botão para salvar as alterações */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
