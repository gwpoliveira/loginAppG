import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

/**
 * by Gleiser Wesley
 * Tela de lista de usuários.
 * Exibe uma lista de usuários com opções para visualizar, editar e excluir.
 *
 * @param {object} navigation - Objeto de navegação para redirecionamento de tela.
 */
export default function UsersScreen({ navigation }) {
  // Estado para armazenar a lista de usuários e controlar o carregamento
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Função para buscar a lista de usuários.
   * Utiliza o token de autenticação armazenado no AsyncStorage para autenticar a requisição.
   * Redireciona para a tela de login se o token não for encontrado.
   */
  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.navigate('Login');
      return;
    }

    try {
      const response = await fetch('https://reqres.in/api/users?page=1', {
        headers: { 'Authorization': `Bearer ${token}` } // Correção com backticks
      });

      const data = await response.json();
      setUsers(data.data); // Armazena a lista de usuários no estado
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Conclui o carregamento
    }
  };

  /**
   * Função de logout.
   * Remove o token de autenticação e redireciona o usuário para a tela de login.
   */
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  // Hook de efeito para buscar os usuários ao carregar a tela
  useEffect(() => { fetchUsers(); }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho com o título da tela e o botão de logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Usuários</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Exibe um indicador de carregamento enquanto a lista de usuários está sendo carregada */}
      {loading ? (
        <ActivityIndicator size="large" color="#5D5FEF" style={styles.loader} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>

              {/* Ícones de Ação */}
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('UserDetail', { userId: item.id })}>
                  <Feather name="eye" size={20} color="#5D5FEF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('EditUser', { userId: item.id })}>
                  <Feather name="edit" size={20} color="green" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('DeleteUser', { userId: item.id })}>
                  <Feather name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Fundo claro para contraste com os cards de usuário
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#5D5FEF', // Cor de destaque para o botão de logout
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  }
});
