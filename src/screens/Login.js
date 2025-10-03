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
    Keyboard, // Importado para fechar o teclado no login
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

// Constantes de Design Refinadas
const { width } = Dimensions.get('window');
const PRIMARY_BLUE = '#007BFF'; // Azul Institucional, moderno e forte
const ACCENT_TEXT = '#333333';
const LIGHT_BG = '#F0F5F9'; // Fundo Cinza Azulado Suave
const CARD_BG = '#FFFFFF';
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.1)';

// Componente de Cabeçalho Elegante
const AppHeader = () => (
    <View style={styles.header}>
        <MaterialCommunityIcons name="hammer" size={26} color={PRIMARY_BLUE} />
        <Text style={styles.headerTitle}>Material Share</Text>
    </View>
);

// Componente de Input Customizado com Ícone e Foco Visual
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


// Componente Principal
export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleLogin = () => {
        Keyboard.dismiss(); // Fecha o teclado ao tentar logar
        
        if (!email || !password) {
            setFeedback({ message: '🚨 Por favor, preencha todos os campos.', type: 'error' });
            return;
        }

        // Simulação de lógica de login
        setFeedback({ message: `Acesso em andamento...`, type: 'info' });

        setTimeout(() => {
            // Lógica de autenticação (simplificada)
            const success = email.includes('@') && password.length >= 4;

            if (success) {
                setFeedback({ message: `✅ Login bem-sucedido! Redirecionando...`, type: 'success' });
                setTimeout(() => {
                    navigation.navigate('Home'); 
                }, 1000);
            } else {
                 setFeedback({ message: '❌ Email ou senha inválidos. Tente novamente.', type: 'error' });
            }
        }, 1500);
    };

    const handleCadastro = () => {
        navigation.navigate('Cadastro');
    };

    // Componente de Mensagem de Feedback Detalhado
    const FeedbackMessage = () => {
        if (!feedback.message) return null;

        let colorMap = {
            error: { bgColor: '#FEE2E2', textColor: '#991B1B', borderColor: '#EF4444', icon: 'x-circle' },
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_BG }}>
            <AppHeader />
            
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                
                <View style={styles.loginCard}>
                    
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="account-circle-outline" size={50} color={PRIMARY_BLUE} />
                    </View>

                    <Text style={styles.title}>Login de Acesso</Text>
                    <Text style={styles.subtitle}>Entre para continuar no ecossistema.</Text>

                    {/* Campo E-mail */}
                    <CustomInput
                        label="Email"
                        iconName="mail"
                        placeholder="seu.email@exemplo.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* Campo Senha */}
                    <CustomInput
                        label="Senha"
                        iconName="lock"
                        placeholder="Digite sua senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Botão Entrar com Ícone */}
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleLogin}
                        activeOpacity={0.7}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>ACESSAR</Text>
                            <Feather name="log-in" size={18} color={CARD_BG} style={{ marginLeft: 10 }} />
                        </View>
                    </TouchableOpacity>

                    <FeedbackMessage />

                    {/* Link de Cadastro */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Novo por aqui?</Text>
                        <TouchableOpacity onPress={handleCadastro}>
                            <Text style={styles.signupLink}>Crie sua conta agora!</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ---
// ## Estilos Detalhados
// ---

const styles = StyleSheet.create({
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
    
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: LIGHT_BG,
    },

    loginCard: {
        width: width * 0.9,
        maxWidth: 420,
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
    iconCircle: {
        alignSelf: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 50,
        backgroundColor: '#EBF5FF', // Fundo sutil para o ícone
        borderWidth: 2,
        borderColor: PRIMARY_BLUE + '20', // Borda semitransparente
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

    // ---
    // Inputs
    // ---
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
        height: 52,
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
        paddingVertical: 0,
    },

    // ---
    // Botão
    // ---
    button: {
        height: 52,
        backgroundColor: PRIMARY_BLUE,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        // Sombra forte para o botão de ação
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
    
    // ---
    // Link de Cadastro
    // ---
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 35,
        flexWrap: 'wrap',
    },
    signupText: {
        fontSize: 14,
        color: '#7f8c8d',
        marginRight: 5,
    },
    signupLink: {
        fontSize: 14,
        color: PRIMARY_BLUE,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        letterSpacing: 0.3,
    },

    // ---
    // Feedback
    // ---
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