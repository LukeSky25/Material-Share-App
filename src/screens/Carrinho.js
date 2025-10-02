import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    Alert, 
    ScrollView 
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// --- CONFIGURAÇÕES E CONSTANTES ---
const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';
const PRIMARY_BLUE = '#3478bf';
const ACCENT_RED = '#E74C3C';
const ACCENT_GREEN = '#27AE60';

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
    }
    // Você pode adicionar mais itens aqui para testar a lista!
];

// --- COMPONENTE: Card Clicável na Lista ---
const ProductCard = ({ product, onPress }) => {
    const isRetirado = product.status === 'Retirado';
    
    return (
        // O onPress passa o objeto 'product' inteiro para o componente pai
        <TouchableOpacity 
            style={[styles.card, isRetirado && styles.cardRetirado]}
            onPress={() => onPress(product)} 
            disabled={isRetirado} 
        >
            <MaterialCommunityIcons 
                name={isRetirado ? "check-circle" : "truck-delivery"} 
                size={30} 
                color={isRetirado ? ACCENT_GREEN : DARK_BLUE} 
                style={styles.cardIcon}
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{product.name}</Text>
                <Text style={styles.cardStatus}>
                    Status: 
                    <Text style={{ color: isRetirado ? ACCENT_GREEN : PRIMARY_BLUE, fontWeight: '600' }}>
                        {isRetirado ? " Retirado" : " Pendente"}
                    </Text>
                </Text>
            </View>
            <Feather name="chevron-right" size={24} color="#BBB" />
        </TouchableOpacity>
    );
};

// --- COMPONENTE: Modal/Detalhes do Produto ---
const ProductDetailModal = ({ product, onClose, onMarkRetirado }) => {
    const isRetirado = product.status === 'Retirado';
    
    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                
                {/* Cabeçalho do Modal */}
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{product.name}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Feather name="x" size={24} color={DARK_BLUE} />
                    </TouchableOpacity>
                </View>

                {/* Detalhes (Usando ScrollView para caber em telas menores) */}
                <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                    <Text style={styles.detailLabel}>Doador:</Text>
                    <Text style={styles.detailValue}>{product.doador}</Text>

                    <Text style={styles.detailLabel}>Endereço para Retirada:</Text>
                    <Text style={styles.detailValue}>{product.endereco}</Text>
                    
                    <Text style={styles.detailLabel}>Descrição:</Text>
                    <Text style={styles.detailValue}>{product.description}</Text>

                    <View style={styles.statusBox}>
                        <Text style={styles.detailLabel}>Status Atual:</Text>
                        <Text style={{ ...styles.statusText, color: isRetirado ? ACCENT_GREEN : ACCENT_RED }}>
                            {product.status}
                        </Text>
                    </View>
                </ScrollView>

                {/* Botão de Ação: AGORA FUNCIONA ATUALIZANDO O ESTADO GLOBAL */}
                <TouchableOpacity
                    style={[
                        styles.actionButton, 
                        isRetirado ? styles.buttonDisabled : styles.buttonPrimary
                    ]}
                    // Chama a função onMarkRetirado, passando o ID do produto atual
                    onPress={() => !isRetirado && onMarkRetirado(product.id)}
                    disabled={isRetirado}
                >
                    <Text style={styles.actionButtonText}>
                        {isRetirado ? "Produto JÁ Retirado" : "Marcar Produto Retirado"}
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
                        Alert.alert("Sucesso", "Status de retirada atualizado!");
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                <Text style={styles.title}>Minhas Retiradas</Text>
                
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
                    <Text style={styles.totalText}>
                        Itens pendentes: {itemsPending}
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

// --- ESTILOS (Mantidos) ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LIGHT_GRAY,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContent: {
        paddingBottom: 80, // Espaço para o checkoutBox
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: DARK_BLUE,
        marginBottom: 20,
    },
    // --- Estilos do Card ---
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderLeftWidth: 5,
        borderColor: PRIMARY_BLUE, 
    },
    cardRetirado: {
        borderColor: ACCENT_GREEN, 
        opacity: 0.7,
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
        color: '#333',
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
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%', 
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: LIGHT_GRAY,
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: DARK_BLUE,
        flexShrink: 1,
        marginRight: 10,
    },
    detailLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: PRIMARY_BLUE,
        marginTop: 10,
    },
    detailValue: {
        fontSize: 15,
        color: '#333',
        marginBottom: 5,
    },
    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: LIGHT_GRAY,
    },
    statusText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    // --- Estilos do Botão ---
    actionButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonPrimary: {
        backgroundColor: ACCENT_RED, 
    },
    buttonDisabled: {
        backgroundColor: '#CCC',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // --- Estilos de Checkout ---
    checkoutBox: {
        width: '100%',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        backgroundColor: LIGHT_GRAY,
        alignItems: 'flex-end',
        position: 'absolute', 
        bottom: 0,
        paddingHorizontal: 20,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DARK_BLUE,
    }
});

export default Carrinho;