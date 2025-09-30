import { BorderRadius, Colors, Shadows } from '@/constants/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
  onVoicePress?: () => void;
  showVoice?: boolean;
  onVoiceResult?: (text: string) => void;
}

export function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Buscar produtos...", 
  onFilterPress,
  showFilter = false,
  onVoicePress,
  showVoice = false,
  onVoiceResult
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [voiceAnimatedValue] = useState(new Animated.Value(0));
  const [pulseAnimatedValue] = useState(new Animated.Value(1));
  const pulseAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const clearSearch = () => {
    onChangeText('');
  };

  // Animação de pulso para o botão de voz
  const startPulseAnimation = () => {
    pulseAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimatedValue, {
          toValue: 1.15,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimatedValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.current.start();
  };

  const stopPulseAnimation = () => {
    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
    }
    pulseAnimatedValue.setValue(1);
  };

  // Simulação de reconhecimento de voz
  const simulateVoiceRecognition = () => {
    const phrases = [
      "tijolo ecológico",
      "vaso decorativo",
      "kit sustentabilidade",
      "produtos reciclados",
      "materiais ecológicos"
    ];
    
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Simula o tempo de processamento
    setTimeout(() => {
      setIsListening(false);
      stopPulseAnimation();
      onChangeText(randomPhrase);
      onVoiceResult?.(randomPhrase);
      
      Alert.alert(
        '🎤 Voz Reconhecida!',
        `"${randomPhrase}" foi adicionado à busca.`,
        [{ text: 'OK', style: 'default' }]
      );
    }, 2000);
  };

  const handleVoicePress = () => {
    if (isListening) {
      // Parar gravação
      setIsListening(false);
      stopPulseAnimation();
      onVoicePress?.();
    } else {
      // Iniciar gravação
      setIsListening(true);
      startPulseAnimation();
      
      // Animar o botão de voz
      Animated.timing(voiceAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      
      // Simular reconhecimento de voz
      simulateVoiceRecognition();
    }
  };

  // Limpar animações quando o componente for desmontado
  useEffect(() => {
    return () => {
      stopPulseAnimation();
    };
  }, []);

  const animatedStyle = {
    borderColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.border.light, Colors.primary],
    }),
  };

  return (
    <View style={styles.searchContainer}>
      <Animated.View style={[styles.searchBar, animatedStyle]}>
        <View style={styles.searchIconContainer}>
          <MaterialCommunityIcons 
            name="magnify" 
            size={20} 
            color={isFocused ? Colors.primary : Colors.text.secondary} 
          />
        </View>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#6b7280"
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="never"
          multiline={false}
          numberOfLines={1}
        />
        
        <View style={styles.searchActions}>
          {value.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearSearch}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="close-circle" 
                size={18} 
                color={Colors.text.secondary} 
              />
            </TouchableOpacity>
          )}
          
          {showVoice && (
            <Animated.View
              style={[
                styles.voiceButtonContainer,
                {
                  transform: [{ scale: pulseAnimatedValue }],
                }
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.voiceButton,
                  isListening && styles.voiceButtonListening
                ]} 
                onPress={handleVoicePress}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.voiceButtonInner,
                    {
                      transform: [{ scale: voiceAnimatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      })}],
                    }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name={isListening ? "stop" : "microphone"} 
                    size={20} 
                    color={isListening ? Colors.accent : Colors.text.secondary} 
                  />
                </Animated.View>
              </TouchableOpacity>
              
              {isListening && (
                <Animated.View
                  style={[
                    styles.voiceIndicator,
                    {
                      opacity: voiceAnimatedValue,
                    }
                  ]}
                >
                  <Animated.View 
                    style={[
                      styles.voiceIndicatorDot, 
                      styles.voiceIndicatorDot1,
                      {
                        transform: [{
                          scale: pulseAnimatedValue.interpolate({
                            inputRange: [1, 1.15],
                            outputRange: [0.8, 1.2],
                          })
                        }]
                      }
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.voiceIndicatorDot, 
                      styles.voiceIndicatorDot2,
                      {
                        transform: [{
                          scale: pulseAnimatedValue.interpolate({
                            inputRange: [1, 1.15],
                            outputRange: [0.9, 1.1],
                          })
                        }]
                      }
                    ]} 
                  />
                  <Animated.View 
                    style={[
                      styles.voiceIndicatorDot, 
                      styles.voiceIndicatorDot3,
                      {
                        transform: [{
                          scale: pulseAnimatedValue.interpolate({
                            inputRange: [1, 1.15],
                            outputRange: [1, 1.3],
                          })
                        }]
                      }
                    ]} 
                  />
                </Animated.View>
              )}
            </Animated.View>
          )}
        </View>
      </Animated.View>
      
      {showFilter && onFilterPress && (
        <TouchableOpacity 
          style={[styles.filterButton, isFocused && styles.filterButtonActive]} 
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="tune" 
            size={20} 
            color={isFocused ? Colors.primary : Colors.text.secondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    height: 48,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    height: 40,
    paddingVertical: 8,
    textAlignVertical: 'center',
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: 8,
    borderRadius: BorderRadius.sm,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonContainer: {
    position: 'relative',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonListening: {
    backgroundColor: 'transparent',
  },
  voiceButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  voiceIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    flexDirection: 'row',
    gap: 3,
  },
  voiceIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  voiceIndicatorDot1: {
    opacity: 0.6,
  },
  voiceIndicatorDot2: {
    opacity: 0.8,
  },
  voiceIndicatorDot3: {
    opacity: 1,
  },
  filterButton: {
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border.light,
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.light,
  },
  filterButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
});
