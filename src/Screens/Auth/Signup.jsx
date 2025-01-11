import React, { useState } from "react";
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
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAPI } from "../../Context/APIContext";
import { useForm, Controller } from "react-hook-form";
import Icon from "react-native-vector-icons/FontAwesome";

const SignupScreen = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation();
    const { sendOTP } = useAPI();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
        setValue,
    } = useForm();

    const handleSignup = async (data) => {
        console.log("Data is :", data);
        setLoading(true);
        sendOTP({ email: data.email })
            .then((res) => {
                if (res.success) {
                    delete data.confirmPassword;
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View>
                        {/* App Logo */}
                        <Image
                            source={require("../../../images/nfc-rewriter-icon.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join us and make Safety True with Secure NFC Shield
                        </Text>

                        {/* First Row: First Name */}
                        <View style={styles.inputContainer}>
                            <Icon name="user" size={20} color="#333" style={styles.icon} />
                            <Controller
                                control={control}
                                rules={{ required: "First name is required" }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="First Name"
                                        placeholderTextColor="#777"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                                name="firstName"
                            />
                            {errors.firstName && (
                                <Text style={styles.errorText}>{errors.firstName.message}</Text>
                            )}
                        </View>

                        {/* Second Row: Last Name */}
                        <View style={styles.inputContainer}>
                            <Icon name="user" size={20} color="#333" style={styles.icon} />
                            <Controller
                                control={control}
                                rules={{ required: "Last name is required" }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Last Name"
                                        placeholderTextColor="#777"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                                name="lastName"
                            />
                            {errors.lastName && (
                                <Text style={styles.errorText}>{errors.lastName.message}</Text>
                            )}
                        </View>

                        {/* Third Row: Email */}
                        <View style={styles.inputContainer}>
                            <Icon name="envelope" size={20} color="#333" style={styles.icon} />
                            <Controller
                                control={control}
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                        message: "Enter a valid email",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#777"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                                name="email"
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}
                        </View>

                        {/* Fourth Row: Phone */}
                        <View style={styles.inputContainer}>
                            <Icon name="phone" size={20} color="#333" style={styles.icon} />
                            <Controller
                                control={control}
                                rules={{
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Enter a valid phone number",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Phone"
                                        placeholderTextColor="#777"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                                name="phone"
                            />
                            {errors.phone && (
                                <Text style={styles.errorText}>{errors.phone.message}</Text>
                            )}
                        </View>

                        {/* Fifth Row: Password */}
                        <View style={styles.inputContainer}>
                            <Icon name="lock" size={20} color="#333" style={styles.icon} />
                            <Controller
                                control={control}
                                rules={{ required: "Password is required" }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#777"
                                        secureTextEntry={!showPassword}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                                name="password"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Icon
                                    name={showPassword ? "eye-slash" : "eye"}
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>
                            {errors.password && (
                                <Text style={styles.errorText}>{errors.password.message}</Text>
                            )}
                        </View>

                        {/* Sixth Row: Confirm Password */}
                        <View style={styles.inputContainer}>
                            <Icon name="lock" size={20} color="#333" style={styles.icon} />
                            <Controller
                                control={control}
                                rules={{
                                    required: "Confirm Password is required",

                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#777"
                                        secureTextEntry={!showConfirmPassword}
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                                name="confirmPassword"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Icon
                                    name={showConfirmPassword ? "eye-slash" : "eye"}
                                    size={20}
                                    color="#333"
                                />
                            </TouchableOpacity>
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="home" size={20} color="#333" style={styles.icon} />
                            <Controller
                                control={control}
                                
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Address"
                                        placeholderTextColor="#777"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                )}
                                name="address"
                            />
                            
                        </View>

                        {/* Signup Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.disabledButton]}
                            onPress={handleSubmit(handleSignup)}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.registerButton}> Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#87CEEB", // Sky Blue color
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 40, // Extra padding at the bottom for scrolling
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        marginTop: "10%",
        padding: 25,
        borderRadius: 20,
        elevation: 5, // Optional: Add shadow for elevation effect
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
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#777",
        marginBottom: 25,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 5,
        marginBottom: 18,
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
        position: "absolute",
        right: 10,
        top: 15,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
    },
    loginButton: {
        backgroundColor: "#66c6ed",
        paddingVertical: 15,
        marginVertical: 20,
        borderRadius: 5,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    registerText: {
        fontSize: 14,
        color: "#777",
    },
    registerButton: {
        fontSize: 14,
        color: "#66c6ed",
        fontWeight: "700",
    },
});

export default SignupScreen;
