import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const APIContext = createContext();

const APIProvider = ({ children }) => {
  const server = 'http://10.171.160.62:3000/api';
  // const server = 'https://wqt6h4bmvc.us-east-1.awsapprunner.com/api';
  console.log("Server is :", server);
  const getUserFromAsyncStorage = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving user from AsyncStorage', error);
      return null;
    }
  };
  const Logout=async()=>{
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error retrieving user from AsyncStorage', error);
    }
  }

  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const storedUser = await getUserFromAsyncStorage();
      console.log("Stord Use in Async Storage is :", storedUser);
      
      setUser(storedUser);
    })();
  }, []);

  const getConfig = () => {
    const token = user?.token;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  const getUser=async()=>{
    return user;
  }
  // Auth APIs
  const login = async (data) => {
    const url = `${server}/auth/login`;
    try {
      const response = await axios.post(url, data);
      console.log("Login API Response:", response.data);
  
      if (response.data && response.data.data) {
        const loggedInUser = response.data.data;
        setUser(loggedInUser);
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
        console.log("User saved to AsyncStorage:", loggedInUser); // Debugging log
      } else {
        console.warn("User data missing in response");
      }
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow to propagate error to UI
    }
  };

  const userInfo=async()=>{
    const url = `${server}/auth/userInfo`;
    const response = await axios.get(url,getConfig());
    return response.data;
  }
  const updateUser=async(data)=>{
    console.log("data is :", data);
    
    const url = `${server}/auth/updateUser`;
    const response = await axios.post(url,data,getConfig());
    return response.data;
  }
  
  const sendOTP=async (data) => {
    console.log("Send OTP for :", data);
    const url = `${server}/otp/send`;
    const response = await axios.post(url, data);
    return response.data;
  };

  

  const changePassword = async (data) => {
    const url = `${server}/user/changePassword`;
    const response = await axios.put(url, data, getConfig());
    return response.data;
  };

  
  //Customer APIs
  //Registeration and Forgot
  const verifyOTP = async (data,endpoint) => {
    const url = `${server}/auth/${endpoint}`;
    const response = await axios.post(url, data);
    return response.data;
  };


  // Tag
  const addTag = async (data) => {
    const url = `${server}/tags/add`;
    const response = await axios.post(url, data, getConfig());
    return response.data;
  };
  const updateTag = async (data) => {
    const url = `${server}/tags/update`;
    const response = await axios.post(url, data, getConfig());
    return response.data;
  };
  const getTags = async (status) => {

    let url = `${server}/tags/all`;
    if(status){
      url+=`?status=${status}`;
    }
    console.log("Url is :", url);
    
    const response = await axios.get(url, getConfig());
    return response.data;
  };
  


  const provider = {
    //Auth
    login,getUser,Logout,changePassword,verifyOTP,sendOTP,userInfo,updateUser,
    
    //Customer
    verifyOTP,
    
    //Tag
    addTag,getTags,updateTag,
    
    server,
  };

  return <APIContext.Provider value={provider}>{children}</APIContext.Provider>;
};

const useAPI = () => useContext(APIContext);

export { APIProvider, useAPI };
