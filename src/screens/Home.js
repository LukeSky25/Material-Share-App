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
  Image,
  FlatList, // Ideal para renderizar listas grandes de forma eficiente
} from 'react-native';
// Importando ícones
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');

// Cores baseadas no seu tema
const PRIMARY_BLUE = '#3478bf';
const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';
const CARD_SHADOW = '#000';

// Dados simulados de materiais
const MOCK_MATERIALS = [
    { id: '1', name: 'Bloco de Concreto Estrutural', price: 'R$ 3,50 / un.', location: 'São Paulo - SP', image: 'https://placehold.co/100x100/eeeeee/3478bf?text=BLOCO', category: 'Alvenaria' },
    { id: '2', name: 'Saco de Cimento CP V 50kg', price: 'R$ 32,90 / un.', location: 'Rio de Janeiro - RJ', image: 'https://placehold.co/100x100/eeeeee/3478bf?text=CIMENTO', category: 'Argamassa' },
    { id: '3', name: 'Telha Cerâmica Romana', price: 'R$ 1,99 / un.', location: 'Belo Horizonte - MG', image: 'https://placehold.co/100x100/eeeeee/3478bf?text=TELHA', category: 'Cobertura' },
    { id: '4', name: 'Barra de Aço CA-50 10mm', price: 'R$ 45,00 / un.', location: 'Curitiba - PR', image: 'https://placehold.co/100x100/eeeeee/3478bf?text=AÇO', category: 'Estrutura' },
    { id: '5', name: 'Placa de Gesso Acartonado', price: 'R$ 28,00 / un.', location: 'Porto Alegre - RS', image: 'https://placehold.co/100x100/eeeeee/3478bf?text=GESSO', category: 'Acabamento' },
    { id: '6', name: 'Piso Porcelanato 60x60', price: 'R$ 65,00 / m²', location: 'Salvador - BA', image: 'https://placehold.co/100x100/eeeeee/3478bf?text=PISO', category: 'Revestimento' },
];

// Componente de Navegação Superior (Barra de título)
const AppHeader = () => (
    <View style={headerStyles.header}>
        <Text style={headerStyles.headerTitle}>Material Share</Text>
        <Text style={headerStyles.headerTitle}>Usuário</Text>
        
        {/* Removemos os textos estáticos "Início", "Serviços", "Sobre" */}
        <View style={headerStyles.navLinks}>
            <MaterialCommunityIcons name="at" size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </View>
    </View>
);

// Componente para renderizar um item na lista
const MaterialCard = ({ item }) => (
    <View style={homeStyles.card}>
        {/* Imagem Placeholder do Material */}
        <Image 
            source={{ uri: item.image }} 
            style={homeStyles.cardImage} 
        />
        <View style={homeStyles.cardDetails}>
            <Text style={homeStyles.cardName} numberOfLines={2}>{item.name}</Text>
            <Text style={homeStyles.cardPrice}>{item.price}</Text>
            
            {/* Localização */}
            <View style={homeStyles.cardFooter}>
                <Feather name="map-pin" size={14} color="#7f8c8d" />
                <Text style={homeStyles.cardLocation}>{item.location}</Text>
            </View>
            
            {/* Categoria */}
            <Text style={homeStyles.cardCategory}>Categoria: {item.category}</Text>
        </View>
        
        {/* Botão de Ver Detalhes */}
        <TouchableOpacity style={homeStyles.viewButton} activeOpacity={0.8}>
            <AntDesign name="arrowright" size={20} color="#FFF" />
        </TouchableOpacity>
    </View>
);


export default function HomeScreen({ navigation }) {
    const [searchText, setSearchText] = useState('');
    
    // Filtra materiais com base no texto de busca
    const filteredMaterials = MOCK_MATERIALS.filter(material => 
        material.name.toLowerCase().includes(searchText.toLowerCase()) ||
        material.location.toLowerCase().includes(searchText.toLowerCase()) ||
        material.category.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_GRAY }}>
            <AppHeader />
            
            {/* Barra de Pesquisa e Filtro */}
            <View style={homeStyles.searchContainer}>
                <View style={homeStyles.searchInputWrapper}>
                    <Feather name="search" size={20} color="#7f8c8d" style={homeStyles.searchIcon} />
                    <TextInput
                        style={homeStyles.searchInput}
                        placeholder="Buscar materiais, cidades ou categorias..."
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                        cursorColor={PRIMARY_BLUE}
                    />
                </View>

                {/* Botão de Filtro (Simulado) */}
                <TouchableOpacity style={homeStyles.filterButton} activeOpacity={0.8}>
                    <Feather name="sliders" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Lista de Materiais usando FlatList para melhor performance */}
            <FlatList
                data={filteredMaterials}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MaterialCard item={item} />}
                contentContainerStyle={homeStyles.listContent}
                ListHeaderComponent={() => (
                    <Text style={homeStyles.sectionTitle}>
                        Materiais Disponíveis ({filteredMaterials.length})
                    </Text>
                )}
                ListEmptyComponent={() => (
                    <Text style={homeStyles.emptyText}>Nenhum material encontrado para sua busca.</Text>
                )}
            />
            
        </SafeAreaView>
    );
}

// Estilos do Header (Replicados para consistência)
const headerStyles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: PRIMARY_BLUE,
        paddingHorizontal: 15,
        paddingVertical: 15,
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
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        // removemos o espaço que os textos estáticos ocupavam
    },
    navText: {
        color: '#FFF',
        fontSize: 14,
        marginHorizontal: 8,
    },
});

// Estilos específicos da Home
const homeStyles = StyleSheet.create({
    // --- Área de Busca ---
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingBottom: 10,
        backgroundColor: LIGHT_GRAY,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginRight: 10,
        height: 48,
        shadowColor: CARD_SHADOW,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    filterButton: {
        backgroundColor: DARK_BLUE,
        padding: 12,
        borderRadius: 8,
        shadowColor: DARK_BLUE,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

    // --- Lista e Título da Seção ---
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        marginBottom: 15,
    },
    emptyText: {
        textAlign: 'center',
        color: '#7f8c8d',
        marginTop: 50,
        fontSize: 16,
    },

    // --- Card de Material ---
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: CARD_SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: LIGHT_GRAY,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    cardName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PRIMARY_BLUE,
        marginBottom: 5,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    cardLocation: {
        fontSize: 12,
        color: '#7f8c8d',
        marginLeft: 5,
    },
    cardCategory: {
        fontSize: 12,
        color: DARK_BLUE,
        fontWeight: '500',
        marginTop: 5,
    },
    viewButton: {
        backgroundColor: PRIMARY_BLUE,
        padding: 10,
        borderRadius: 50, // Circular
        marginLeft: 10,
    },
});
