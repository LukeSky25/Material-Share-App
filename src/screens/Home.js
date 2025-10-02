import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ScrollView,
    TouchableOpacity, 
} from 'react-native';
// Importando ícones
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

// Cores baseadas no seu tema
const PRIMARY_BLUE = '#3478bf';
const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';
const CARD_SHADOW = '#000';

// Dados dos Serviços (Inalterado)
const SERVICES_DATA = [
    {
        id: '1',
        icon: 'message-circle', 
        title: 'Captação e Divulgação',
        description: 'Identificamos e cadastramos doadores (pessoas físicas e empresas) que possuem materiais de construção excedentes ou sem uso, como sobras de obras, itens de mostruário ou estoque parado.',
    },
    {
        id: '2',
        icon: 'link', 
        title: 'A Ponte Solidária (Intermediação)',
        description: 'Nosso trabalho é fazer a conexão. Analisamos as doações disponíveis e as cruzamos com as solicitações de beneficiários previamente cadastrados e verificados, como famílias de baixa renda e outras ONGs.',
    },
    {
        id: '3',
        icon: 'truck', 
        title: 'Destinação e Logística',
        description: 'Auxiliamos na coordenação da retirada e entrega dos materiais, buscando a solução mais viável para que os itens cheguem ao seu destino final e promovam a transformação necessária.',
    },
    {
        id: '4',
        icon: 'home', 
        title: 'Conexão com o Beneficiário',
        description: 'Facilitamos o contato e a logística para que o material certo chegue a quem realmente precisa, transformando o que seria descartado em lares mais seguros e sonhos realizados.',
    },
];

// Componente de um link de navegação com ícone (Inalterado)
const NavLink = ({ iconName, label, isCurrent }) => (
    <View style={headerStyles.navLinkContainer}>
        <Feather 
            name={iconName} 
            size={18} 
            color={isCurrent ? '#FFF' : '#b2e2ff'} 
        />
        <Text style={[
            headerStyles.navText, 
            isCurrent && headerStyles.navTextActive 
        ]}>
            {label}
        </Text>
    </View>
);

// CORREÇÃO: Ícones agrupados em uma View com flexDirection: 'row'
const AppHeader = ({ navigation }) => (
    <View style={headerStyles.header}>
        <Text style={headerStyles.headerTitle}>Material Share</Text>
        
        {/* CONTAINER CHAVE: Agrupa os ícones e os coloca LADO A LADO */}
        <View style={headerStyles.iconesDireita}>
            
            {/* Ícone 1 (Esquerda): Carrinho */}
            <TouchableOpacity 
                onPress={() => navigation.navigate('Carrinho')}
                style={headerStyles.carrinhoIconContainer} 
            >
                <Feather name="shopping-cart" size={26} color="#FFF" />
            </TouchableOpacity>

            {/* Ícone 2 (Direita): Usuário */}
            <TouchableOpacity 
               onPress={() => navigation.navigate('Usuario')}
                style={headerStyles.userIconContainer} 
            >
                <Feather name="user" size={26} color="#FFF" /> 
            </TouchableOpacity>

        </View>

    </View>
);


// Componente para renderizar o Card de Serviço (Inalterado)
const ServiceCard = ({ item }) => (
    <View style={aboutStyles.serviceCard}>
        <Feather 
            name={item.icon} 
            size={36} 
            color={PRIMARY_BLUE} 
            style={aboutStyles.serviceIcon} 
        />
        <Text style={aboutStyles.cardTitle}>{item.title}</Text>
        <Text style={aboutStyles.cardDescription}>{item.description}</Text>
    </View>
);


export default function AboutScreen({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
            <AppHeader navigation={navigation} /> 
            
            <ScrollView contentContainerStyle={aboutStyles.scrollContainer}>
                
                <Text style={aboutStyles.mainTitle}>Nossos Serviços</Text>
                
                <Text style={aboutStyles.missionText}>
                    Na Material Share, nosso principal serviço é atuar como uma ponte. Conectamos a generosidade de quem doa com a necessidade de quem constrói, garantindo que os materiais de construção encontrem seu destino certo.
                </Text>
                
                <View style={aboutStyles.servicesContainer}>
                    {SERVICES_DATA.map(service => (
                        <ServiceCard key={service.id} item={service} />
                    ))}
                </View>
                
                <View style={aboutStyles.footerContainer}>
                    <Text style={aboutStyles.footerText}>© 2025 Material Share</Text>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos do Header (headerStyles)
const headerStyles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: PRIMARY_BLUE,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: CARD_SHADOW,
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
    
    // NOVO ESTILO CHAVE: Ícones lado a lado
    iconesDireita: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    
    // Ícone de Carrinho (com margem à direita para o Usuário)
    carrinhoIconContainer: {
        padding: 5,
        marginRight: 15, 
    },
    
    // Ícone de Usuário
    userIconContainer: {
        padding: 5,
    },
    
    // Restante dos estilos (Inalterado)
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
        justifyContent: 'center', 
        marginHorizontal: 10,
    },
    navLinkContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        marginHorizontal: 10,
    },
    navText: {
        color: '#b2e2ff',
        fontSize: 10,
        fontWeight: '500',
        marginTop: 2,
    },
    navTextActive: {
        color: '#FFF',
        fontWeight: '700',
    }
});

// Estilos específicos da tela "Sobre/Serviços" (Inalterado)
const aboutStyles = StyleSheet.create({
    scrollContainer: {
        padding: 25,
        alignItems: 'center', 
        paddingBottom: 0,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '600',
        color: DARK_BLUE,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    missionText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        maxWidth: 600, 
    },
    servicesContainer: {
        width: '100%',
        maxWidth: 600,
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        paddingHorizontal: 5,
        marginBottom: 30,
    },
    serviceCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        width: width > 600 ? '48%' : '100%', 
        minWidth: 250,
        marginBottom: 20, 
        shadowColor: CARD_SHADOW,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 6,
    },
    serviceIcon: {
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: DARK_BLUE,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#777',
        lineHeight: 20,
    },
    footerContainer: {
        width: '100%',
        backgroundColor: PRIMARY_BLUE,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
    }
});