import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

// --- Constantes de Design Refinadas (Copiadas do Login) ---
const { width } = Dimensions.get('window');
const PRIMARY_BLUE = '#007BFF'; // Azul Institucional
const ACCENT_TEXT = '#333333';
const LIGHT_BG = '#F0F5F9'; // Fundo Cinza Azulado Suave
const CARD_BG = '#FFFFFF';
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.1)';
const DARK_BLUE = '#1D4ED8'; // Um azul escuro para o texto principal

// ----------------------------------------------------------------
// Componente de Cabeçalho (Botão de Voltar Removido)
// ----------------------------------------------------------------
const AppHeader = ({ isEditing, onEditSave }) => (
    <View style={profileStyles.header}>
        {/* Placeholder transparente para manter o alinhamento central do título, 
            já que o botão de Voltar foi removido. */}
        <View style={profileStyles.headerButton} /> 
        
        <Text style={profileStyles.headerTitle}>Meu Perfil</Text>
        
        {/* Botão de Editar/Salvar */}
        <TouchableOpacity 
            onPress={onEditSave} 
            style={profileStyles.headerButton}
        >
            <Feather 
                name={isEditing ? "check" : "edit-3"} // edit-3 é mais sutil
                size={24} 
                color={CARD_BG} 
            />
        </TouchableOpacity>
    </View>
);

// ----------------------------------------------------------------
// Componente de Input Customizado (Baseado no CustomInput do Login)
// ----------------------------------------------------------------
const CustomProfileInput = ({ label, iconName, value, onChangeText, editable, ...props }) => {
    // Usamos 'editable' para definir o foco visual aqui
    const isFocused = editable; 
    
    return (
        <View style={profileStyles.inputGroup}>
            <Text style={[profileStyles.label, { color: isFocused ? PRIMARY_BLUE : '#777' }]}>{label}</Text>
            <View 
                style={[
                    profileStyles.inputWrapper,
                    { 
                        borderColor: isFocused ? PRIMARY_BLUE : '#E0E0E0',
                        shadowColor: isFocused ? PRIMARY_BLUE : 'transparent',
                        shadowOpacity: isFocused ? 0.2 : 0,
                        backgroundColor: editable ? '#FFF' : LIGHT_BG, // Fundo levemente diferente quando não é editável
                    }
                ]}
            >
                <Feather 
                    name={iconName} 
                    size={20} 
                    color={isFocused ? PRIMARY_BLUE : '#A0A0A0'} 
                    style={profileStyles.inputIcon} 
                />
                <TextInput
                    style={profileStyles.input}
                    value={value}
                    onChangeText={onChangeText}
                    editable={editable}
                    cursorColor={PRIMARY_BLUE}
                    placeholderTextColor="#A0A0A0"
                    {...props}
                />
            </View>
        </View>
    );
};

// ----------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------
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
    
    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLogout = () => {
        // 1. Simular o processo de logout (limpar token, etc.)
        Alert.alert(
            "Sair da Conta",
            "Tem certeza que deseja fazer logout?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sair", 
                    style: "destructive",
                    onPress: () => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }], // Redireciona para a tela de Login
                    })
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BG }}>
            {/* Header com os botões de ação (sem o botão de voltar) */}
            <AppHeader 
             navigation={navigation} 
                isEditing={isEditing}
                onEditSave={() => isEditing ? handleSave() : setIsEditing(true)}
                 onGoBack={handleGoBack}
            /> 
            
            <ScrollView contentContainerStyle={profileStyles.scrollContainer}>
                
                <View style={profileStyles.profileCard}>
                    
                    {/* Ícone de Avatar com estilo do Login */}
                    <View style={profileStyles.iconCircle}>
                        <MaterialCommunityIcons name="account-circle-outline" size={50} color={PRIMARY_BLUE} />
                    </View>
                    
                    <Text style={profileStyles.title}>Meus Dados</Text>
                    <Text style={profileStyles.subtitle}>Gerencie suas informações pessoais e de contato.</Text>

                    {/* Campo Nome */}
                    <CustomProfileInput
                        label="Nome Completo"
                        iconName="user"
                        value={name}
                        onChangeText={setName}
                        editable={isEditing}
                        autoCapitalize="words"
                    />

                    {/* Campo Email */}
                    <CustomProfileInput
                        label="Email"
                        iconName="mail"
                        value={email}
                        onChangeText={setEmail}
                        editable={isEditing}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* Campo Telefone */}
                    <CustomProfileInput
                        label="Telefone"
                        iconName="phone"
                        value={phone}
                        onChangeText={setPhone}
                        editable={isEditing}
                        keyboardType="phone-pad"
                    />

                    {/* Campo Endereço */}
                    <CustomProfileInput
                        label="Endereço Principal"
                        iconName="map-pin"
                        value={address}
                        onChangeText={setAddress}
                        editable={isEditing}
                        multiline
                        style={profileStyles.multilineInput} // Estilo para multiline
                    />
                </View>
                
                {/* Botão de Logout com estilo do botão do Login (vermelho) */}
                <TouchableOpacity 
                    style={profileStyles.logoutButton} 
                    onPress={() => navigation.navigate('Login')} 
                    activeOpacity={0.8}
                >
                    <Feather name="log-out" size={18} color={CARD_BG} style={{marginRight: 10}} />
                    <Text style={profileStyles.logoutText}>SAIR DA CONTA</Text>
                </TouchableOpacity>

            </ScrollView> 
        </SafeAreaView>
    );
}

// ---
// ## Estilos
// ---

const profileStyles = StyleSheet.create({
    // --- Header ---
    header: {
        backgroundColor: PRIMARY_BLUE,
        paddingHorizontal: 15,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'space-between', // Mantém space-between para centralizar o título entre o placeholder e o botão
        alignItems: 'center',
        elevation: 5,
        // Sombra de topo igual ao botão de login, mas com azul escuro
        shadowColor: DARK_BLUE, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: CARD_BG,
        letterSpacing: 0.5,
    },
    headerButton: {
        padding: 5, // Área de toque, usado como placeholder
        minWidth: 34, // Garante que o placeholder tenha o mesmo tamanho do ícone
    },
    
    // --- Container Principal ---
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: LIGHT_BG,
    },

    // --- Cartão de Perfil (Login Card Style) ---
    profileCard: {
        width: width * 0.9,
        maxWidth: 500,
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 35,
        marginBottom: 30,
        // Sombra suave, flutuante (Login Card)
        shadowColor: SHADOW_COLOR, 
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    iconCircle: {
        alignSelf: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 50,
        backgroundColor: '#EBF5FF', // Fundo sutil
        borderWidth: 2,
        borderColor: PRIMARY_BLUE + '20', 
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: ACCENT_TEXT,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        color: '#777',
        textAlign: 'center',
        marginBottom: 35,
        fontSize: 15,
    },

    // --- Inputs (Custom Input Style do Login) ---
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 15,
        minHeight: 52, // Usado minHeight para multiline
        backgroundColor: '#F9F9F9',
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
        shadowColor: SHADOW_COLOR,
        shadowOpacity: 0.1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: ACCENT_TEXT,
        paddingVertical: 10, // Adicionado padding vertical para multiline
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top', // Garante que o texto multiline comece no topo
        paddingTop: 10, 
        paddingBottom: 10,
    },

    // --- Botão de Logout (Adaptado do estilo do botão principal de Login) ---
    logoutButton: {
        width: '100%',
        maxWidth: 500,
        height: 52,
        backgroundColor: '#C0392B', // Vermelho forte
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // Sombra forte (como no botão de login)
        shadowColor: '#C0392B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 15,
        marginTop: 10,
    },
    logoutText: {
        color: CARD_BG,
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
});
