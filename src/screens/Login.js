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
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

const PRIMARY_BLUE = '#3478bf';
const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';

// Componente de Navegação Superior
const AppHeader = () => (
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Material Share</Text>
        <View style={styles.navLinks}>
            <MaterialCommunityIcons name="at" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </View>
    </View>
);

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleLogin = () => {
        if (!email || !password) {
            setFeedback({ message: 'Por favor, preencha todos os campos.', type: 'error' });
        } else {
            setFeedback({ message: `Login bem-sucedido para ${email}!`, type: 'success' });
            
            // Simula a navegação para Home após o login
            setTimeout(() => {
                navigation.navigate('Home'); 
            }, 1500);
        }
    };

    
    const handleCadastro = () => {
        navigation.navigate('Cadastro');
    };

    const FeedbackMessage = () => {
        if (!feedback.message) return null;

        let bgColor = '#fff';
        let textColor = '#333';

        switch (feedback.type) {
            case 'error':
                bgColor = '#fef2f2';
                textColor = '#b91c1c';
                break;
            case 'success':
                bgColor = '#f0fdf4';
                textColor = '#15803d';
                break;
            case 'info':
                bgColor = '#eff6ff';
                textColor = '#1d4ed8';
                break;
        }

        return (
            <View style={[styles.feedbackContainer, { backgroundColor: bgColor }]}>
                <Text style={{ color: textColor, fontSize: 14, textAlign: 'center' }}>
                    {feedback.message}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
            <AppHeader />
            
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                
                <View style={styles.loginCard}>
                    
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.subtitle}>Entre com suas credenciais.</Text>

                    {/* Campo E-mail */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu Email..."
                            placeholderTextColor="#777"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    {/* Campo Senha */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua Senha..."
                            placeholderTextColor="#777"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    {/* Botão Entrar */}
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>ENTRAR</Text>
                    </TouchableOpacity>

                    {/* Link de Cadastro */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Não tem uma conta ainda?</Text>
                        <TouchableOpacity onPress={handleCadastro}>
                            <Text style={styles.signupLink}>crie sua conta já clicando aqui!</Text>
                        </TouchableOpacity>
                    </View>

                    <FeedbackMessage />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: PRIMARY_BLUE,
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        letterSpacing: 0.5,
    },
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 15,
    },

    loginCard: {
        width: width * 0.9,
        maxWidth: 450,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        color: '#777',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 14,
    },

    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        color: '#555',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    input: {
        height: 40,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1.5,
        fontSize: 16,
        paddingHorizontal: 0,
        paddingVertical: 5,
    },

    button: {
        backgroundColor: PRIMARY_BLUE,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: DARK_BLUE,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
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
    },

    feedbackContainer: {
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
    }
});
