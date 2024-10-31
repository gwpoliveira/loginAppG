import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * by Gleiser Wesley
 * Tela de detalhes do usuário.
 * Exibe as informações de um usuário específico, incluindo nome, email e ID.
 *
 * @param {object} route - Contém parâmetros de navegação, incluindo userId.
 * @param {object} navigation - Objeto de navegação para redirecionamento de tela.
 */
export default function UserDetailScreen({ route, navigation }) {
  // Extrai o ID do usuário dos parâmetros da rota
  const { userId } = route.params;

  // Estados para armazenar os detalhes do usuário e controlar o estado de carregamento
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Hook de efeito para buscar os detalhes do usuário ao carregar a tela.
   * Utiliza o userId e o token de autenticação para fazer uma requisição GET.
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
        setUser(data.data); // Armazena os dados do usuário no estado
      } catch (error) {
        console.error("Erro ao carregar detalhes do usuário", error);
      } finally {
        setLoading(false); // Conclui o carregamento
      }
    };

    fetchUserDetails();
  }, [userId, navigation]);

  // Exibe o indicador de carregamento enquanto os dados do usuário estão sendo buscados
  if (loading) {
    return <ActivityIndicator size="large" color="#5D5FEF" style={styles.loader} />;
  }

  // Exibe uma mensagem de erro caso o usuário não seja encontrado
  if (!user) {
    return <Text style={styles.errorText}>Usuário não encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Card de detalhes do usuário */}
      <View style={styles.userCard}>
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.email}>Email: {user.email}</Text>
        <Text style={styles.id}>ID: {user.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Fundo claro para melhor contraste com o cartão do usuário
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center', // Estilo para mensagem de erro
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center', // Centraliza o conteúdo do cartão
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15, // Estilo do nome com destaque
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  id: {
    fontSize: 16,
    color: '#aaa', // Estilo do ID em cor discreta
  },
});
