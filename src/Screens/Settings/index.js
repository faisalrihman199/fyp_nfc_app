import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, TextInput, Button, Card } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import * as Theme from '../../Theme';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAPI } from '../../Context/APIContext';

function SettingsScreen(props) {
  const [isEditable, setIsEditable] = useState(false);
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    },
  });

  const { Logout, userInfo, getUser } = useAPI();
  const localUser = getUser()?._j;
  const isAdmin = localUser?.role === 'admin';

  useEffect(() => {
    userInfo()
      .then((res) => {
        if (res.data) {
          const { firstName, lastName, email, phone, address } = res.data;
          setValue('firstName', firstName || '');
          setValue('lastName', lastName || '');
          setValue('email', email || '');
          setValue('phone', phone || '');
          setValue('address', address || '');
        }
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }, []);

  const onSubmit = (dt) => {
    let data;
    if(isAdmin){
      data={
        email:dt.email,
        password:dt.password,
      }
    }
    else{
      data=dt
    }

    console.log('Updated Data:', data);
    setIsEditable(false); 
  };

  return (
    <>
      <Appbar.Header style={styles.appbar}>
        <View style={styles.appbarLeft}>
          <Appbar.BackAction onPress={() => props.navigation.goBack()} />
        </View>
        <Text style={styles.appbarTitle}>Settings</Text>
        <TouchableOpacity onPress={async () => await Logout()}>
          <Icon name="logout" size={24} style={styles.logoutIcon} />
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView style={styles.wrapper}>
        <View style={styles.topBanner}>
          <Text style={styles.bannerText}>Manage your account settings</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            {!isAdmin && (
              <>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="First Name"
                      value={value}
                      editable={isEditable}
                      onChangeText={onChange}
                      style={styles.input}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Last Name"
                      value={value}
                      editable={isEditable}
                      onChangeText={onChange}
                      style={styles.input}
                    />
                  )}
                />
              </>
            )}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  editable={isEditable}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />

            {!isAdmin && (
              <>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Phone"
                      value={value}
                      editable={isEditable}
                      onChangeText={onChange}
                      style={styles.input}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Address"
                      value={value}
                      editable={isEditable}
                      onChangeText={onChange}
                      style={styles.input}
                    />
                  )}
                />
              </>
            )}

            {(isEditable || isAdmin) && (
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Password"
                    value={value}
                    editable={isEditable}
                    onChangeText={onChange}
                    style={styles.input}
                    secureTextEntry
                  />
                )}
              />
            )}
          </Card.Content>
        </Card>

        {isEditable && (
          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
