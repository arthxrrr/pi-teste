import { Colors, Typography } from '@/constants/Theme';
import { useAuth } from '@/projetointegrador/AuthProvider';
import { DbApi } from '@/projetointegrador/DB';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ContaScreen() {
  const { user, signInWithOtp, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithOtp(email);
      Alert.alert('Verifique seu e-mail', 'Enviamos um link de login.');
    } catch (e: any) {
      Alert.alert('Erro ao enviar login', e.message ?? '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      DbApi.upsertUser({ id: user.id, nome: user.email ?? 'Usuário', email: user.email ?? '' }).catch(() => {});
    }
  }, [user?.id]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} tintColor={Colors.primary} colors={[Colors.primary]} />}
    >
      <Text style={styles.title}>Minha Conta</Text>

      {!user ? (
        <View style={styles.card}>
          <Text style={styles.label}>Entre com seu e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="email@exemplo.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Enviando...' : 'Entrar com e-mail'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.row}><Text style={styles.bold}>ID:</Text> {user.id}</Text>
          <Text style={styles.row}><Text style={styles.bold}>Email:</Text> {user.email}</Text>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#ef4444' }]} onPress={signOut}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text.primary, fontFamily: Typography.fontFamily, marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  label: { color: Colors.text.secondary, marginBottom: 8, fontFamily: Typography.fontFamily },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, color: Colors.text.primary },
  button: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontFamily: Typography.fontFamily },
  row: { color: Colors.text.primary, marginBottom: 8, fontFamily: Typography.fontFamily },
  bold: { fontWeight: '700', color: Colors.text.primary },
});


