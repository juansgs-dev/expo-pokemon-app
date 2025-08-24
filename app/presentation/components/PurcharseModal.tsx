import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export type ModalType = 'confirm' | 'success' | 'empty';

interface PurchaseModalProps {
    type: ModalType;
    totalPokemons?: number;
    uniqueSpecies?: number;
    totalPrice?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
    visible: boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
    type,
    totalPokemons = 0,
    uniqueSpecies = 0,
    totalPrice = 0,
    onConfirm,
    onCancel,
    onClose,
    visible,
}) => {
    if (!visible) return null;

    const renderContent = () => {
        switch (type) {
            case 'confirm':
                return (
                    <>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Confirmar Compra</Text>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                ¿Estás seguro de que quieres comprar?
                            </Text>

                            <View style={styles.purchaseDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Pokémon totales:</Text>
                                    <Text style={styles.detailValue}>{totalPokemons}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Especies únicas:</Text>
                                    <Text style={styles.detailValue}>{uniqueSpecies}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Precio total:</Text>
                                    <Text style={styles.totalValue}>${totalPrice}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={onCancel}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={onConfirm}
                            >
                                <Text style={styles.confirmButtonText}>¡Comprar!</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                );

            case 'success':
                return (
                    <>
                        <View style={[styles.modalHeader, styles.successHeader]}>
                            <Text style={styles.modalTitle}>¡Compra Exitosa!</Text>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.successText}>¡Felicidades entrenador!</Text>

                            <View style={styles.successDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Pokémon adquiridos:</Text>
                                    <Text style={styles.detailValue}>{totalPokemons}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Especies únicas:</Text>
                                    <Text style={styles.detailValue}>{uniqueSpecies}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total invertido:</Text>
                                    <Text style={styles.totalValue}>${totalPrice}</Text>
                                </View>
                            </View>

                            <Text style={styles.congratsText}>¡Tus nuevos Pokémon te esperan!</Text>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.successButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.successButtonText}>¡Genial!</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                );

            case 'empty':
                return (
                    <>
                        <View style={[styles.modalHeader, styles.emptyHeader]}>
                            <Text style={styles.modalTitle}>Pokédex Vacía</Text>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                No hay Pokémon para comprar
                            </Text>
                            <Text style={styles.emptyText}>
                                ¡Ve a capturar algunos primero!
                            </Text>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.emptyButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.emptyButtonText}>¡Entendido!</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                );
        }
    };

    return (
        <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
                {renderContent()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#e4000f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    modalHeader: {
        backgroundColor: '#e4000f',
        padding: 20,
        alignItems: 'center',
    },
    successHeader: {
        backgroundColor: '#4cd964',
    },
    emptyHeader: {
        backgroundColor: '#ff9500',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBody: {
        padding: 25,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c2c2c',
        textAlign: 'center',
        marginBottom: 15,
    },
    purchaseDetails: {
        width: '100%',
        marginVertical: 15,
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    successDetails: {
        width: '100%',
        marginVertical: 15,
        padding: 15,
        backgroundColor: '#f0fff4',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#4cd964',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    detailLabel: {
        fontSize: 16,
        color: '#2c2c2c',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        color: '#2c2c2c',
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        color: '#e4000f',
        fontWeight: 'bold',
    },
    warningText: {
        fontSize: 14,
        color: '#ff3b30',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    successText: {
        fontSize: 18,
        color: '#4cd964',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    congratsText: {
        fontSize: 16,
        color: '#2c2c2c',
        textAlign: 'center',
        marginTop: 15,
        fontWeight: '500',
    },
    emptyText: {
        fontSize: 16,
        color: '#ff9500',
        textAlign: 'center',
        fontWeight: '500',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        paddingTop: 10,
        backgroundColor: '#f8f8f8',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    cancelButton: {
        backgroundColor: '#8e8e93',
    },
    confirmButton: {
        backgroundColor: '#4cd964',
    },
    successButton: {
        backgroundColor: '#007aff',
    },
    emptyButton: {
        backgroundColor: '#ff9500',
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    successButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PurchaseModal;