import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, TextInput, Button, Card } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import * as Theme from '../../Theme';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAPI } from '../../Context/APIContext';
import { useNavigation } from '@react-navigation/native';

function SettingsScreen(props) {
  const [isEditable, setIsEditable] = useState(false);
  const { control, handleSubmit, setValue } = useForm();
  const {Logout}=useAPI();
  const initialData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: '',
    phone: '1234567890',
    address: '123 Street, City, Country',
  };
  const onSubmit = (data) => {
    console.log('Updated Data:', data);
    setIsEditable(false); // Switch to read-only after submit
  };

  return (
    <>
      <Appbar.Header style={styles.appbar}>
        <View style={styles.appbarLeft}>
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        </View>
        <Text style={styles.appbarTitle}>Settings</Text>
        <TouchableOpacity onPress={onPress=async() =>await Logout()} >
          <Icon name="logout" size={24} style={styles.logoutIcon} />
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView style={styles.wrapper}>
        <View style={styles.topBanner}>
          <Text style={styles.bannerText}>Manage your account settings</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="First Name"
              value={initialData.firstName}
              editable={isEditable}
              onChangeText={(text) => setValue('firstName', text)}
              style={styles.input}
            />
            <TextInput
              label="Last Name"
              value={initialData.lastName}
              editable={isEditable}
              onChangeText={(text) => setValue('lastName', text)}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={initialData.email}
              editable={isEditable}
              onChangeText={(text) => setValue('email', text)}
              style={styles.input}
            />
            <TextInput
              label="Phone"
              value={initialData.phone}
              editable={isEditable}
              onChangeText={(text) => setValue('phone', text)}
              style={styles.input}
            />
            <TextInput
              label="Address"
              value={initialData.address}
              editable={isEditable}
              onChangeText={(text) => setValue('address', text)}
              style={styles.input}
            />
            {isEditable && (
              <TextInput
                label="Password"
                value={initialData.password}
                editable={isEditable}
                onChangeText={(text) => setValue('password', text)}
                style={styles.input}
                secureTextEntry
              />
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        >
          {isEditable ? 'Submit' : 'Edit Data'}
        </Button>

        <Button
          mode="outlined"
          style={styles.editButton}
          onPress={() => setIsEditable(!isEditable)}
        >
          {isEditable ? 'Cancel' : 'Edit Data'}
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  appbar: {
    backgroundColor: 'white',
    elevation: 10,
    flexDirection: 'row', // Use row layout to place icons and text in one line
    justifyContent: 'space-between', // Spread out the elements (icon on left, title in center, logout icon on right)
    alignItems: 'center', // Vertically center the items
    paddingHorizontal: 20,
  },
  appbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  logoutIcon: {
    color: Theme.colors.blue,
    marginLeft: 10,
  },
  topBanner: {
    padding: 20,
    backgroundColor: Theme.colors.blue,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 20,
  },
  bannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    margin: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 5,
    padding: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
  },
  submitButton: {
    margin: 20,
    borderRadius: 8,
  },
  editButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 8,
  },
});

export default SettingsScreen;
