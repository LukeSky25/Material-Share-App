import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Home from "../screens/Home";
import Cadastro from "../screens/Cadastro";
import Usuario from "../screens/Usuario";
import Carrinho from "../screens/Carrinho";
import FormularioDoacao from "../screens/FormularioDoacao";
import Notificacoes from "../screens/Notificacoes";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Usuario" component={Usuario} />
        <Stack.Screen name="Carrinho" component={Carrinho} />
        <Stack.Screen name="FormularioDoacao" component={FormularioDoacao} />
        <Stack.Screen name="Notificacoes" component={Notificacoes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
