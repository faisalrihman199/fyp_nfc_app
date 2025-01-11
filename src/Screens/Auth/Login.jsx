import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAPI } from "../../Context/APIContext";
import { useForm, Controller } from "react-hook-form"; // Import useForm and Controller
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome Icon library

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, getUser } = useAPI();
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();

  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async (data) => {
    if (!data.email || !data.password) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
    setLoading(true);
    console.log("Attempting Login with:", data);

    try {
      const res = await login(data);
      console.log("Login response:", res);
      setLoading(false);
      navigation.navigate("MainTabs");
    } catch (err) {
      console.log("Login error:", err);
      setLoading(false);
      Alert.alert("Login Failed", "Please check your credentials and try again.");
    }
  };

  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.card} showsVerticalScrollIndicator={false}>
        <View>
          {/* App Logo */}
          <Image
            source={require("../../../images/nfc-rewriter-icon.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Make Safety True with Secure NFC Shield</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="#777" style={styles.icon} />
            <Controller
              control={control}
              name="email"
              defaultValue=""
              rules={{ required: "Email is required", pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#777"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#777" style={styles.icon} />
            <Controller
              control={control}
              name="password"
              defaultValue=""
              rules={{ required: "Password is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#777"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Text style={styles.passwordToggleText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={() => navigation.navigate("ForgotScreen")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.disabledButton]}
            onPress={handleSubmit(handleLogin)} // Use handleSubmit for form submission
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.registerButton}> Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB", // Sky Blue color
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: "25%",
    padding: 25,
    borderRadius: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333", // Dark color for the title
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777", // Zinc color for subtitle text
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Zinc color for input field borders
    paddingBottom: 5,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333", // Dark color for input text
    paddingLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  passwordToggle: {
    marginLeft: 10,
  },
  passwordToggleText: {
    color: "#66c6ed", // Blue color for "Show/Hide" text
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#66c6ed", // Blue color for "Forgot Password" link
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#66c6ed", // Blue color for the button
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff", // White color for button text
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  registerText: {
    fontSize: 14,
    color: "#333", // Dark color for the "Don't have an account?" text
  },
  registerButton: {
    fontSize: 14,
    color: "#66c6ed", // Blue color for the "Register" link
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default LoginScreen;
