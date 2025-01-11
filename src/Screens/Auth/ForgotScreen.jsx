import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAPI } from "../../Context/APIContext";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome icons
import { useForm, Controller } from "react-hook-form"; // Import react-hook-form

const ForgotScreen = () => {
  const navigation = useNavigation();
  const { sendOTP } = useAPI();
  
  // useForm hook
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false); // Manage show/hide state for password fields
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false); // Manage show/hide for confirm password field

  const onSubmit = async (data) => {
    const { email, newPassword, confirmNewPassword } = data;
   

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    setLoading(true);
    sendOTP({ email: data.email })
    .then((res) => {
        if (res.success) {
                    delete data.confirmNewPassword;
                    navigation.navigate('OTPScreen', { state: data });
                }
                else {
                    Alert.alert("Error", res.message);
                }
            })
            .catch((err) => {
                console.log("Error :", err);
                Alert.alert("Error", (err.response.data.message || "Failed to send OTP"))
            })
            .finally(() => {
                setLoading(false);
            })
    

    
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* App Logo */}
        <Image
          source={require("../../../images/nfc-rewriter-icon.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Reset Your Password</Text>

        {/* Email Input with Icon */}
        <View style={styles.inputContainer}>
          <Icon name="envelope" size={20} color="#777" style={styles.icon} />
          <Controller
            control={control}
            name="email"
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            }}
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

        {/* New Password Input with Icon */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#777" style={styles.icon} />
          <Controller
            control={control}
            name="newPassword"
            defaultValue=""
            rules={{ required: "New password is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#777"
                secureTextEntry={!showPassword} // Toggle password visibility
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye" : "eye-slash"}
              size={20}
              color="#777"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

        {/* Confirm New Password Input with Icon */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#777" style={styles.icon} />
          <Controller
            control={control}
            name="confirmNewPassword"
            defaultValue=""
            rules={{
              required: "Confirm password is required",
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#777"
                secureTextEntry={!showConfirmPassword} // Toggle password visibility
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon
              name={showConfirmPassword ? "eye" : "eye-slash"}
              size={20}
              color="#777"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmNewPassword && <Text style={styles.errorText}>{errors.confirmNewPassword.message}</Text>}

        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.resetButton, loading && styles.disabledButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.resetButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Link */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backToLogin}>Back to Login</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: "10%",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  resetButton: {
    backgroundColor: "#66c6ed",
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
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backToLogin: {
    color: "#66c6ed",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default ForgotScreen;
