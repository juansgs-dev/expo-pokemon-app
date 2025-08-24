import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface PurchaseSummaryProps {
  totalPokemons: number;
  uniqueSpecies: number;
  totalPrice: number;
  onPurchase: () => void;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({
  totalPokemons,
  uniqueSpecies,
  totalPrice,
  onPurchase,
}) => {
  return (
    <View style={styles.purchaseSummary}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Pokémon totales:</Text>
        <Text style={styles.summaryValue}>{totalPokemons}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Especies únicas:</Text>
        <Text style={styles.summaryValue}>{uniqueSpecies}</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Precio total:</Text>
        <Text style={styles.totalPrice}>${totalPrice}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.purchaseButton}
        onPress={onPurchase}
      >
        <Text style={styles.purchaseButtonText}>FINALIZAR COMPRA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  purchaseSummary: {
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#e4000f',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  summaryValue: {
    color: '#ffcb05',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e4000f',
    marginVertical: 10,
  },
  totalLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalPrice: {
    color: '#4cd964',
    fontWeight: 'bold',
    fontSize: 20,
  },
  purchaseButton: {
    backgroundColor: '#e4000f',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

export default PurchaseSummary;