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
    // Importando um simulacro de Picker (Dropdown) que é comum no React Native
    Platform,
} from 'react-native';
// Importando ícones
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

// Cor principal da aplicação (igual à tela de Login)
const PRIMARY_BLUE = '#3478bf';
const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';

// Componente de Navegação Superior (compartilhado)
const AppHeader = () => (
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Material Share</Text>
        <View style={styles.navLinks}>
        </View>
    </View>
);

// Componente Dropdown Simulado (simplificado para fins de demonstração)
const UserTypePicker = ({ selectedValue, onValueChange }) => (
    <View style={styles.pickerWrapper}>
        <TextInput
            style={[styles.input, styles.pickerInput]}
            value={selectedValue || "Escolha seu tipo de usuário"}
            editable={false} // Não editável, apenas simulando a seleção
            placeholderTextColor="#777"
        />
    </View>
);

export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [cpf, setCpf] = useState('');
    const [cep, setCep] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState(null); // Tipo de Usuário
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleSignUp = () => {
        if (!name || !email || !password || !cpf || !userType) {
            setFeedback({ message: 'Por favor, preencha todos os campos obrigatórios.', type: 'error' });
            return;
        }
        // Lógica de Cadastro simulada
        setFeedback({ message: `Cadastro realizado com sucesso para ${email}!`, type: 'success' });
        
        // Simula a navegação após o cadastro
        setTimeout(() => {
            navigation.navigate('Home'); 
        }, 1500);
    };
    
    // Função para navegar de volta ao Login
    const handleLoginRedirect = () => {
        navigation.navigate('Login');
    };

    // Renderiza a mensagem de feedback
    const FeedbackMessage = () => {
        if (!feedback.message) return null;

        let bgColor = '#fff';
        let textColor = '#333';

        switch (feedback.type) {
            case 'error':
                bgColor = '#fef2f2'; // Red-50
                textColor = '#b91c1c'; // Red-700
                break;
            case 'success':
                bgColor = '#f0fdf4'; // Green-50
                textColor = '#15803d'; // Green-700
                break;
            case 'info':
                bgColor = '#eff6ff'; // Blue-50
                textColor = '#1d4ed8'; // Blue-700
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
            
            {/* O scroll view é essencial para telas com muitos campos */}
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                keyboardShouldPersistTaps="handled"
            >
                
                <View style={styles.loginCard}>
                    <Text style={styles.title}>Cadastro</Text>
                    <Text style={styles.subtitle}>Crie sua conta para acessar a plataforma.</Text>

                    {/* Nome Completo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu Nome Completo..."
                            placeholderTextColor="#777"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    {/* Data de Nascimento (simulação de input com máscara dd/mm/aaaa) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Data de Nascimento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/aaaa"
                            placeholderTextColor="#777"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            keyboardType="numeric"
                            maxLength={10}
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    {/* Telefone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telefone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite o seu Telefone..."
                            placeholderTextColor="#777"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>
                    
                    {/* CPF */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CPF</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu CPF..."
                            placeholderTextColor="#777"
                            value={cpf}
                            onChangeText={setCpf}
                            keyboardType="numeric"
                            maxLength={14}
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>
                    
                    {/* CEP */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CEP</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu CEP..."
                            placeholderTextColor="#777"
                            value={cep}
                            onChangeText={setCep}
                            keyboardType="numeric"
                            maxLength={9}
                            cursorColor={PRIMARY_BLUE}
                        />
                    </View>

                    {/* Email */}
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

                    {/* Senha */}
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
                    
                    {/* Tipo de Usuário (Dropdown Simulado) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo de Usuário</Text>
                        <UserTypePicker 
                            selectedValue={userType} 
                            // Simulando a seleção, na vida real seria um modal/menu flutuante
                            onValueChange={(itemValue) => setUserType(itemValue)}
                        />
                    </View>


                    {/* Botão Cadastrar */}
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleSignUp}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>CADASTRAR</Text>
                    </TouchableOpacity>

                    {/* Link de Login */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Já tem uma conta?</Text>
                        {/* ESTA É A FUNÇÃO QUE REDIRECIONA PARA O LOGIN */}
                        <TouchableOpacity onPress={handleLoginRedirect}>
                            <Text style={styles.signupLink}>entre já clicando aqui!</Text>
                        </TouchableOpacity>
                    </View>

                    <FeedbackMessage />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // --- Header Styles ---
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
    
    // --- Container do Scroll ---
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 15, // Adiciona padding horizontal para evitar que o card toque as bordas
    },

    // --- Login/Cadastro Card Styles ---
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

    // --- Input Styles ---
    inputGroup: {
        marginBottom: 20, // Espaçamento um pouco menor devido ao número de campos
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

    // --- Picker/Dropdown Simulado Styles ---
    pickerWrapper: {
        // Envolve o input que simula o dropdown
        position: 'relative',
    },
    pickerInput: {
        color: '#333',
    },

    // --- Button Styles ---
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
    
    // --- Link Styles ---
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

    // --- Feedback Message Styles ---
    feedbackContainer: {
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
    }
});
