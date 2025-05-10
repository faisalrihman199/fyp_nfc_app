import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAPI } from "../../Context/APIContext";

const OTPScreen = ({ route }) => {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [countdown, setCountdown] = useState(30);
    const navigation = useNavigation();
    let { state } = route.params;
    const isSignup = state?.firstName;
    const { sendOTP,verifyOTP } = useAPI();

    // Create refs for OTP input fields
    const otpRefs = useRef([]);
    otpRefs.current = Array(6).fill().map((_, i) => otpRefs.current[i] ?? React.createRef());

    useEffect(() => {
        const interval = setInterval(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown]);

    const handleVerifyOTP = async () => {
            state.otp=otp.join("");
            setLoading(true);
            const endPoint=isSignup?'register':'forgotPassword';
            verifyOTP(state, endPoint)
            .then((res)=>{
                if(res.success){
                    Alert.alert("Success",res.message);
                    navigation.navigate("Login");
                }
                else{
                    Alert.alert("Error",res.message);
                }
            })
            .catch((err)=>{
                console.log(err);
                Alert.alert("Error",(err?.response?.data?.message || "Registration Failed"));
                
            })
            .finally(()=>{
                setLoading(false);
            })
            
        
    };

    const handleChangeOtp = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move focus to the next input if text is entered
        if (text && index < otp.length - 1) {
            otpRefs.current[index + 1].current.focus();
        }

        // Move focus to the previous input if text is deleted
        if (!text && index > 0) {
            otpRefs.current[index - 1].current.focus();
        }
    };

    const handleResendOTP = () => {
        if (countdown === 0) {
            setLoading(true);
            sendOTP({ email: state?.email })
                .then((res) => {
                    if (res.success) {
                        Alert.alert("Success", res.message);
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
                    setCountdown(30);
                })
            
        } else {
            Alert.alert("Wait", `Please wait ${countdown} seconds before resending OTP.`);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>
                    Please enter the 6-digit OTP sent to your email 
                    <Text style={{ fontWeight: 'bold' }}>
                        {` ${state?.email}`}
                    
                    </Text>
                </Text>
                {/* OTP Input Fields */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.otpInput}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChangeOtp(text, index)}
                            ref={otpRefs.current[index]}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    style={[styles.verifyButton, loading && styles.disabledButton]}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.verifyButtonText}>Verify OTP</Text>
                    )}
                </TouchableOpacity>

                {/* Resend OTP and Go Back Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={handleResendOTP}>
                        <Text style={styles.resendText}>
                            {countdown === 0 ? "Resend OTP" : `Resend OTP in ${countdown}s`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleGoBack}>
                        <Text style={styles.goBackText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#87CEEB",
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
        elevation: 5,
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
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#ddd",
        fontSize: 24,
        textAlign: "center",
        color: "#333",
    },
    verifyButton: {
        backgroundColor: "#66c6ed",
        paddingVertical: 15,
        marginVertical: 20,
        borderRadius: 5,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc",
    },
    verifyButtonText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    resendText: {
        fontSize: 14,
        color: "#66c6ed",
    },
    goBackText: {
        fontSize: 14,
        color: "#66c6ed",
    },
});

export default OTPScreen;
