import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const DARK_BLUE = '#2c65a0';
const LIGHT_GRAY = '#f7f9fb';
const PRIMARY_BLUE = '#3478bf'; 

const Carrinho = () => {
    return (
        // Usamos SafeAreaView para garantir que o conteúdo não fique debaixo do notch
        <SafeAreaView style={carrinhoStyles.safeArea}>
            <View style={carrinhoStyles.container}>
                
                <Text style={carrinhoStyles.title}>Seu Carrinho de Materiais</Text>
                
                {/* Esta é a área onde os itens do carrinho seriam renderizados */}
                <View style={carrinhoStyles.emptyCartArea}>
                    <Text style={carrinhoStyles.emptyCartText}>
                        Seu carrinho está vazio. Adicione itens para começar!
                    </Text>
                    {/* Ex: Você pode adicionar um botão "Voltar às Compras" aqui */}
                </View>

                {/* Área de Total e Checkout */}
                <View style={carrinhoStyles.checkoutBox}>
                    <Text style={carrinhoStyles.totalText}>Total Estimado: R$ 0,00</Text>
                    {/* Botão de Checkout... */}
                </View>

            </View>
        </SafeAreaView>
    );
};

const carrinhoStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: LIGHT_GRAY,
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: DARK_BLUE,
        marginBottom: 30,
        marginTop: 10,
    },
    emptyCartArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyCartText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        lineHeight: 24,
    },
    checkoutBox: {
        width: '100%',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        backgroundColor: '#FFF',
        alignItems: 'flex-end',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PRIMARY_BLUE,
    }
});

export default Carrinho