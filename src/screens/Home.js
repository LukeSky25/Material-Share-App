import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ScrollView,
    TouchableOpacity, // <--- Importante: Adicionado TouchableOpacity
} from 'react-native';
// Importando ícones
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

// Cores baseadas no seu tema
const PRIMARY_BLUE = '#3478bf';
const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';
const CARD_SHADOW = '#000';

// Dados dos Serviços
const SERVICES_DATA = [
    {
        id: '1',
        icon: 'message-circle', // Ícone de megafone para Captação e Divulgação
        title: 'Captação e Divulgação',
        description: 'Identificamos e cadastramos doadores (pessoas físicas e empresas) que possuem materiais de construção excedentes ou sem uso, como sobras de obras, itens de mostruário ou estoque parado.',
    },
    {
        id: '2',
        // ATENÇÃO: 'handshake' não é do Feather, mas vamos manter o nome.
        // Se der interrogação, troque para um Feather (ex: 'link-2').
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

// Componente de um link de navegação com ícone
// Mantenho esta função mesmo sem uso, caso você queira reativar os links.
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

// CORREÇÃO AQUI: AppHeader AGORA RECEBE A PROPRIEDADE 'navigation'
const AppHeader = ({ navigation }) => (
    <View style={headerStyles.header}>
        <Text style={headerStyles.headerTitle}>Material Share</Text>
        
        {/* CORREÇÃO AQUI: Ícone de Usuário AGORA ENVOLVIDO EM TouchableOpacity */}
        <TouchableOpacity 
            onPress={() => navigation.navigate('Usuario')} // <--- Ação de navegação
            style={headerStyles.userIconContainer} // Estilo opcional para expandir a área de toque
        >
            <Feather name="user" size={30} color="#FFF" />
        </TouchableOpacity>

    </View>
);


// Componente para renderizar o Card de Serviço
const ServiceCard = ({ item }) => (
    <View style={aboutStyles.serviceCard}>
        {/* Nota: Se o Card 2 ('handshake') der problema, troque o Feather
           para o MaterialCommunityIcons, ou mude para um ícone Feather
           (ex: 'link-2') */}
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
            {/* CORREÇÃO AQUI: PASSANDO 'navigation' para o AppHeader */}
            <AppHeader navigation={navigation} /> 
            
            <ScrollView contentContainerStyle={aboutStyles.scrollContainer}>
                
                {/* Título Principal */}
                <Text style={aboutStyles.mainTitle}>Nossos Serviços</Text>
                
                {/* História/Missão do Site */}
                <Text style={aboutStyles.missionText}>
                    Na Material Share, nosso principal serviço é atuar como uma ponte. Conectamos a generosidade de quem doa com a necessidade de quem constrói, garantindo que os materiais de construção encontrem seu destino certo.
                </Text>
                
                {/* Renderização dos Cards de Serviço */}
                <View style={aboutStyles.servicesContainer}>
                    {SERVICES_DATA.map(service => (
                        <ServiceCard key={service.id} item={service} />
                    ))}
                </View>
                
                {/* Rodapé que você viu no design */}
                <View style={aboutStyles.footerContainer}>
                    <Text style={aboutStyles.footerText}>© 2025 Material Share</Text>
                </View>
                
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos do Header
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
    // Estilo opcional para o TouchableOpacity
    userIconContainer: {
        padding: 5,
    },
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
        justifyContent: 'center', 
        marginHorizontal: 10,
    },
    navLinkContainer: {
        flexDirection: 'column', 
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

// Estilos específicos da tela "Sobre/Serviços"
const aboutStyles = StyleSheet.create({
    scrollContainer: {
        padding: 25,
        alignItems: 'center', 
        paddingBottom: 0,
    },
    // --- Título e Missão ---
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
    // --- Container de Serviços ---
    servicesContainer: {
        width: '100%',
        maxWidth: 600,
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        paddingHorizontal: 5,
        marginBottom: 30,
    },
    // --- Card de Serviço ---
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
    // --- Rodapé ---
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