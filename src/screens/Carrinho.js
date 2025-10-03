import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    Dimensions 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// --- CONSTANTES E CONFIGURAÇÕES DE DESIGN (Estilo LoginScreen) ---
const { width } = Dimensions.get('window');
const PRIMARY_BLUE = '#007BFF'; // Azul Institucional, moderno e forte (usado em botões, bordas ativas)
const ACCENT_TEXT = '#333333'; // Texto principal
const LIGHT_BG = '#F0F5F9'; // Fundo Cinza Azulado Suave (fundo da tela)
const CARD_BG = '#FFFFFF'; // Fundo dos cards e modal
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.1)';
const ACCENT_RED = '#DC3545'; // Vermelho para ação/alerta (Marcar Retirado)
const ACCENT_GREEN = '#28A745'; // Verde para sucesso/concluído (Retirado)

// --- DADOS SIMULADOS DE PRODUTOS (Lista) ---
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "4 Telhas de Cerâmica (Tipo Romana)",
        doador: "João Silva",
        recebedor: "Maria Oliveira",
        endereco: "Rua dos Materiais, 123 - SP",
        status: "Pendente Retirada", // Ponto de partida
        description: "Telhas usadas em bom estado, prontas para coleta. Coleta deve ser agendada via chat.",
    },
    {
        id: 2,
        name: "20m² de Piso Porcelanato Bege",
        doador: "Construtora Alfa",
        recebedor: "Pedro Souza",
        endereco: "Av. Principal, 500 - RJ",
        status: "Retirado", 
        description: "Excedente de obra, embalado em caixas originais. Retirada já concluída.",
    },
    {
        id: 3,
        name: "Janela de Alumínio 1.2x1.0m",
        doador: "Ana Costa",
        recebedor: "José Ferreira",
        endereco: "Estrada Velha, S/N - MG",
        status: "Pendente Retirada",
        description: "Janela seminova com vidro temperado. Necessário veículo grande para transporte.",
    }
];

// --- COMPONENTE: AppHeader (Adotado do LoginScreen) ---
const AppHeader = () => (
    <View style={styles.header}>
        <MaterialCommunityIcons name="truck-fast" size={26} color={PRIMARY_BLUE} />
        <Text style={styles.headerTitle}>Minhas Retiradas</Text>
    </View>
);

// --- COMPONENTE: Card Clicável na Lista ---
const ProductCard = ({ product, onPress }) => {
    const isRetirado = product.status === 'Retirado';
    
    return (
        <TouchableOpacity 
            style={[
                styles.card, 
                { borderColor: isRetirado ? ACCENT_GREEN : PRIMARY_BLUE + '60' },
                isRetirado && styles.cardRetirado
            ]}
            onPress={() => onPress(product)} 
            disabled={isRetirado} 
            activeOpacity={0.7}
        >
            <MaterialCommunityIcons 
                name={isRetirado ? "check-circle-outline" : "truck-delivery"} 
                size={28} 
                color={isRetirado ? ACCENT_GREEN : PRIMARY_BLUE} 
                style={styles.cardIcon}
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{product.name}</Text>
                <Text style={styles.cardStatus}>
                    Status: 
                    <Text style={{ color: isRetirado ? ACCENT_GREEN : ACCENT_RED, fontWeight: '700' }}>
                        {isRetirado ? " CONCLUÍDO" : " PENDENTE"}
                    </Text>
                </Text>
            </View>
            <Feather name="chevron-right" size={24} color={isRetirado ? ACCENT_GREEN : PRIMARY_BLUE} />
        </TouchableOpacity>
    );
};

// --- COMPONENTE: Modal/Detalhes do Produto ---
const ProductDetailModal = ({ product, onClose, onMarkRetirado }) => {
    const isRetirado = product.status === 'Retirado';
    
    return (
        // O modal agora tem o estilo do overlay e container do LoginScreen
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                
                {/* Cabeçalho do Modal */}
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{product.name}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Feather name="x" size={24} color={ACCENT_TEXT} />
                    </TouchableOpacity>
                </View>

                {/* Detalhes (Usando ScrollView) */}
                <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                    {/* Doador */}
                    <Text style={styles.detailLabel}>Doador:</Text>
                    <Text style={styles.detailValue}>{product.doador}</Text>

                    {/* Endereço */}
                    <Text style={styles.detailLabel}>Endereço para Retirada:</Text>
                    <Text style={styles.detailValue}>{product.endereco}</Text>
                    
                    {/* Descrição */}
                    <Text style={styles.detailLabel}>Descrição:</Text>
                    <Text style={styles.detailValue}>{product.description}</Text>

                    {/* Status Box */}
                    <View style={styles.statusBox}>
                        <Text style={styles.detailLabel}>Status Atual:</Text>
                        <View style={[styles.statusTag, { backgroundColor: isRetirado ? ACCENT_GREEN + '20' : ACCENT_RED + '20' }]}>
                            <Feather 
                                name={isRetirado ? "check-circle" : "alert-triangle"} 
                                size={14} 
                                color={isRetirado ? ACCENT_GREEN : ACCENT_RED} 
                                style={{marginRight: 5}}
                            />
                            <Text style={{ 
                                ...styles.statusText, 
                                color: isRetirado ? ACCENT_GREEN : ACCENT_RED 
                            }}>
                                {product.status.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Botão de Ação */}
                <TouchableOpacity
                    style={[
                        styles.actionButton, 
                        isRetirado ? styles.buttonDisabled : styles.buttonPrimary
                    ]}
                    onPress={() => !isRetirado && onMarkRetirado(product.id)}
                    disabled={isRetirado}
                >
                    <Text style={styles.actionButtonText}>
                        {isRetirado ? "✅ PRODUTO JÁ RETIRADO" : "MARCAR COMO RETIRADO"}
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};


// --- COMPONENTE PRINCIPAL: Carrinho (Tela) ---
const Carrinho = () => {
    // Lista de produtos
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    // Produto selecionado (para o modal)
    const [selectedProduct, setSelectedProduct] = useState(null); 

    const itemsPending = products.filter(p => p.status !== 'Retirado').length;

    // FUNÇÃO CHAVE: ATUALIZA O STATUS NA LISTA E FORÇA RE-RENDERIZAÇÃO
    const handleMarkRetirado = (id) => {
        Alert.alert(
            "Confirmar Retirada",
            "Você confirma que o produto foi retirado e a transação está concluída?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                { 
                    text: "Confirmar", 
                    onPress: () => {
                        // 1. Cria uma NOVA lista, alterando apenas o status do item com o ID correto
                        setProducts(prevProducts =>
                            prevProducts.map(p =>
                                p.id === id ? { ...p, status: 'Retirado' } : p
                            )
                        );
                        
                        // 2. Fecha o modal
                        setSelectedProduct(null); 
                        
                        // 3. Feedback para o usuário
                        Alert.alert("Sucesso 🎉", "Status de retirada atualizado!");
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader />
            
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Mapeia a lista de produtos para renderizar os Cards */}
                    {products.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product} 
                            // Ao clicar, define o produto como selecionado para abrir o modal
                            onPress={setSelectedProduct} 
                        />
                    ))}
                </ScrollView>

                {/* Seção de Total Pendente (Fixo na parte inferior) */}
                <View style={styles.checkoutBox}>
                    <Text style={styles.totalLabel}>
                        Itens Pendentes:
                    </Text>
                    <Text style={styles.totalValue}>
                        {itemsPending} {itemsPending === 1 ? 'Item' : 'Itens'}
                    </Text>
                </View>

            </View>

            {/* Renderiza o Modal APENAS se houver um produto selecionado */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)} 
                    onMarkRetirado={handleMarkRetirado} // Função funcional
                />
            )}
        </SafeAreaView>
    );
};

// --- ESTILOS REFINADOS (Baseado no LoginScreen) ---
const styles = StyleSheet.create({
    // --- Estilos de Layout Geral ---
    safeArea: {
        flex: 1,
        backgroundColor: LIGHT_BG,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 100, // Espaço para o checkoutBox
    },
    
    // --- Estilos do Header (Adopted) ---
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
        elevation: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: ACCENT_TEXT,
        letterSpacing: 0.5,
        marginLeft: 8,
    },

    // --- Estilos do Card ---
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CARD_BG,
        borderRadius: 10,
        padding: 18,
        marginBottom: 15,
        borderLeftWidth: 6, // Borda marcante
        // Sombra suave, como no LoginScreen
        shadowColor: SHADOW_COLOR, 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    cardRetirado: {
        opacity: 0.7,
        backgroundColor: LIGHT_BG,
    },
    cardIcon: {
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ACCENT_TEXT,
        marginBottom: 4,
    },
    cardStatus: {
        fontSize: 14,
        color: '#777',
    },

    // --- Estilos do Modal/Detalhes ---
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        maxWidth: 450,
        maxHeight: '85%', 
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 25,
        elevation: 15,
        shadowColor: SHADOW_COLOR,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 15,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: PRIMARY_BLUE,
        flexShrink: 1,
        marginRight: 15,
    },
    closeButton: {
        padding: 5,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: PRIMARY_BLUE,
        marginTop: 15,
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 16,
        color: ACCENT_TEXT,
        marginBottom: 5,
        lineHeight: 22,
    },
    statusBox: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 15,
    },
    statusTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    // --- Estilos do Botão ---
    actionButton: {
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        // Sombra forte para o botão de ação
        shadowColor: SHADOW_COLOR,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 15,
    },
    buttonPrimary: {
        backgroundColor: ACCENT_RED, // Usando vermelho para marcar retirada (ação importante)
        shadowColor: ACCENT_RED,
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
        shadowColor: '#A0A0A0',
        elevation: 5,
    },
    actionButtonText: {
        color: CARD_BG,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    
    // --- Estilos de Checkout (Rodapé Fixo) ---
    checkoutBox: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        backgroundColor: CARD_BG, // Fundo branco para destaque
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute', 
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: ACCENT_TEXT,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PRIMARY_BLUE,
    }
});

export default Carrinho;