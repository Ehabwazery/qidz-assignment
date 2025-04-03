import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react';
import { useStore } from '../src/context/StoreContext';
import { Ionicons } from '@expo/vector-icons';
import theme from '../src/theme';

const LoginScreen = observer(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { authStore } = useStore();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const success = await authStore.login(username, password);
      if (success) {
        router.replace('/dashboard');
      } else {
        setError('Invalid credentials. Hint: use ivaldi/testtest');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.palette.white} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/react-logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.appName}>Movie Explorer</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={theme.palette.mediumGray} />
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              placeholderTextColor={theme.palette.mediumGray}
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.palette.mediumGray} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.input}
              placeholderTextColor={theme.palette.mediumGray}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={theme.palette.mediumGray} 
              />
            </TouchableOpacity>
          </View>
          
          {error ? <Text style={styles.error}>{error}</Text> : null}
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.palette.white} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.hint}>
            Hint: Use username "ivaldi" and password "testtest" to login
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginTop: theme.spacing.sm,
    color: theme.palette.primary,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    color: theme.palette.text.primary.light,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.palette.text.secondary.light,
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.lightGray,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.palette.text.primary.light,
  },
  error: {
    color: theme.palette.error,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.sm,
  },
  loginButton: {
    backgroundColor: theme.palette.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  loginButtonText: {
    color: theme.palette.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
    fontSize: theme.typography.fontSize.sm,
    color: theme.palette.text.secondary.light,
  },
});

export default LoginScreen;
