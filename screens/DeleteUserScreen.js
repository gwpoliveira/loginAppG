import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * by Gleiser Wesley
 * Tela de confirmação para exclusão de usuário.
 * Ao confirmar, o usuário é excluído e redirecionado para a lista de usuários.
 *
 * @param {object} route - Contém parâmetros passados pela navegação, como userId.
 * @param {object} navigation - Objeto de navegação para redirecionamento de tela.
 */
export default function DeleteUserScreen({ route, navigation }) {
  // Extrai o ID do usuário dos parâmetros da rota
  const { userId } = route.params;

  /**
   * Função para excluir o usuário.
   * Verifica o token de autenticação no AsyncStorage. Se o token existir, realiza uma chamada DELETE à API para excluir o usuário.
   * Em caso de sucesso, exibe uma mensagem de confirmação e redireciona para a tela de lista de usuários.
   */
  const handleDelete = async () => {
    // Busca o token de autenticação
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      // Redireciona para a tela de login caso o token não exista
      navigation.navigate('Login');
      return;
    }

    try {
      // Realiza a requisição DELETE com o token de autenticação no cabeçalho
      const response = await fetch(`https://reqres.in/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` } // Correção com backticks
      });

      // Verifica se a exclusão foi bem-sucedida
      if (response.ok) {
        Alert.alert("Sucesso", "Usuário excluído!");
        navigation.navigate("Users"); // Redireciona para a lista de usuários
      } else {
        Alert.alert("Erro", "Não foi possível excluir o usuário.");
      }
    } catch (error) {
      console.error("Erro ao excluir o usuário", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Texto de confirmação para exclusão */}
      <Text style={styles.warningText}>Tem certeza de que deseja excluir este usuário?</Text>

      {/* Botão de confirmação de exclusão */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>

      {/* Botão para cancelar a exclusão e retornar */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Fundo claro para melhor contraste
  },
  warningText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: 'red', // Botão vermelho para indicar ação crítica
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteButtonText: {
    color: '#fff', // Texto branco para contraste com o botão vermelho
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc', // Botão cinza para ação de cancelamento
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333', // Texto escuro para contraste com o botão cinza
    fontSize: 16,
    fontWeight: 'bold',
  },
});
