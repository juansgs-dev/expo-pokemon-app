import typeColors from "@/app/helpers/colorTypes";
import React, { FC, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PurchaseModal, { ModalType } from "../components/PurcharseModal";
import PurchaseSummary from "../components/PurchaseSummary";
import {
  addToPokedex,
  clearPokedex,
  removeFromPokedex,
  selectPokedexItems,
  selectTotalPokemons
} from "../store/pokemonSlice";

const { width } = Dimensions.get('window');

const calculateTotalPrice = (pokedexItems: any[]) => {
  return pokedexItems.reduce((total, item) => {
    return total + (item.pokemon.price * item.quantity);
  }, 0);
};

const PokedexScreen: FC = () => {
  const dispatch = useDispatch();
  const pokedexItems = useSelector(selectPokedexItems);
  const totalPokemons = useSelector(selectTotalPokemons);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [modalType, setModalType] = useState<ModalType>('empty');
  const [showModal, setShowModal] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const totalPrice = calculateTotalPrice(pokedexItems);

  useEffect(() => {
    if (pokedexItems.length > 0 && currentIndex >= pokedexItems.length) {
      setCurrentIndex(Math.max(0, pokedexItems.length - 1));
    }
  }, [pokedexItems.length, currentIndex]);

  useEffect(() => {
    if (pokedexItems.length > 0) {
      const timer = setTimeout(() => {
        setIsPoweredOn(true);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }).start();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pokedexItems]);

  const currentPokedexItem = pokedexItems[currentIndex];
  const currentPokemon = currentPokedexItem?.pokemon;
  const currentQuantity = currentPokedexItem?.quantity || 0;

  const stats = currentPokemon ? {
    hp: currentPokemon.hp || 0,
    attack: currentPokemon.attack || 0,
    defense: currentPokemon.defense || 0,
    speed: currentPokemon.speed || 0,
    price: currentPokemon.price || 0,
  } : null;

  const prevPokemon = () => {
    if (currentIndex > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
          delay: 100,
        })
      ]).start()

      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextPokemon = () => {
    if (currentIndex < pokedexItems.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
          delay: 100,
        })
      ]).start()

      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAddPokemon = () => {
    if (currentPokemon) {
      dispatch(addToPokedex(currentPokemon));
    }
  };

  const handleRemovePokemon = () => {
    if (currentPokemon && currentQuantity > 0) {
      dispatch(removeFromPokedex(currentPokemon.id));

      if (currentQuantity === 1 && pokedexItems.length > 1) {
        setTimeout(() => {
          if (currentIndex >= pokedexItems.length - 1) {
            setCurrentIndex(Math.max(0, pokedexItems.length - 2));
          }
        }, 100);
      }
    }
  };

  const toggleDisplay = () => {
    setShowStats(!showStats);
  };

  const handleFinalizePurchase = () => {
    if (pokedexItems.length === 0) {
      setModalType('empty');
      setShowModal(true);
      return;
    }
    setModalType('confirm');
    setShowModal(true);
  };

const handleConfirmPurchase = () => {
  setShowModal(false);
  
  setModalType('success');
  setShowModal(true);
};

const handleSuccessModalClose = () => {
  setShowModal(false);

  dispatch(clearPokedex());
};

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (pokedexItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyPokedex}>
          <Text style={styles.emptyText}>No hay Pokémon en tu Pokédex</Text>
          <Text style={styles.emptySubtext}>Captura algunos Pokémon primero</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentPokemon && pokedexItems.length > 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyPokedex}>
          <Text style={styles.emptyText}>Error cargando Pokémon</Text>
          <TouchableOpacity onPress={() => setCurrentIndex(0)}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isPoweredOn && (
        <View style={styles.powerEffect}>
          <Text style={styles.powerText}>¡POKÉDEX!</Text>
        </View>
      )}

      <Animated.View style={[styles.pokedexContainer, { opacity: fadeAnim }]}>

        <View style={styles.pokedexTop}>
          <View style={styles.lightsContainer}>
            <View style={[styles.light, styles.bigLight, styles.redLight]} />
            <View style={styles.smallLights}>
              <View style={[styles.light, styles.smallLight,
              { backgroundColor: pokedexItems.length > 0 ? '#ffff00' : '#888' }]} />
              <View style={[styles.light, styles.smallLight,
              { backgroundColor: currentIndex < pokedexItems.length - 1 ? '#00ff00' : '#888' }]} />
            </View>
          </View>

          <View style={styles.screenBorder}>
            <View style={styles.screen}>
              <View style={styles.pokemonInfo}>
                <Text style={styles.pokemonId}>#{currentPokemon.id}</Text>
                <Text style={styles.pokemonName}>{currentPokemon.name}</Text>

                <View style={styles.typesContainer}>
                  {currentPokemon.types.map((type: string) => (
                    <View key={type} style={[styles.typeBadge,
                    { backgroundColor: typeColors[type] || "#777" }]}>
                      <Text style={styles.typeText}>{type}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.captureInfo}>
                  <Text style={styles.captureText}>
                    Capturados: {currentQuantity}
                  </Text>
                </View>
              </View>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: currentPokemon.image }}
                  style={styles.pokemonImage}
                  onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.hinge} />

        <View style={styles.pokedexBottom}>
          <View style={styles.controlPanel}>
            <View style={styles.secondaryScreen}>
              <TouchableOpacity onPress={toggleDisplay} style={styles.screenToggle}>
                <Text style={styles.statsText}>
                  {showStats ? 'STATS' : 'PRECIO'}
                </Text>
              </TouchableOpacity>

              {showStats ? (
                <View style={styles.statsContainer}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>HP</Text>
                    <View style={styles.statBarContainer}>
                      <View style={[styles.statBar, { width: `${(stats?.hp || 0) / 150 * 100}%` }]} />
                    </View>
                    <Text style={styles.statValue}>{stats?.hp}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>ATK</Text>
                    <View style={styles.statBarContainer}>
                      <View style={[styles.statBar, { width: `${(stats?.attack || 0) / 150 * 100}%` }]} />
                    </View>
                    <Text style={styles.statValue}>{stats?.attack}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>DEF</Text>
                    <View style={styles.statBarContainer}>
                      <View style={[styles.statBar, { width: `${(stats?.defense || 0) / 150 * 100}%` }]} />
                    </View>
                    <Text style={styles.statValue}>{stats?.defense}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>SPD</Text>
                    <View style={styles.statBarContainer}>
                      <View style={[styles.statBar, { width: `${(stats?.speed || 0) / 150 * 100}%` }]} />
                    </View>
                    <Text style={styles.statValue}>{stats?.speed}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.priceContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Precio c/u:</Text>
                    <Text style={styles.priceValue}>${stats?.price}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Cantidad:</Text>
                    <Text style={styles.priceValue}>{currentQuantity}</Text>
                  </View>
                  <View style={styles.priceDivider} />
                  <View style={styles.priceRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>
                      ${(stats?.price || 0) * currentQuantity}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.buttonsContainer}>
              <View style={styles.dPadContainer}>
                <TouchableOpacity onPress={prevPokemon} disabled={currentIndex === 0}>
                  <View style={styles.dPad}>
                    <View style={styles.dPadVertical} />
                    <View style={styles.dPadHorizontal} />
                    <View style={styles.dPadCenter} />
                  </View>
                </TouchableOpacity>
                <Text style={styles.dPadLabel}>NAVEGAR</Text>

                <View style={styles.navIndicators}>
                  <TouchableOpacity onPress={prevPokemon} disabled={currentIndex === 0}>
                    <Text style={[styles.navArrow, currentIndex === 0 && styles.navArrowDisabled]}>◀</Text>
                  </TouchableOpacity>
                  <Text style={styles.navText}>{currentIndex + 1}/{pokedexItems.length}</Text>
                  <TouchableOpacity onPress={nextPokemon} disabled={currentIndex === pokedexItems.length - 1}>
                    <Text style={[styles.navArrow, currentIndex === pokedexItems.length - 1 && styles.navArrowDisabled]}>▶</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={handleRemovePokemon}
                  disabled={currentQuantity === 0}>
                  <View style={[styles.button, styles.smallButton, styles.blueButton,
                  currentQuantity === 0 && styles.buttonDisabled]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddPokemon}>
                  <View style={[styles.button, styles.bigButton, styles.redButton]} />
                </TouchableOpacity>
                <Text style={styles.buttonLabel}>ACCIONES</Text>

                <View style={styles.actionInfo}>
                  <Text style={styles.actionText}>- Liberar</Text>
                  <Text style={styles.actionText}>+ Capturar</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      <PurchaseSummary
        totalPokemons={totalPokemons}
        uniqueSpecies={pokedexItems.length}
        totalPrice={totalPrice}
        onPurchase={handleFinalizePurchase}
      />

      <PurchaseModal
        type={modalType}
        totalPokemons={totalPokemons}
        uniqueSpecies={pokedexItems.length}
        totalPrice={totalPrice}
        onConfirm={handleConfirmPurchase}
        onCancel={handleCloseModal}
        onClose={handleSuccessModalClose}
        visible={showModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 14,
    paddingTop: 30,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  pokedexContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: '#e4000f',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  pokedexTop: {
    padding: 15,
    paddingBottom: 10,
  },
  lightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  light: {
    borderRadius: 50,
  },
  bigLight: {
    width: 30,
    height: 30,
  },
  smallLights: {
    flexDirection: 'row',
  },
  smallLight: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  redLight: {
    backgroundColor: '#ff5a5a',
    borderWidth: 2,
    borderColor: '#ff2a2a',
  },
  screenBorder: {
    backgroundColor: '#3a3a3a',
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#2a2a2a',
  },
  screen: {
    backgroundColor: '#88c9e6',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pokemonInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  pokemonId: {
    color: "#3a3a3a",
    fontWeight: "700",
    fontSize: 14,
  },
  pokemonName: {
    color: "#3a3a3a",
    fontWeight: "900",
    fontSize: 20,
    textTransform: "capitalize",
    marginTop: 5,
  },
  typesContainer: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  typeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    textTransform: "capitalize",
  },
  captureInfo: {
    marginTop: 10,
  },
  captureText: {
    color: '#3a3a3a',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  pokemonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  hinge: {
    height: 10,
    backgroundColor: '#3a3a3a',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#1a1a1a',
  },
  pokedexBottom: {
    backgroundColor: '#e4000f',
    padding: 20,
    paddingTop: 10,
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryScreen: {
    flex: 1,
    backgroundColor: '#9ead86',
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#2a2a2a',
    minHeight: 150,
  },
  screenToggle: {
    alignItems: 'center',
    marginBottom: 5,
  },
  statsText: {
    color: '#2a2a2a',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statLabel: {
    color: '#2a2a2a',
    fontWeight: 'bold',
    fontSize: 10,
    width: 30,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    backgroundColor: '#4cd964',
    borderRadius: 4,
  },
  statValue: {
    color: '#2a2a2a',
    fontWeight: 'bold',
    fontSize: 10,
    width: 25,
    textAlign: 'right',
  },
  priceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceLabel: {
    color: '#2a2a2a',
    fontWeight: 'bold',
    fontSize: 10,
  },
  priceValue: {
    color: '#2a2a2a',
    fontWeight: 'bold',
    fontSize: 12,
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#2a2a2a',
    marginVertical: 5,
  },
  totalLabel: {
    color: '#2a2a2a',
    fontWeight: 'bold',
    fontSize: 12,
  },
  totalValue: {
    color: '#2a2a2a',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dPadContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  dPad: {
    width: 80,
    height: 80,
    backgroundColor: '#3a3a3a',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  dPadVertical: {
    position: 'absolute',
    width: 30,
    height: 70,
    backgroundColor: '#5a5a5a',
    borderRadius: 10,
  },
  dPadHorizontal: {
    position: 'absolute',
    width: 70,
    height: 30,
    backgroundColor: '#5a5a5a',
    borderRadius: 10,
  },
  dPadCenter: {
    width: 20,
    height: 20,
    backgroundColor: '#7a7a7a',
    borderRadius: 10,
    zIndex: 2,
  },
  dPadLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  navIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  navArrowDisabled: {
    color: '#888',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButtons: {
    alignItems: 'center',
  },
  button: {
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  smallButton: {
    width: 30,
    height: 30,
  },
  bigButton: {
    width: 50,
    height: 50,
  },
  blueButton: {
    backgroundColor: '#007aff',
    borderWidth: 2,
    borderColor: '#0055cc',
  },
  redButton: {
    backgroundColor: '#ff3b30',
    borderWidth: 2,
    borderColor: '#cc3026',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionInfo: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  powerEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ff0000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  powerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  emptyPokedex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  retryText: {
    color: '#007aff',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default PokedexScreen;