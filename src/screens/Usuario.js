import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; 

// Cores baseadas no seu tema
const PRIMARY_BLUE = '#3478bf';
const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';
const CARD_SHADOW = '#000';

export default function ProfileScreen({ navigation }) {
    // Dados simulados do usuário
    const [name, setName] = useState('João da Silva');
    const [email, setEmail] = useState('joao.silva@email.com');
    const [phone, setPhone] = useState('(99) 99999-9999');
    const [address, setAddress] = useState('Rua dos Materiais, 123 - SP');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        // Lógica real de salvamento (API call) iria aqui
        Alert.alert("Sucesso", "Suas informações foram salvas!");
        setIsEditing(false);
    };
    
    // Volta para a tela anterior
    const handleGoBack = () => {
        navigation.goBack();
    };

    // NOVA FUNÇÃO: Gerencia o processo de Logout e Navegação
    const handleLogout = () => {
        // 1. Simular o processo de logout (limpar token, etc.)
        // console.log("Usuário deslogado."); 

        // 2. Navegar para a tela de Login e resetar o histórico de navegação
        // Isso evita que o usuário volte para a tela de perfil após o logout.
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }], // <--- Nome da SUA tela de login
        });

        // Se você não quiser resetar, pode usar apenas:
        // navigation.navigate('Login'); 
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
            {/* Header Customizado da Página de Perfil */}
            <View style={profileStyles.header}>
                <TouchableOpacity onPress={handleGoBack} style={profileStyles.backButton}>
                    <Feather name="arrow-left" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={profileStyles.headerTitle}>Meu Perfil</Text>
                
                {/* Botão de Editar/Salvar */}
                <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                    <Feather 
                        name={isEditing ? "check" : "edit"} 
                        size={24} 
                        color="#FFF" 
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={profileStyles.scrollContainer}>
                
                <View style={profileStyles.profileCard}>
                    {/* Ícone de Avatar */}
                    <View style={profileStyles.avatarContainer}>
                        <Feather name="user" size={60} color={DARK_BLUE} />
                    </View>
                    
                    <Text style={profileStyles.sectionTitle}>Informações Pessoais</Text>

                    {/* Campo Nome */}
                    <View style={profileStyles.inputGroup}>
                        <Text style={profileStyles.label}>Nome Completo</Text>
                        <TextInput
                            style={profileStyles.input}
                            value={name}
                            onChangeText={setName}
                            editable={isEditing}
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    {/* Campo Email */}
                    <View style={profileStyles.inputGroup}>
                        <Text style={profileStyles.label}>Email</Text>
                        <TextInput
                            style={profileStyles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            editable={isEditing}
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    {/* Campo Telefone */}
                    <View style={profileStyles.inputGroup}>
                        <Text style={profileStyles.label}>Telefone</Text>
                        <TextInput
                            style={profileStyles.input}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            editable={isEditing}
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    <Text style={[profileStyles.sectionTitle, {marginTop: 20}]}>Localização</Text>

                    {/* Campo Endereço */}
                    <View style={profileStyles.inputGroup}>
                        <Text style={profileStyles.label}>Endereço Principal</Text>
                        <TextInput
                            style={profileStyles.input}
                            value={address}
                            onChangeText={setAddress}
                            editable={isEditing}
                            cursorColor={PRIMARY_BLUE}
                            multiline
                        />
                    </View>

                </View>
                
                {/* Botão de Logout - CHAMANDO handleLogout */}
                <TouchableOpacity 
                    style={profileStyles.logoutButton} 
                    onPress={handleLogout} // <--- Chamada para a nova função
                >
                    <Text style={profileStyles.logoutText}>SAIR DA CONTA</Text>
                    <Feather name="log-out" size={18} color="#C0392B" style={{marginLeft: 8}} />
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const profileStyles = StyleSheet.create({
    // ... (Seus estilos permanecem os mesmos) ...
    header: {
        backgroundColor: PRIMARY_BLUE,
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
    },
    profileCard: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 30,
        marginBottom: 20,
        elevation: 5,
        shadowColor: CARD_SHADOW,
    },
    avatarContainer: {
        alignSelf: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: LIGHT_GRAY,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 2,
        borderColor: DARK_BLUE,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: DARK_BLUE,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: LIGHT_GRAY,
        paddingBottom: 5,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#777',
        marginBottom: 4,
    },
    input: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 5,
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FADBD8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#C0392B',
    },
    logoutText: {
        color: '#C0392B',
        fontSize: 16,
        fontWeight: 'bold',
    },
});