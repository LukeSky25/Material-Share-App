import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Home from "../screens/Home";
import Cadastro from "../screens/Cadastro";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
  {/* Apenas UM Stack.Navigator */}
  <Stack.Navigator initialRouteName="Login"> 
    <Stack.Screen name="Login" component={Login} options={{ title: "" }} />
    <Stack.Screen name="Home" component={Home} options={{ title: "" }} />
    <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: "" }} />
  </Stack.Navigator>
</NavigationContainer>

  );
}
