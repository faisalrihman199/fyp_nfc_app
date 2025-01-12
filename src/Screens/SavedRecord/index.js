import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { Linking } from 'react-native';
import { useAPI } from '../../Context/APIContext';

function SavedRecordScreen(props) {
  const { getTags, updateTag, getUser } = useAPI();
  const localUser = getUser()?._j;
  const initialStatus = localUser?.role === 'admin' ? 'pending' : 'active';
  const [selectedStatus, setSelectedStatus] = React.useState(initialStatus);
  const [records, setRecords] = React.useState([]);
  const [categoryMap, setCategoryMap] = useState({});  // Track selected category for each record
  const [change, setChange] = useState(false);

  React.useEffect(() => {
    getTags(selectedStatus)
      .then((res) => {
        console.log("Response is:", res);
        setRecords(res?.data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, [selectedStatus, change]);

  const handlePrint = async (tagNumber) => {
    console.log("Tag is:", tagNumber);

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${tagNumber}`;

    try {
      // Open the QR code in the browser
      await Linking.openURL(qrCodeUrl);
    } catch (error) {
      console.error("Print failed:", error);
    }
  };

  const handlePrinted = (id) => {
    // Your printed logic here
    console.log("Categories :", categoryMap);
    const category = categoryMap[id] || null; 
    const data = {
      status: "waiting",
      category:category,
      id
    }
    updateTag(data)
    .then((res)=>{
      console.log("Response :", res);
      setChange(!change);
    })
    .catch((err)=>{
      console.log("Error :", err);
    })
    
  };

  const handleCategoryChange = (recordId, newCategory) => {
    setCategoryMap((prevMap) => ({
      ...prevMap,
      [recordId]: newCategory,  // Update category for the specific record
    }));
  };

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Text style={styles.headerTitle}>COLLECTED TAGS</Text>
      </Appbar.Header>
      <SafeAreaView style={styles.container}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.statusPicker}
          >
            <Picker.Item label="Select Status" value="" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Waiting" value="waiting" />
            <Picker.Item label="Active" value="active" />
            <Picker.Item label="Inactive" value="inactive" />
          </Picker>
        </View>
        {records.length > 0 ? (
          <ScrollView>
            {records.map((record) => (
              <Card key={record.id} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <MaterialCommunityIcons
                    name="nfc"
                    size={40}
                    color="#6200EE"
                    style={styles.nfcIcon}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.tagNumber}>{record.uid}</Text>
                    <Picker
                      selectedValue={categoryMap[record.id] || null}  // Use categoryMap to get individual record category
                      onValueChange={(itemValue) => handleCategoryChange(record.id, itemValue)}  // Update only for the specific record
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Category" value={null} />
                      <Picker.Item label="Baby" value="baby" />
                      <Picker.Item label="SOS" value="sos" />
                      <Picker.Item label="Information" value="info" />
                    </Picker>
                    <View style={styles.buttonRow}>
                      <Button
                        mode="contained"
                        onPress={() => handlePrint(record.uid)}
                        style={styles.printButton}
                        icon="printer"
                      >
                        Print QR
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => handlePrinted(record.id)}
                        style={styles.printedButton}
                        icon="check"
                      >
                        Printed
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        ) : (
          <Text>No Record Found for this Status</Text>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    elevation: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  statusPicker: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    height: 40,
  },
  card: {
    margin: 15,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  nfcIcon: {
    marginRight: 15,
    backgroundColor: '#EDE7F6',
    borderRadius: 10,
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  tagNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  picker: {
    marginTop: 5,
    width: '100%',
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderColor: '#CCC',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  printButton: {
    borderRadius: 10,
    marginRight: 10,
  },
  printedButton: {
    borderRadius: 10,
    backgroundColor: '#4CAF50', // Green when enabled
  },
});

export default SavedRecordScreen;
