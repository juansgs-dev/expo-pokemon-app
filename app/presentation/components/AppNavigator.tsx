import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import PokedexScreen from '../screens/PokedexScreen';
import PokemonList from '../screens/PokemonList';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#EE1515",
                tabBarInactiveTintColor: "#aaa",
                tabBarStyle: {
                    backgroundColor: "#1f1f1f",
                    paddingBottom: 6,
                    height: 60,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 8,
                },
            }}
        >
            <Tab.Screen
                name="Catalog"
                component={PokemonList}
                options={{
                    tabBarLabel: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Pokedex"
                component={PokedexScreen}
                options={{
                    tabBarLabel: "Pokedex",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="pokeball" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
