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
    Keyboard,
} from 'react-native';
// Importando ícones
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

// Constantes de Design Refinadas (Mantendo o padrão profissional)
const { width } = Dimensions.get('window');
const PRIMARY_BLUE = '#007BFF'; // Azul Institucional
const ACCENT_TEXT = '#333333';
const LIGHT_BG = '#F0F5F9'; // Fundo Cinza Azulado Suave
const CARD_BG = '#FFFFFF';
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.1)';

// --- Componentes Reutilizáveis ---

// 1. Componente de Cabeçalho Elegante
const AppHeader = () => (
    <View style={styles.header}>
        <MaterialCommunityIcons name="tools" size={26} color={PRIMARY_BLUE} />
        <Text style={styles.headerTitle}>Material Share</Text>
    </View>
);

// 2. CustomInput (Mantendo o estilo focado e com ícone)
const CustomInput = ({ label, iconName, value, onChangeText, secureTextEntry = false, keyboardType = 'default', autoCapitalize = 'sentences', placeholder, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isFocused ? PRIMARY_BLUE : '#777' }]}>{label}</Text>
            <View 
                style={[
                    styles.inputWrapper,
                    { 
                        borderColor: isFocused ? PRIMARY_BLUE : '#E0E0E0',
                        shadowColor: isFocused ? PRIMARY_BLUE : 'transparent',
                        shadowOpacity: isFocused ? 0.25 : 0,
                    }
                ]}
            >
                <Feather 
                    name={iconName} 
                    size={20} 
                    color={isFocused ? PRIMARY_BLUE : '#A0A0A0'} 
                    style={styles.inputIcon} 
                />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#A0A0A0"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    cursorColor={PRIMARY_BLUE}
                    {...props}
                />
            </View>
        </View>
    );
};

// 3. CustomPicker (Simulação de Dropdown Elegante)
const CustomPicker = ({ label, selectedValue, onOpenPicker }) => {
    const displayValue = selectedValue || "Selecione uma opção...";
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity 
                style={[styles.inputWrapper, styles.pickerWrapper]} 
                onPress={onOpenPicker}
                activeOpacity={0.7}
            >
                <Feather name="users" size={20} color={PRIMARY_BLUE} style={styles.inputIcon} />
                <Text style={[styles.pickerText, { color: selectedValue ? ACCENT_TEXT : '#A0A0A0' }]}>
                    {displayValue}
                </Text>
                <Feather name="chevron-down" size={20} color="#A0A0A0" />
            </TouchableOpacity>
        </View>
    );
};

// 4. Componente de Mensagem de Feedback
const FeedbackMessage = ({ feedback }) => {
    if (!feedback.message) return null;

    let colorMap = {
        error: { bgColor: '#FEE2E2', textColor: '#991B1B', borderColor: '#EF4444', icon: 'alert-triangle' },
        success: { bgColor: '#D1FAE5', textColor: '#047857', borderColor: '#10B981', icon: 'check-circle' },
        info: { bgColor: '#DBEAFE', textColor: '#1D4ED8', borderColor: '#3B82F6', icon: 'info' },
    };

    const { bgColor, textColor, borderColor, icon } = colorMap[feedback.type] || colorMap.info;

    return (
        <View style={[styles.feedbackContainer, { backgroundColor: bgColor, borderLeftColor: borderColor }]}>
            <Feather name={icon} size={18} color={textColor} style={{ marginRight: 10 }} />
            <Text style={{ color: textColor, fontSize: 14, flexShrink: 1 }}>
                {feedback.message}
            </Text>
        </View>
    );
};

// --- Componente Principal ---
export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Campos opcionais/secundários para scroll
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [cep, setCep] = useState('');
    const [userType, setUserType] = useState('Cliente'); // Definindo um valor padrão para simulação
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleSignUp = () => {
        Keyboard.dismiss();

        if (!name || !email || !password || !cpf || !userType) {
            setFeedback({ message: '🚨 Preencha Nome, CPF, Email, Senha e Tipo de Usuário.', type: 'error' });
            return;
        }

        // Lógica de Cadastro simulada
        setFeedback({ message: `Cadastro em andamento...`, type: 'info' });

        setTimeout(() => {
            setFeedback({ message: `✅ Bem-vindo(a) ${name}! Cadastro completo.`, type: 'success' });
            setTimeout(() => {
                navigation.navigate('Home'); 
            }, 1000);
        }, 1500);
    };
    
    // Função para simular a abertura do modal/dropdown
    const handleOpenPicker = () => {
        // Na vida real, você abriria um Modal ou ActionSheet aqui.
        // Por enquanto, apenas alternamos o valor para simulação.
        const newUserType = userType === 'Cliente' ? 'Fornecedor' : 'Cliente';
        setUserType(newUserType);
        setFeedback({ message: `Tipo selecionado: ${newUserType}`, type: 'info' });
    };

    const handleLoginRedirect = () => {
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BG }}>
            <AppHeader />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    
                    <MaterialCommunityIcons name="account-plus-outline" size={50} color={PRIMARY_BLUE} style={styles.cardIcon} />

                    <Text style={styles.title}>Crie Sua Conta</Text>
                    <Text style={styles.subtitle}>Preencha seus dados para começar a usar.</Text>

                    {/* Linha 1: Nome Completo */}
                    <CustomInput
                        label="Nome Completo *"
                        iconName="user"
                        placeholder="Nome Completo"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />

                    {/* Linha 2: CPF */}
                    <CustomInput
                        label="CPF *"
                        iconName="credit-card"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChangeText={setCpf}
                        keyboardType="numeric"
                        maxLength={14}
                    />
                    
                    {/* Linha 3: Email */}
                    <CustomInput
                        label="Email *"
                        iconName="mail"
                        placeholder="seu.email@dominio.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* Linha 4: Senha */}
                    <CustomInput
                        label="Senha *"
                        iconName="lock"
                        placeholder="Crie uma senha forte"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Linha 5: Tipo de Usuário (Dropdown) */}
                    <CustomPicker 
                        label="Tipo de Usuário *" 
                        selectedValue={userType} 
                        onOpenPicker={handleOpenPicker}
                    />

                    {/* Campos Opcionais/Secundários (para mostrar Scroll) */}
                    <View style={styles.sectionDivider} />
                    <Text style={styles.optionalTitle}>Dados Opcionais</Text>

                    {/* Data de Nascimento */}
                    <CustomInput
                        label="Data de Nascimento"
                        iconName="calendar"
                        placeholder="dd/mm/aaaa"
                        value={birthDate}
                        onChangeText={setBirthDate}
                        keyboardType="numeric"
                        maxLength={10}
                    />

                    {/* Telefone */}
                    <CustomInput
                        label="Telefone"
                        iconName="phone"
                        placeholder="(99) 99999-9999"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    
                    {/* CEP */}
                    <CustomInput
                        label="CEP"
                        iconName="map-pin"
                        placeholder="99999-999"
                        value={cep}
                        onChangeText={setCep}
                        keyboardType="numeric"
                        maxLength={9}
                    />

                    {/* Botão Cadastrar */}
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleSignUp}
                        activeOpacity={0.7}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>CADASTRAR CONTA</Text>
                            <Feather name="arrow-right-circle" size={18} color={CARD_BG} style={{ marginLeft: 10 }} />
                        </View>
                    </TouchableOpacity>

                    <FeedbackMessage feedback={feedback} />

                    {/* Link de Login */}
                    <View style={styles.loginLinkContainer}>
                        <Text style={styles.loginText}>Já tem uma conta?</Text>
                        <TouchableOpacity onPress={handleLoginRedirect}>
                            <Text style={styles.loginLink}>Acesse agora</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ---
// ## Estilos Detalhados (Padrão Clean e Moderno)
// ---

const styles = StyleSheet.create({
    // --- Header Styles ---
    header: {
        width: '100%',
        backgroundColor: CARD_BG,
        paddingHorizontal: 20,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: ACCENT_TEXT,
        letterSpacing: 0.5,
        marginLeft: 8,
    },
    
    // --- Scroll e Card Container ---
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: LIGHT_BG,
    },
    card: {
        width: width * 0.9,
        maxWidth: 450,
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 35,
        // Sombra suave, flutuante
        shadowColor: SHADOW_COLOR, 
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardIcon: {
        alignSelf: 'center',
        marginBottom: 15,
        padding: 15,
        borderRadius: 50,
        backgroundColor: '#EBF5FF',
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
    optionalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: PRIMARY_BLUE,
        marginBottom: 15,
        marginTop: 15,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },

    // --- Input Styles (Compartilhado com CustomInput) ---
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
        color: '#777',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 52,
        backgroundColor: '#F9F9F9',
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
        shadowColor: SHADOW_COLOR,
        shadowOpacity: 0.1,
        borderColor: '#E0E0E0', // Cor da borda padrão
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: ACCENT_TEXT,
        paddingVertical: 0,
    },

    // --- Picker/Dropdown Styles ---
    pickerWrapper: {
        justifyContent: 'space-between',
    },
    pickerText: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
        marginRight: 10,
    },

    // --- Button Styles ---
    button: {
        height: 52,
        backgroundColor: PRIMARY_BLUE,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        shadowColor: PRIMARY_BLUE,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 15,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: CARD_BG,
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    
    // --- Link de Login ---
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 35,
        flexWrap: 'wrap',
    },
    loginText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginRight: 5,
    },
    loginLink: {
        fontSize: 14,
        color: PRIMARY_BLUE,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        letterSpacing: 0.3,
    },

    // --- Feedback Message Styles ---
    feedbackContainer: {
        marginTop: 25,
        padding: 15,
        borderRadius: 10,
        borderLeftWidth: 5, 
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: SHADOW_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    }
});