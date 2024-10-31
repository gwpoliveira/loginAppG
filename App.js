import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import UsersScreen from './screens/UsersScreen';
import UserDetailScreen from './screens/UserDetailScreen';
import EditUserScreen from './screens/EditUserScreen';
import DeleteUserScreen from './screens/DeleteUserScreen';

// Criação do stack de navegação para gerenciar as telas
const Stack = createNativeStackNavigator();

/**
 * by Gleiser Wesley
 * Componente principal do aplicativo.
 * Configura a navegação entre as telas de Login, Usuários, Detalhes do Usuário, Edição e Exclusão.
 */
export default function App() {
  return (
    // Contêiner de navegação que gerencia o estado de navegação global
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        {/* Tela de Login */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Tela de Lista de Usuários */}
        <Stack.Screen name="Users" component={UsersScreen} />

        {/* Tela de Detalhes do Usuário */}
        <Stack.Screen name="UserDetail" component={UserDetailScreen} />

        {/* Tela de Edição do Usuário */}
        <Stack.Screen name="EditUser" component={EditUserScreen} />

        {/* Tela de Exclusão do Usuário */}
        <Stack.Screen name="DeleteUser" component={DeleteUserScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
