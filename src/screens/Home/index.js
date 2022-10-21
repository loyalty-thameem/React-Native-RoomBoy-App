import { ActivityIndicator, Alert, BackHandler, Button, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DocumentPicker, { types } from 'react-native-document-picker';
import DatePicker from 'react-native-date-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { db } from '../Firebase/firebase-config';
import {
    ref,
    onValue,
    push,
    update,
    remove
} from 'firebase/database';
import LinearGradient from 'react-native-linear-gradient';
const HomeScreen = () => {
    //FILE UPLOAD
    const [fileResponse, setFileResponse] = React.useState([]);
    // console.log('fileresponse',fileResponse)
    const handleDocumentSelection = React.useCallback(async () => {

        try {
            // const response = await DocumentPicker.pick({
            //     presentationStyle: 'fullScreen',
            // });
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                // type: [types.pdf],
                type: [DocumentPicker.types.allFiles],
                allowMultiSelection: true,
            });
            setFileResponse(response);
            setFetchImage(response[0].uri);
        } catch (err) {
            console.warn(err);
        }
    }, []);
    // DATE
    const [date, setDate] = React.useState(new Date())
    console.log('date', date);
    const [open, setOpen] = React.useState(false)

    //TextInput Focus
    const [focus, setFocus] = React.useState({
        style1: false,
        style2: false,
        style3: false,
        style4: false,
        style5: false,
        style6: false,
        style7: false,
    });
    const customStyle1 = !focus.style1 ? styles.nameTextInputContainer : styles.focusContainer;
    // const customStyle2 = !focus.style2 ? styles.rollNoTextInputContainer : styles.focusContainer;
    const customStyle2 = !focus.style2 ? styles.roomNoTextInputContainer : styles.focusContainer;
    const customStyle3 = !focus.style3 ? styles.contactTextInputContainer : styles.focusContainer;
    const customStyle4 = !focus.style4 ? styles.addressTextInputContainer : styles.focusContainer;
    const customStyle5 = !focus.style5 ? styles.advancedAmountTexInputContainer : styles.focusContainer;
    const customStyle6 = !focus.style6 ? styles.advancedAmountTexInputContainer : styles.focusContainer;
    const customStyle7 = !focus.style7 ? styles.advancedAmountTexInputContainer : styles.focusContainer;

    //File upload image
    const [fetchImage, setFetchImage] = React.useState('')
    console.log('fetchImage', fetchImage)
    const icon = fetchImage === '' ? require('../../assets/images/no_image.png') : { uri: fetchImage }
    console.log('fetchImage Icon ', icon)
    //ADD PERSON STATE
    const [name, setName] = React.useState('');
    const [roomNo, setRoomNo] = React.useState('');
    const [contact, setContact] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [advancedAmount, setAdvancedAmount] = React.useState('');
    //ADD ROOM STATE
    const [roomNo1, setRoomNo1] = React.useState('');
    console.log('ADD ROOM STATE OF ROOMNO1', roomNo1);
    const [noOfPerson, setNoOfPerson] = React.useState('');
    //DROPDOWN SELECT PICKER...
    const [selectedRoomNo, setSelectedRoomNo] = React.useState();
    console.log('selectedRoomNo', selectedRoomNo)

    //ADD PERSON VALIDATION
    const addPersonValidation = () => {
        if (name.length === 0) {
            Alert.alert('Please enter name')
        }
        else if (selectedRoomNo === undefined || selectedRoomNo === 'Select room no') {
            Alert.alert('Please select room number')
        }
        else if (contact.length === 0) {
            Alert.alert('Please enter contact number')
        }
        else if (address.length === 0) {
            Alert.alert('Please enter address')
        }
        else if (advancedAmount.length === 0) {
            Alert.alert('Please enter advanced amount')
        }
        else if (fetchImage.length === 0) {
            Alert.alert('Please upload file or image')
        }
        else if (name && contact && selectedRoomNo && address && advancedAmount && fetchImage) {
            Alert.alert('Thank you');
            // storeUser();
            setAddPerson(false);
            setViewDetails(true);
            // getUser();
            //BUTTON AFTER
            setName('');
            setContact('');
            setAddress('');
            setAdvancedAmount('');
            setSelectedRoomNo();
            setFetchImage('');
            setFocus({ style5: false })
            //Firebase
            addNewPerson();
            setDate(new Date())
        }
        else {
            Alert.alert('Invalid add person details')
        }
    }

    // LOCALSTORAGE...
    const value = {
        // name:name, key and value is same so used for name.
        'Name': name,
        'Room no': selectedRoomNo,
        'Contact': contact,
        'Address': address,
        'Image': fetchImage,
        'Advanced amount': advancedAmount,
        'Date': date,
    };
    console.log("value", value);

    const storeUser = async () => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(value))
        } catch (error) {
            console.log('Error', error)
        }
    }

    // HEADER CUSTOM NAVIGATION WITH CONDITONAL...
    const [addPerson, setAddPerson] = React.useState(true)
    const [addRoom, setAddRoom] = React.useState(false)
    const [viewDetails, setViewDetails] = React.useState(false)

    //ROOM VALIDATION...
    const addRoomValidation = () => {
        if (roomNo1.length === 0) {
            Alert.alert('Please enter room no')
        }
        else if (noOfPerson.length === 0) {
            Alert.alert('Please enter no of person')
        }
        else if (roomNo1 && noOfPerson) {
            // Alert.alert("Hi, Sorry. It's development progress...");
            Alert.alert("Added room no");
            storeRoomUser();
            getRoom();
            setNoOfPerson('');
            setRoomNo1('');
            setAddPerson(true);
            setAddRoom(false);
            setFocus({ style7: false })
        }
        else {
            Alert.alert('Invalid Details')
        }
    }

    //LOCALSTORAGE FOR ROOM
    const valueRoom = {
        'Room_no': roomNo1,
        // noOfPerson
    }
    console.log('ValueRoom', valueRoom);

    const storeRoomUser = async () => {
        try {
            await AsyncStorage.setItem('valueRoom', JSON.stringify(valueRoom));

        } catch (error) {
            console.log("Error", error);
        }
    }

    //LOCALSTORAGE FOR ADD ROOM TO ADD PERSON DETAILS IN GET DATA...
    const [getData1, setGetData1] = React.useState([]);
    console.log('getData1', getData1);
    const getRoom = async () => {
        try {
            const savedRoomNo = await AsyncStorage.getItem('valueRoom');
            const currentRoomNo = JSON.parse(savedRoomNo);
            console.log('CurrentRoomNo', currentRoomNo);
            setGetData1(oldArray => [...oldArray, currentRoomNo]);
        } catch (error) {
            console.log('Error', error)
        }
    }

    //LOCALSTORAGE FOR VIEW DETAILS IN GET DATA...
    const [getData, setGetData] = React.useState([]);
    console.log('getData', JSON.stringify(getData));
    const getUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('user');
            const currentUser = JSON.parse(savedUser);
            console.log('CurrentUser', currentUser);
            // setGetData(currentUser);
            setGetData(oldArray => [...oldArray, currentUser]);

        } catch (error) {
            console.log('Error', error);
        }
    }

    React.useEffect(() => {
        getUser();
        getRoom();
    }, []);

    const [userData, setUserData] = React.useState([]);
    const dataRetrieve = [];
    dataRetrieve.push(userData);
    console.log("userData", userData);
    console.log("dataRetrieve", dataRetrieve);

    //ROOM
    const [roomNoData, setRoomNoData] = React.useState([]);
    console.log('ROOM NO DATA SINGLE TIME RENDER', roomNoData);
    const roomDataRetrieve = [];
    roomDataRetrieve.push(roomNoData);
    console.log('roomDataRetrieve', roomDataRetrieve);
    console.log('roomDataRetrieve Object.values', Object.values(roomDataRetrieve));

    // let element = '';
    // // for (let index = 0; index < roomDataRetrieve.length; index++) {
    // //     element += roomDataRetrieve[index].Room_no;
    // // }
    // for (let index = 0; index < getData1.length; index++) {
    //     element += getData1[index].Room_no;
    // }
    // console.log('element', element);

    React.useEffect(() => {
        //ROOM NO  
        const roomNo = getData1.map((item, index) => {
            console.log('useEffect roomNo item Object.values', item);
            let dataPass = item === null ? 101 : JSON.parse(item.Room_no);
            setRoomNoData(dataPass);
        });
        console.log('Room No', roomNo);
        // return;
    }, [getData1]);

    //ADD PERSON...
    // React.useEffect(() => {
    //     const user = getData.map((item, index) => {
    //         console.log("item ADD PERSON",item);
    //         setUserData(item)
    //     });
    //     console.log('User retrieve', user);
    // }, [getData]);
    //TOP HEADER ACTIVE BUTTON COLOR
    // addPerson && opacity:0.8,backgroundColor:'grey'

    //BACK ACTION IN HOME SCREEN...
    React.useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        //called getItems
        // getUser();
        return () => backHandler.remove();
    }, []);
    //FLATLIST DATE
    const renderItem = ({ item }) => {
        console.log('item flatlist', item)
        // console.log('item Object.keys(item)[0] flatlist', Object.values(item)[0]);
        //    let datalist = [];
        //    datalist.push(Object.values(item)[6]);
        //    console.log('datalist',new Date(datalist).getDate()+'/'+new Date(datalist).getMonth()+'/'+new Date(datalist).getFullYear());
        return (
            <>
                {
                    item !== null &&
                    <DataTable style={styles.tableContainer} key={Object.keys(item).toString()}>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={styles.tableTitle}>{"Person"}</DataTable.Title>
                            <DataTable.Title style={styles.tableTitle}>{'Details'}</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row style={styles.tableDataCell}>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.keys(item)[0]}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.values(item)[0]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row style={styles.tableDataCell}>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.keys(item)[1]}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.values(item)[1]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row style={styles.tableDataCell}>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.keys(item)[2]}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.values(item)[2]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row style={styles.tableDataCell}>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.keys(item)[3]}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.values(item)[3]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row style={styles.tableDataCell}>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.keys(item)[4]}</DataTable.Cell>
                            <Image source={{ uri: Object.values(item)[4] }}
                                style={styles.getImage}
                            />
                        </DataTable.Row>
                        <DataTable.Row style={styles.tableDataCell}>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.keys(item)[5]}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.values(item)[5]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row style={styles.tableDataCell}>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.keys(item)[6]}</DataTable.Cell>
                            <DataTable.Cell style={styles.tableCellTitle}>{Object.values(item)[6]}</DataTable.Cell>
                            {/* <DataTable.Cell style={styles.tableCellTitle}>{new Date(datalist).getDate()+'/'+new Date(datalist).getMonth()+'/'+new Date(datalist).getFullYear()}</DataTable.Cell> */}
                        </DataTable.Row>
                    </DataTable>
                    // :
                    // <View>
                    //     <Text>{"DATA IS EMPTY"}</Text>
                    // </View>
                }

            </>

        )

    }
    // //FIREBASE WORKS...
    const [loader,setLoader] = React.useState(false);
    React.useEffect(() => {
        setLoader(true);
        return onValue(ref(db, '/addperson'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let todoItems = { ...data };
            console.log('Useefffect todoItems', todoItems)
            setGetData(todoItems);
            setLoader(false);
        });
    }, []);

    function addNewPerson() {
        push(ref(db, '/addperson'), {
            //   addperson: value,
            //    value,
            'Name': name,
            'Room_no': selectedRoomNo,
            'Contact': contact,
            'Address': address,
            'Image': fetchImage,
            'Advanced_amount': advancedAmount,
            'date': date.getTime(),
        });
        // setPresentTodo('');
    }
    const addPersonKey = Object.keys(getData);
    console.log('addPersonKey is =======>', addPersonKey);
    //
    // {todosKeys.length > 0 ? (
    //     todosKeys.map(key => (
    //       <ToDoItem
    //         key={key}
    //         id={key}
    //         todoItem={todos[key]}
    //       />
    //     ))
    //   ) : (
    //     <Text>No todo item</Text>
    //   )}

    const AddItems = ({ addItems: { Name, Room_no, Contact, Address, Image, Advanced_amount, date } }) => {
        console.log('AddItems addperson Name', Name)
        console.log('AddItems addperson Room_no', Room_no)
        console.log('AddItems addperson Contact', Contact)
        console.log('AddItems addperson Address', Address)
        console.log('AddItems addperson Image', Image)
        console.log('AddItems addperson Advanced_amount', Advanced_amount)
        console.log('AddItems addperson Date', date)
        // const image = JSON.stringify(Image)
        // console.log('AddItems addperson JSON image',image)
        // let getDat = [];
        // const image = Image
        // getDat.push(image)
        let hello = date;
        console.log('hello', hello);
        let dates = new Date(hello);
        console.log('AddItems to date', dates.getDate().toString() + '/' + (dates.getMonth().toString() + 1) + '/' + dates.getFullYear().toString())

        return (
            <View>

                {
                    Name === null ?
                        <Text>No data</Text>
                        :
                        // <DataTable style={styles.tableContainer} key={Object.keys(item).toString()}>
                        <DataTable style={styles.tableContainer}>

                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title style={styles.tableTitle}>{"Person"}</DataTable.Title>
                                <DataTable.Title style={styles.tableTitle}>{'Details'}</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Row style={styles.tableDataCell}>
                                <DataTable.Cell style={styles.tableCellTitle}>{'Name'}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellTitle}>{Name}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row style={styles.tableDataCell}>
                                <DataTable.Cell style={styles.tableCellTitle}>{'Room no'}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellTitle}>{Room_no}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row style={styles.tableDataCell}>
                                <DataTable.Cell style={styles.tableCellTitle}>{'Contact'}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellTitle}>{Contact}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row style={styles.tableDataCell}>
                                <DataTable.Cell style={styles.tableCellTitle}>{'Address'}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellTitle}>{Address}</DataTable.Cell>
                            </DataTable.Row>
                            {/* <DataTable.Row style={styles.tableDataCell}>
                    <DataTable.Cell style={styles.tableCellTitle}>{Image}</DataTable.Cell>
                    <DataTable.Cell style={styles.tableCellTitle}>{Image}</DataTable.Cell>
                </DataTable.Row> */}
                            <DataTable.Row style={styles.tableDataCell}>
                                <DataTable.Cell style={styles.tableCellTitle}>{"Image"}</DataTable.Cell>
                                <ImageBackground
                                    source={{ uri: Image }}
                                    resizeMode="stretch"
                                    style={styles.getImage}
                                />
                            </DataTable.Row>
                            <DataTable.Row style={styles.tableDataCell}>
                                <DataTable.Cell style={styles.tableCellTitle}>{'Advanced amount'}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellTitle}>{Advanced_amount}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row style={styles.tableDataCell}>
                                <DataTable.Cell style={styles.tableCellTitle}>{'Date'}</DataTable.Cell>
                                <DataTable.Cell style={styles.tableCellTitle}>{dates.getDate().toString() + '/' + (dates.getMonth() + 1).toString() + '/' + dates.getFullYear().toString()}</DataTable.Cell>
                            </DataTable.Row>


                        </DataTable>
                    // :
                    // <View>
                    //     <Text>{"DATA IS EMPTY"}</Text>
                    // </View>
                }

            </View>
        )
    }
    return (
        <View style={styles.container}>
            {/* <View style={[styles.headerContainer, viewDetails && { marginVertical: 35 }]}> */}
            <View style={[styles.headerContainer, viewDetails && addPersonKey.length > 0 ? { marginVertical: 35 } : null]}>
                <TouchableOpacity style={[styles.addPersonButton, addPerson && { backgroundColor: '#28C76F' }]}
                    onPress={() => {
                        // Alert.alert('Add Person');
                        setAddPerson(true)
                        setViewDetails(false)
                        setAddRoom(false)
                        // getRoom();
                    }}
                >
                    <Text style={[styles.addPersonText, addPerson && { color: 'black' }]}>{"Add Person"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.addRoomButton, addRoom && { backgroundColor: '#28C76F' }]}
                    onPress={() => {
                        // Alert.alert('Add Room');
                        setAddPerson(false)
                        setAddRoom(true)
                        setViewDetails(false)
                    }}
                >
                    <Text style={[styles.addRoomText, addRoom && { color: 'black' }]}>{"Add Room"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.viewDetailsbutton, viewDetails && { backgroundColor: '#28C76F' }]}
                    onPress={() => {
                        // Alert.alert('Add Details');
                        setAddRoom(false)
                        setViewDetails(true)
                        setAddPerson(false)
                    }}
                >
                    <Text style={[styles.viewDetailsText, viewDetails && { color: 'black' }]}>{"View Details"}</Text>
                </TouchableOpacity>
            </View>

            {/* //CONDTIONAL TO RETIEVE DATA FROM (ADD PERSON)... */}
            {
                addPerson &&
                <View style={styles.mainContainer}>
                    <View style={styles.nameContainer}>
                        <View style={styles.nameLabelTextContainer}>
                            <Text style={styles.nameLabelText}>{"Name"}</Text>
                        </View>
                        <View style={customStyle1}>
                            <TextInput
                                placeholder='Name'
                                placeholderTextColor={''}
                                value={name}
                                onChangeText={(text) => {
                                    console.log(text);
                                    setName(text);
                                }}
                                onFocus={() => setFocus({ style1: !false })}
                                style={styles.nameTextInput}
                            />
                        </View>
                    </View>

                    <View style={styles.addPersonRoomNoContainer}>
                        <View style={styles.addPersonRoomNoLabelContainer}>
                            <Text style={styles.addPersonRoomNoLabelText}>{"Room No"}</Text>
                        </View>
                        {/* <View style={customStyle2}> */}
                        <View style={styles.addPersonRoomNoTextInputContainer}>
                            <Picker
                                selectedValue={selectedRoomNo}
                                style={styles.addPersonRoomNoInputTextPicker}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelectedRoomNo(itemValue)

                                }
                                onFocus={() => setFocus({ style2: !false })}
                            >
                                <Picker.Item style={{ color: '#A9A9A9', fontSize: 15 }} label="Select room no" value="Select room no" />
                                {/* <Picker.Item style={{ color: 'black' }} label="101" value="101" /> */}
                                <Picker.Item style={{ color: 'black' }} label={JSON.stringify(roomNoData)} value={JSON.stringify(roomNoData)} />
                                {/* <Picker.Item label="102" value="102" />
                                <Picker.Item label="103" value="103" />
                                <Picker.Item label="104" value="104" />
                                <Picker.Item label="105" value="105" />
                                <Picker.Item label="106" value="106" />
                                <Picker.Item label="107" value="107" />
                                <Picker.Item label="108" value="108" /> */}
                            </Picker>
                            {/* <TextInput
                                placeholder='Room No'
                                placeholderTextColor={''}
                                value={roomNo}
                                onChangeText={(text) => {
                                    console.log(text);
                                    setRoomNo(text);
                                }}
                                onFocus={() => setFocus({ style2: !false })}
                                keyboardType={"number-pad"}
                                style={styles.rollNoInputText}
                            /> */}
                        </View>
                    </View>
                    <View style={styles.contactContainer}>
                        <View style={styles.contactLabelContainer}>
                            <Text style={styles.contactLabelText}>{"Contact No"}</Text>
                        </View>
                        <View style={customStyle3}>
                            <TextInput
                                placeholder='Contact No'
                                placeholderTextColor={''}
                                value={contact}
                                onChangeText={(text) => {
                                    console.log(text);
                                    setContact(text)
                                }}
                                onFocus={() => setFocus({ style3: !false })}
                                keyboardType={"number-pad"}
                                style={styles.contactTextInput}
                            />
                        </View>
                    </View>
                    <View style={styles.addressContainer}>
                        <View style={styles.addressLabelContainer}>
                            <Text style={styles.addressLabelText}>{"Address"}</Text>
                        </View>
                        <View style={customStyle4}>
                            <TextInput
                                placeholder='Address'
                                placeholderTextColor={''}
                                value={address}
                                onChangeText={(text) => {
                                    console.log(text);
                                    setAddress(text);
                                }}
                                onFocus={() => setFocus({ style4: !false })}
                                style={styles.addressTextInput}
                            // multiline
                            />
                        </View>
                    </View>
                    {/* //File upload... */}
                    {/* {TEMPORARILY HIDE THE MAP FUNCTION...} */}
                    {/* {fileResponse.map((file, index) => (
                        <View key={index.toString()} style={styles.showDateContainer}>
                            <Text
                                style={styles.uri}
                                numberOfLines={1}
                                ellipsizeMode={'middle'}>
                                {file?.uri}
                            </Text>
                        </View>
                    )
                )} */}
                    <View style={styles.IdProofContainer}>
                        <View style={styles.IdProofLabelContainer}>
                            <Text style={styles.IdProofLabelText}>{"ID Proof"}</Text>
                        </View>
                        <View style={styles.idProofFileUploadContainer}>
                            <View style={styles.uploadImageContainer}>
                                <Image
                                    source={icon}
                                    style={styles.uploadImage}
                                />
                            </View>
                            <TouchableOpacity style={styles.chooseFileContainer}
                                onPress={
                                    () => {
                                        handleDocumentSelection();
                                        setFocus({ style4: false })
                                    }
                                }
                            >
                                <Text style={styles.chooseFileLabelText}>Choose File</Text>
                                <Image
                                    source={require('../../assets/images/fileupload_image.png')}
                                    style={styles.fileUploadImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.advancedAmountContainer}>
                        <View style={styles.advancedAmountLabelContainer}>
                            <Text style={styles.advancedAmountLabelText}>{"Advanced Amount"}</Text>
                        </View>
                        <View style={customStyle5}>
                            <TextInput
                                placeholder='Advanced Amount'
                                placeholderTextColor={''}
                                value={advancedAmount}
                                onChangeText={(text) => {
                                    console.log(text);
                                    setAdvancedAmount(text)
                                }}
                                onFocus={() => setFocus({ style5: !false })}
                                keyboardType={"number-pad"}
                                style={styles.advancedAmountTextInput}
                            />
                        </View>
                    </View>

                    {/* date */}
                    <DatePicker
                        modal
                        open={open}
                        date={date}
                        onConfirm={(date) => {
                            setOpen(false)
                            setDate(date)
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />
                    <View style={styles.dateContainer}>
                        <View style={styles.dateLabelContainer}>
                            <Text style={styles.dateLabelText}>{"Date"}</Text>
                        </View>
                        <TouchableOpacity style={styles.dateshowTextInputContainer}
                            onPress={() => {
                                setOpen(true);
                                setFocus({ style5: false })
                            }
                            }
                        >
                            <Text style={styles.textLabelText}>{JSON.stringify((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()).slice(1, -1)}</Text>
                            <Image
                                source={require('../../assets/images/datepicker_image.png')}
                                style={styles.datePickerImage}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                     style={styles.addButton}
                        onPress={
                            () => {
                                addPersonValidation()
                            }
                        }>
                        <Text style={styles.addText}>{"Add"}</Text>
                    </TouchableOpacity>
                </View>
            }

            {/* ADD ROOM COMPONENT... */}
            {
                addRoom &&
                <View style={styles.mainRoomContainer}>
                    <View style={styles.roomNoContainer}>
                        <View style={styles.roomNoLabelTextContainer}>
                            <Text style={styles.nameLabelText}>{"Room No"}</Text>
                        </View>
                        <View style={customStyle6}>
                            <TextInput
                                placeholder='Room No'
                                placeholderTextColor={''}
                                value={roomNo1}
                                onChangeText={(text) => {
                                    console.log(text);
                                    setRoomNo1(text);
                                }}
                                onFocus={() => setFocus({ style6: !false })}
                                style={styles.nameTextInput}
                                keyboardType={'number-pad'}
                            />
                        </View>
                    </View>
                    <View style={styles.nameContainer}>
                        <View style={styles.nameLabelTextContainer}>
                            <Text style={styles.nameLabelText}>{"No of Person"}</Text>
                        </View>
                        <View style={customStyle7}>
                            <TextInput
                                placeholder='No of Person'
                                placeholderTextColor={''}
                                value={noOfPerson}
                                onChangeText={(text) => {
                                    console.log(text);
                                    setNoOfPerson(text);
                                }}
                                onFocus={() => setFocus({ style7: !false })}
                                style={styles.nameTextInput}
                                keyboardType={'number-pad'}

                            />
                        </View>
                    </View>

                    <TouchableOpacity 
                               style={styles.addButton}
                        onPress={
                            () => {
                                addRoomValidation()
                            }
                        } 
                        
                    >

                        <Text style={styles.addText}>{"Add"}</Text>

                    </TouchableOpacity>

                </View>
            }

            {/* VIEW DETAILS... */}
            {/* {
                viewDetails &&
                <View style={styles.flatlistViewContainer}
                >
                    <FlatList
                        data={getData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => addPersonKey}
                        contentContainerStyle={styles.list}
                        style={styles.flatlistContainer}
                    />
                </View>
            } */}
            {
                viewDetails &&
                <ScrollView
                //                 showsVerticalScrollIndicator={false}
                //   showsHorizontalScrollIndicator={false}

                >
                    {
                        loader ?
                         <ActivityIndicator
                            size={"large"}
                            color="#00C0F0"
                        />
                        :
                    addPersonKey.length >= 1 ? (
                        addPersonKey.map(key => (
                            <AddItems
                                key={key}
                                id={key}
                                addItems={getData[key]}
                            />
                        ))
                    ) : (
                        // <ActivityIndicator
                        //     size={"large"}
                        //     color="#00C0F0"
                        // />
                        <Text>No Data</Text>
                    )
                    }
                </ScrollView>
            }
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    headerContainer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    addPersonButton: {
        backgroundColor: '#0396FF',
        flex: 0.3,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    addPersonText: {
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 17,
        color: '#F3F3F3',
        fontSize: 14,
    },
    addRoomButton: {
        backgroundColor: '#0396FF',
        flex: 0.3,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    addRoomText: {
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 17,
        color: '#F3F3F3',
        fontSize: 14,
    },
    viewDetailsbutton: {
        backgroundColor: '#0396FF',
        flex: 0.3,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    viewDetailsText: {
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 17,
        color: '#F3F3F3',
        fontSize: 14,
    },
    mainContainer: {
        backgroundColor: '#FFFFFF',
        flex: 0.9,
    },
    nameContainer: {
    },
    nameLabelTextContainer: {
        marginHorizontal: 20,
    },
    nameLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    nameTextInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
    },
    focusContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
        borderWidth: 1,
        borderColor: 'red',
    },
    nameTextInput: {
        paddingLeft: 15,

    },
    //======
    mainRoomContainer: {
        backgroundColor: '#FFFFFF',
        flex: 0.9,
    },
    roomNoContainer: {
        marginVertical: 5,
    },
    roomNoLabelTextContainer: {
        marginHorizontal: 20,
    },
    roomNoLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    roomNoTextInput: {
        paddingLeft: 15,

    },
    ///=====
    rollNoContainer: {
        marginVertical: 5,
    },
    rollNoLabelContainer: {
        marginHorizontal: 20,
    },
    rollNoLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    rollNoTextInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
    },
    rollNoInputText: {
        paddingLeft: 15,
    },
    roomNoTextInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
    },

    //ADD PERSON ROOM 
    addPersonRoomNoContainer: {
        marginVertical: 5,
    },
    addPersonRoomNoLabelContainer: {
        marginHorizontal: 20,
    },
    addPersonRoomNoLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    addPersonRoomNoTextInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
    },
    addPersonRoomNoInputTextPicker: {
        position: 'relative',
        top: -5
    },
    //
    rollNoInputTextPicker: {
    },
    contactContainer: {
    },
    contactLabelContainer: {
        marginHorizontal: 20,
    },
    contactLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    contactTextInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
    },
    contactTextInput: {
        paddingLeft: 15,

    },
    addressContainer: {
    },
    addressLabelContainer: {
        marginHorizontal: 20,
    },
    addressLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    addressTextInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
    },
    addressTextInput: {
        paddingLeft: 15,
    },
    showDateContainer: {
    },
    uri: {
    },
    IdProofContainer: {
    },
    IdProofLabelContainer: {
        marginHorizontal: 20,
    },
    IdProofLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    chooseFileContainer: {
        backgroundColor: "#0396FF",
        flexDirection: 'row',
        marginHorizontal: 20,
        width: 150,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 5,
        height: 30,
        marginBottom: 5,
    },
    chooseFileLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
        marginHorizontal: 5,
    },
    fileUploadImage: {
        width: 20,
        height: 20,
    },
    advancedAmountContainer: {
    },
    advancedAmountLabelContainer: {
        marginHorizontal: 20,
    },
    advancedAmountLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    advancedAmountTexInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        height: 40,
    },
    advancedAmountTextInput: {
        paddingLeft: 15,
    },
    dateContainer: {
        marginHorizontal: 20,
    },
    dateLabelContainer: {
    },
    dateLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    dateshowTextInputContainer: {
        backgroundColor: "#F3F3F3",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 40,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5
    },
    textLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    datePickerImage: {
        width: 25,
        height: 25,
    },
    addButton: {
        backgroundColor: '#0396FF',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 5,
    },
    addText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    idProofFileUploadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 5,
    },
    uploadImageContainer: {
        width: 150,
        height: 70,
        borderWidth: 1,
        borderColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dotted',
        marginHorizontal: 20,
    },
    uploadImage: {
        resizeMode: 'stretch',
        position: 'absolute',
        width: '95%',
        height: '90%'
    },

    flatlistViewContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    flatlistContainer: {
    },
    tableContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#DCDCDC',
    },
    tableTitle: {
        flexGrow: 1,
        fontWeight: '700',
    },
    tableDataCell: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    tableCellTitle: {
    },
    list: {
    },
    getImage: {
        resizeMode: 'stretch',
        position: 'absolute',
        width: '50%',
        height: '90%',
        right: 0,
        bottom: -10,
    },
})