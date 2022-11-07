import { ActivityIndicator, Alert, BackHandler, Button, FlatList, Image, ImageBackground, LayoutAnimation, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native'
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

const HomeScreen = ({ navigation: { navigate } }) => {
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
                type: [DocumentPicker.types.images],
                // type: [DocumentPicker.types.allFiles],
                // allowMultiSelection: true,
            });
            setFileResponse(response);
            setFetchImage(response[0].uri);
        } catch (err) {
            console.warn(err);
        }
    }, []);
    // DATE
    const [date, setDate] = React.useState(new Date())
    // console.log('date', date);
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
    // console.log('fetchImage', fetchImage)
    const icon = fetchImage === '' ? require('../../assets/images/no_image.png') : { uri: fetchImage }
    // console.log('fetchImage Icon ', icon)
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
    console.log('No of person =====>', noOfPerson);
    // ADD ROOM DATA STORED TO FIREBASE REALTIME DATABASE
    const addRoomNoWithPersonData = {
        roomNo: roomNo1,
        roomPerson: noOfPerson
    }
    // GET
    const [storedRoomNo, setStoredRoomNo] = React.useState([])
    // console.log('storeRoomNo====>', storedRoomNo);
    // GET ROOM NUMBER ONLY FOR VALIDATE PURPOSE
    // setTimeout(() => {
    //     console.log('storedRoomNoKeyGet', storedRoomNoKeyGet);
    //     // console.log('checkRoomByAddRoom checkRoomByAddRoom.includes(1)', storedRoomNoKeyGet.includes("1"));
    // }, 3000);

    let storedRoomNoKey = Object.keys(storedRoomNo);
    // const dummyRoomNo = [101];
    let storedRoomNoKeyGet = storedRoomNoKey.length > 0 ? (storedRoomNoKey.map(key => storedRoomNo[key]).map(x => x.roomNo)) : null;


    // console.log('storedRoomNoKey ', storedRoomNoKeyGet)
    // setTimeout(() => {
    //     console.log('storeRoomNo setTimeout ====>', storedRoomNo);
    //     console.log('storedRoomNoKey ====>', storedRoomNoKey)
    //     console.log('storedRoomNoKeyGet setTimeout', storedRoomNoKeyGet)


    // }, 2000);
    React.useEffect(() => {
        // return onValue(ref(db, `/addRoomNoWithPerson_${addRoom.roomNo + "_" + addRoom.roomPerson}`), querySnapShot => {
        return onValue(ref(db, `/addRoomNoWithPerson`), querySnapShot => {
            let data = querySnapShot.val() || {};
            // console.log('DATA USEEFFECT ====>', data);
            let dataItems = { ...data };
            // console.log('DATA DATAITEMS USEEFFECT =====>', dataItems);
            setStoredRoomNo(dataItems);
        })
    }, [])
    //STORE
    function addRoomNoWithPerson() {
        // NOT GOOD
        // push(ref(db,`/addRoomNoWithPerson_${addRoom.roomNo +"_"+addRoom.roomPerson}`),{
        //     roomNo:roomNo1,
        //     roomPerson:noOfPerson
        // });
        // GOOD
        // push(ref(db, `/addRoomNoWithPerson_${addRoom.roomNo + "_" + addRoom.roomPerson}`), addRoomNoWithPersonData);
        push(ref(db, `/addRoomNoWithPerson`), addRoomNoWithPersonData);
    }
    //DROPDOWN SELECT PICKER...
    const [selectedRoomNo, setSelectedRoomNo] = React.useState();
    // console.log('selectedRoomNo', selectedRoomNo)

    //ADD PERSON VALIDATION
    const addPersonValidation = () => {
        if (name.length === 0) {
            Alert.alert('Please enter name')
        }
        else if (storedRoomNoKeyGet === null) {
            Alert.alert('Please add room number');
            setAddPerson(false);
            setViewDetails(false)
            setAddRoom(true)

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
        else if (fetchImage.length === 0) {
            Alert.alert('Please upload file or image')
        }
        else if (advancedAmount.length === 0) {
            Alert.alert('Please enter advanced amount')
        }

        // FIREBASE UPDATE FOR SPECIFIC DATA
        else if (updateData === true) {
            // if (selectedRoomNo === undefined || selectedRoomNo === 'Select room no') {
            //     Alert.alert('Please select room number')
            // please wrapping below codes here
            // }
            setAddPerson(false);
            setViewDetails(true);
            update(ref(db, `/addperson_${userNameVal.signupUsername + ' ' + userNameVal.signupPassword}/${specificId}`), {
                // [specificId]: {
                Name: name,
                Room_no: selectedRoomNo,
                Contact: contact,
                Address: address,
                Image: fetchImage,
                Advanced_amount: advancedAmount,
                // 'date': date.getTime(), 
                Dates: date.toUTCString(),
                // },
            })
            setName('');
            setContact('');
            setAddress('');
            setAdvancedAmount('');
            setSelectedRoomNo('');
            setFetchImage('');
            setFocus({ style5: false })
            setUpdateData(false);
            setSpecificId()
            setDate(new Date())
            Alert.alert('Updated');


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
            getUserName();
        }
        else {
            // Alert.alert('Invalid add person details')
            Alert.alert('Please select room number')
        }
    }

    // LOCALSTORAGE...
    const value = {
        // Name:name,,,,, key and value is same so used for name.
        Name: name,
        Room_no: selectedRoomNo,
        Contact: contact,
        Address: address,
        Image: fetchImage,
        Advanced_amount: advancedAmount,
        Dates: date,
    };
    // console.log("value", value);

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
        const d = JSON.parse(roomNo1);
        if (roomNo1.length === 0) {
            Alert.alert('Please enter room number')
        }
        else if (noOfPerson.length === 0) {
            Alert.alert('Please enter no of person')
        }
        else if (storedRoomNoKeyGet === null) {
            Alert.alert("Added room no");
            storeRoomUser();
            getRoom();
            setNoOfPerson('');
            setRoomNo1('');
            setAddPerson(true);
            setAddRoom(false);
            setFocus({ style7: false })
            addRoomNoWithPerson();
        }
        else if (storedRoomNoKeyGet.includes(roomNo1)) {
            Alert.alert('This room number is already used by you')
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
            addRoomNoWithPerson();
        }
        else {
            Alert.alert('Invalid Details')
        }
    }

    //LOCALSTORAGE FOR ROOM
    // TEMPORARIRLY HIDE BELOW OBJECT AND addRoomNoWithPersonData INSTEADOF valueRoom
    // const valueRoom = {
    //     'Room_no': roomNo1,
    //     // noOfPerson
    // }
    // console.log('ValueRoom', valueRoom);

    const storeRoomUser = async () => {
        try {
            await AsyncStorage.setItem('addRoomNoWithPersonData', JSON.stringify(addRoomNoWithPersonData));

        } catch (error) {
            console.log("Error", error);
        }
    }

    //LOCALSTORAGE FOR ADD ROOM TO ADD PERSON DETAILS IN GET DATA...
    const [getData1, setGetData1] = React.useState([]);
    // console.log('getData1', getData1);
    const getRoom = async () => {
        try {
            const savedRoomNo = await AsyncStorage.getItem('addRoomNoWithPersonData');
            const currentRoomNo = JSON.parse(savedRoomNo);
            // console.log('CurrentRoomNo', currentRoomNo);
            setGetData1(oldArray => [...oldArray, currentRoomNo]);
        } catch (error) {
            console.log('Error', error)
        }
    }

    //LOCALSTORAGE FOR VIEW DETAILS IN GET DATA...
    const [getData, setGetData] = React.useState([]);
    // console.log('getData', JSON.stringify(getData));
    console.log('getData', getData);
    const getUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('user');
            const currentUser = JSON.parse(savedUser);
            // console.log('CurrentUser', currentUser);
            // setGetData(currentUser);
            // Below line for issue
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
    // console.log("userData", userData);
    // console.log("dataRetrieve", dataRetrieve);

    //ROOM
    const [roomNoData, setRoomNoData] = React.useState([]);
    // setTimeout(() => {
    //     console.log('ROOM NO DATA SINGLE TIME RENDER', roomNoData);
    // }, 2000);
    // const roomDataRetrieve = [];
    // roomDataRetrieve.push(roomNoData);
    // console.log('roomDataRetrieve', roomDataRetrieve);
    // console.log('roomDataRetrieve Object.values', Object.values(roomDataRetrieve));

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
            setTimeout(() => {
                console.log("item========>", item);
            }, 3000);
            // console.log('useEffect roomNo item Object.values', item);
            // let dataPass = item === null ? 101 : JSON.parse(item.Room_no);
            // console.log("dataPass", dataPass)
            // setRoomNoData(dataPass);
            setRoomNoData(item);
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
        // console.log('item flatlist', item)
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
    const [loader, setLoader] = React.useState(false);
    // GET LOCALSTORAGE FROM SIGNUP
    const [userNameVal, setUserNameVal] = React.useState('')
    // const [userNameVal, setUserNameVal] = React.useState([]);
    // console.log('userNameVal', userNameVal.signupUsername+' '+userNameVal.signupPassword + userNameVal.password);
    console.log("Usernamevalue=========>", userNameVal.signupUsername);
    console.log("Usernamevalue=========>", userNameVal);
    React.useEffect(() => {
        getUserName();
    }, []);
    React.useEffect(() => {
        setLoader(true);
        return onValue(ref(db, `/addperson_${userNameVal.signupUsername + ' ' + userNameVal.signupPassword}`), querySnapShot => {
            // return onValue(ref(db, '/addperson'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let todoItems = { ...data };
            console.log('Useefffect todoItems', todoItems)
            // naming.filter(x=>x===name)&&
            setGetData(todoItems);
            setLoader(false);
        });
    }, [userNameVal]);

    const getUserName = async () => {
        try {
            const data = await AsyncStorage.getItem('signUser');
            const dataItem = JSON.parse(data);
            // console.log('localstorage get items', dataItem);
            setUserNameVal(dataItem)

        } catch (error) {
            console.log('error', error);
        }
    }

    // const randormNumber = Math.floor(Math.random() *3);
    const usernameFor = 'thameem';
    // LOGIN LOADER FOR GETTING DATA TEMPORARLY...
    const [loginLoader, setLoginLoader] = React.useState(!false);
    React.useEffect(() => {
        // return onValue(ref(db, `username_${signupValue.username}`), querySnapShot => {
        setLoginLoader(true);
        return onValue(ref(db, 'user'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let dataItems = { ...data };
            console.log('Useeffect return dataitems ===>', dataItems);
            // let dataItem = Object.keys(dataItems).map(key=>dataItems[key]).map(x=>x.username);
            // alert(JSON.stringify(dataItem));
            // setUserNameVal(dataItems);
            setLoginLoader(false);
        })
    }, [])

    function addNewPerson() {
        push(ref(db, `/addperson_${userNameVal.signupUsername + ' ' + userNameVal.signupPassword}`), {
            // push(ref(db, '/addperson'), {
            //   addperson: value,
            //    value,
            Name: name,
            Room_no: selectedRoomNo,
            Contact: contact,
            Address: address,
            Image: fetchImage,
            Advanced_amount: advancedAmount,
            // 'date': date.getTime(), 
            Dates: date.toUTCString(),
        });
        // setPresentTodo('');

    }
    // const addPersonKey = Object.keys(getData);
    // console.log('addPersonKey is =======>', addPersonKey);
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

    // FIREBASE SPECIFIC USER DATA UPDATE
    const [updateData, setUpdateData] = React.useState(false);
    const [specificId, setSpecificId] = React.useState();
    console.log('specificId', specificId);
    function SingleDataHeader({ name, id, roomno, contact, address, image, advanceamount, date }) {
        //SINGLE PHONE NUMBER SHARING FOR WHATSAPP
        function singlePhoneNoSharingWhatsapp() {
            // Alert.alert('Working');
            const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const defaultMessage = `You have not paid the fee for the month of *${month[new Date(date).getMonth()]}* and *${month[new Date().getMonth()]}*.`;
            // Alert.alert( `You have not paid the month of ${month[new Date(date).getMonth()]} and ${month[new Date().getMonth()]}.`)
            let url = 'whatsapp://send?text=' + defaultMessage + '&phone=91' + contact;
            Linking.openURL(url).then(() => {
                console.log('Whatsapp Opened!')
            }).catch(() => {
                console.log('Error Whatsapp')
            })
        }
        // SINGLE DATA DELETE WITH SPECIFIC KEY 
        function singleDataDelete() {
            if (name === name) {
                // Alert.alert('same')
                // const id = id ==== id ? id: null;
                // const specifiUserKey = 
                remove(ref(db, `/addperson_${userNameVal.signupUsername + ' ' + userNameVal.signupPassword}/${id}`))
                // console.log("singleDataDelete ID",id)
            }
            else {
                Alert.alert('Not deleted')
            }
        }
        // SINGLE DATA EDIT WITH SPECIFIC KEY 
        function singleDataEditDetail() {
            if (name === name) {
                Alert.alert('Edit data');
                setAddPerson(true)
                setViewDetails(false)
                setAddRoom(false)
                setName(name);
                setContact(contact);
                setAddress(address);
                setAdvancedAmount(advanceamount);
                setSelectedRoomNo(roomno);
                setFetchImage(image);
                // setFocus({ style5: false })
                setUpdateData(true);
                setSpecificId([id])
                //I FIXED DATE
                setDate(new Date(date))
                // update(ref(db,`/addperson_${userNameVal.signupUsername + ' ' + userNameVal.signupPassword}/${id}`),{
                //     [id]:{

                //     },
                // })
            }
            else {
                Alert.alert('Not Edited')
            }
        }

        const changeLayout = () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpandedView(!expandedView);
            setViewIconImage(!viewIconImage);
            // setSpecificId(id);

        }
        // if (Platform.OS === 'android') {
        //     UIManager.setLayoutAnimationEnabledExperimental(true);
        //     }
        let helloKeys = Object.keys(getData);
        let naming = helloKeys.length > 0 ? (helloKeys.map(key => getData[key]).map(x => x.Name)) : null;
        console.log('Naming========>', naming.filter(x => x === name))
        let hel = naming.filter(x => x === name);
        console.log('hel', hel);
        console.log('helloKeys========>', helloKeys);
        const [expandedView, setExpandedView] = React.useState(false);
        console.log('The EXPANDED VIEW ====>', expandedView);
        // VIEW ICON FOR HIDE OR UNHIDE
        const [viewIconImage, setViewIconImage] = React.useState(false);
        const viewIcon = viewIconImage ? require('../../assets/images/view_image.png') : require('../../assets/images/hide_view_image.png');
        console.log('viewIconImage', viewIconImage);
        //ROOM NO SHOWING OR NOT 
        const [roomNoShow, setRoomNoShow] = React.useState(false);
        console.log('Room no show state', roomNoShow);
        return (
            <View>
                <TouchableOpacity style={[styles.roomNoShowContainer, roomNoShow ? { borderWidth: .7, borderColor: '#28C76F' } : { borderWidth: .4, borderColor: 'black' }]}
                    onPress={() => { setRoomNoShow(!roomNoShow) }}>
                    <Text style={styles.roomNoShowText}>{roomno}</Text>
                </TouchableOpacity>
                {
                    roomNoShow ?
                        <>
                            <View key={id} style={[styles.singleDataContainer, !viewIconImage ? { borderWidth: .4, borderColor: 'black' } : { borderWidth: .4, borderColor: '#28C76F' }]}>
                                <View style={styles.singleDataTextContainer}>
                                    <Text style={styles.singleDataText}>{name.length >= 12 ? name.slice(0, 10).toUpperCase().concat('...') : name.toUpperCase()}</Text>
                                </View>
                                <View style={styles.singleDataImagesContainer}>
                                    <TouchableOpacity style={styles.viewImageContainer}
                                        //   activeOpacity={0.8} 
                                        onPress={() => {
                                            // EXPANDED VIEW
                                            // if (id === id) {
                                            changeLayout();
                                            // }
                                            // else {
                                            //     Alert.alert('Else');
                                            // }
                                        }}
                                    >
                                        {/* NEED WORK FOR CONDTIONAL IMAGE HIDE IMAGE OR UNHIDE IMAGE */}
                                        <Image
                                            source={viewIcon}
                                            style={styles.singleViewImage}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.editImageContainer}
                                        onPress={() => singleDataEditDetail()}
                                    >
                                        <Image
                                            source={require('../../assets/images/edit_image.png')}
                                            style={styles.singleEditImage}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.singleDeleteImageContainer}
                                        onPress={() => singleDataDelete()}
                                    >
                                        <Image
                                            source={require('../../assets/images/delete_image.png')}
                                            style={styles.singleDeleteImage}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.singleWhatsappImageContainer}
                                        onPress={() => singlePhoneNoSharingWhatsapp()}
                                    >
                                        <Image
                                            source={require('../../assets/images/whatsapp_image1.png')}
                                            style={styles.singleWhatsappImage}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* {
                id === specificId && 
            } */}
                            <DataTable style={[styles.tableContainer, { height: expandedView ? null : 0, overflow: 'hidden' }]}>
                                <DataTable.Header style={styles.tableHeader}>
                                    <DataTable.Title style={styles.tableTitle}>{"Person"}</DataTable.Title>
                                    <DataTable.Title style={styles.tableTitle}>{'Details'}</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Row style={styles.tableDataCell}>
                                    <DataTable.Cell style={styles.tableCellTitle}>{'Name'}</DataTable.Cell>
                                    <DataTable.Cell style={styles.tableCellTitle}>{name}</DataTable.Cell>
                                </DataTable.Row>

                                <DataTable.Row style={styles.tableDataCell}>
                                    <DataTable.Cell style={styles.tableCellTitle}>{'Room no'}</DataTable.Cell>
                                    <DataTable.Cell style={styles.tableCellTitle}>{roomno}</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row style={styles.tableDataCell}>
                                    <DataTable.Cell style={styles.tableCellTitle}>{'Contact'}</DataTable.Cell>
                                    <DataTable.Cell style={styles.tableCellTitle}>{contact}</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row style={styles.tableDataCell}>
                                    <DataTable.Cell style={styles.tableCellTitle}>{'Address'}</DataTable.Cell>
                                    <DataTable.Cell style={styles.tableCellTitle}>{address}</DataTable.Cell>
                                </DataTable.Row>
                                {/* <DataTable.Row style={styles.tableDataCell}>
                    <DataTable.Cell style={styles.tableCellTitle}>{Image}</DataTable.Cell>
                    <DataTable.Cell style={styles.tableCellTitle}>{Image}</DataTable.Cell>
                </DataTable.Row> */}
                                <DataTable.Row style={styles.tableDataCell}>
                                    <DataTable.Cell style={styles.tableCellTitle}>{"Image"}</DataTable.Cell>
                                    <ImageBackground
                                        source={{ uri: image }}
                                        resizeMode="stretch"
                                        style={styles.getImage}
                                    />
                                </DataTable.Row>
                                <DataTable.Row style={styles.tableDataCell}>
                                    <DataTable.Cell style={styles.tableCellTitle}>{'Advanced amount'}</DataTable.Cell>
                                    <DataTable.Cell style={styles.tableCellTitle}>{advanceamount}</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row style={styles.tableDataCell}>
                                    <DataTable.Cell style={styles.tableCellTitle}>{'Date'}</DataTable.Cell>
                                    <DataTable.Cell style={styles.tableCellTitle}>{new Date(date).getDate().toString() + '/' + (new Date(date).getMonth() + 1).toString() + '/' + new Date(date).getFullYear().toString()}</DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        </>
                        :
                        null
                }

            </View>
        )
    }
    const AddItems = ({ addItems: { Name, Room_no, Contact, Address, Image, Advanced_amount, Dates }, id }) => {
        // console.log('AddItems addperson Name', Name)
        // console.log('AddItems addperson Room_no', Room_no)
        // console.log('AddItems addperson Contact', Contact)
        // console.log('AddItems addperson Address', Address)
        // console.log('AddItems addperson Image', Image)
        // console.log('AddItems addperson Advanced_amount', Advanced_amount)
        // console.log('AddItems addperson Date', date)
        // const image = JSON.stringify(Image)
        // console.log('AddItems addperson JSON image',image)
        // let getDat = [];
        // const image = Image
        // getDat.push(image)
        let hello = Dates;
        // console.log('hello', hello);
        let dates = new Date(hello);
        // console.log('AddItems to date', dates.getDate().toString() + '/' + (dates.getMonth().toString() + 1) + '/' + dates.getFullYear().toString())
        console.log('additems key [id]=========>', [id]);
        console.log('additems key id=========>', id);
        return (
            <View>

                {
                    Name === null ?
                        <Text>No data</Text>
                        :
                        // <DataTable style={styles.tableContainer} key={Object.keys(item).toString()}>
                        // {/* //VIEW EDIT DELETE */}
                        <>
                            <SingleDataHeader name={Name} id={id} roomno={Room_no} contact={Contact} address={Address} image={Image} advanceamount={Advanced_amount} date={Dates} />

                            {/* <DataTable style={[styles.tableContainer,  {height:expandedView?null:0,overflow:'hidden'}]}>
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
                                </DataTable.Row> */}
                            {/* <DataTable.Row style={styles.tableDataCell}>
                    <DataTable.Cell style={styles.tableCellTitle}>{Image}</DataTable.Cell>
                    <DataTable.Cell style={styles.tableCellTitle}>{Image}</DataTable.Cell>
                </DataTable.Row> */}
                            {/* <DataTable.Row style={styles.tableDataCell}>
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
                            </DataTable> */}
                        </>
                }
            </View>
        )
    }
    // const [expandedView, setExpandedView] = React.useState(false);
    // console.log('The EXPANDED VIEW ====>', expandedView);
    //         // VIEW ICON FOR HIDE OR UNHIDE
    //         const [viewIconImage,setViewIconImage] = React.useState(false);
    //         const viewIcon = viewIconImage?require('../../assets/images/view_image.png'):require('../../assets/images/hide_view_image.png');
    //        console.log('viewIconImage',viewIconImage);
    // VIEW DETAILS ALL DATA DELETE FUNCTION
    function deleteAllData() {
        remove(ref(db, `/addperson_${userNameVal.signupUsername + ' ' + userNameVal.signupPassword}`));

    }
    // ALERT WITH QUESTION FOR DELETE ALL DATA IN VIEW DETAILS
    function askQuestionWithAlert() {
        Alert.alert(
            'Last confirmation',
            'Are you sure you are deleting the all data?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('User not deleted'),
                    style: 'cancel'
                },
                {
                    text: 'Delete All',
                    onPress: () => deleteAllData(),
                }
            ]

        )
    }
    const nameLength = 'thameem ansari'
    let addPersonKey = Object.keys(getData);
    console.log('addPersonKey is =======>', addPersonKey);

    // SINGLE DATA DELETE 
    let singleUserName = addPersonKey.length > 0 ? (addPersonKey.map(key => getData[key])) : null;
    console.log('singleUserName ===>', singleUserName);

    // function singleDataDelete() {
    //     if (singleUserName === userNameVal.signupUsername) {
    //         Alert.alert('Same');
    //     }
    //     else {
    //         console.log('failed')
    //     }
    //     // remove (ref(db,`/addperson_${userNameVal.signupUsername+' '+userNameVal.signupPassword}`))
    // }

    // ASCENDING ORDER FUNCTION CALL
    function ascendingOrder() {
        Alert.alert('ascendingOrder');
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
                        setName('');
                        setContact('');
                        setAddress('');
                        setAdvancedAmount('');
                        setSelectedRoomNo('');
                        setFetchImage('');
                        setFocus({ style5: false })
                        setUpdateData(false);
                        setSpecificId()
                        setDate(new Date())
                    }}
                >
                    <Text style={[styles.viewDetailsText, viewDetails && { color: 'black' }]}>{"View Details"}</Text>
                </TouchableOpacity>
            </View>
            {/* ASCENDING ORDER FOR ALL DATA */}
            {
                viewDetails && addPersonKey.length > 0 ?

                    <View style={styles.allDeleteImageContainer}>
                        {/* <TouchableOpacity 
                        // style={styles.allDeleteImage}
                            // onPress={() => ascendingOrder()}
                            > */}
                        <Button title="Ascending Order"
                            onPress={() => ascendingOrder()}
                        />
                        {/* <Image
                                source={require('../../assets/images/all_delete_image.png')}
                                style={styles.allDeleteItems}
                            /> */}
                        {/* </TouchableOpacity> */}
                    </View>
                    :
                    null
            }
            {/* DELETE ALL DATA FROM FIREBASE */}
            {
                viewDetails && addPersonKey.length > 0 ?

                    <View style={styles.allDeleteImageContainer}>
                        <TouchableOpacity style={styles.allDeleteImage}
                            onPress={() => askQuestionWithAlert()}>
                            <Image
                                source={require('../../assets/images/all_delete_image.png')}
                                style={styles.allDeleteItems}
                            />
                        </TouchableOpacity>
                    </View>
                    :
                    null
            }

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
                                placeholderTextColor={'#C4C4C4'}
                                value={name}
                                onChangeText={(text) => {
                                    // console.log(text);
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
                                {/* FINALLY I GOT THE RESULT */}
                                {
                                    storedRoomNoKeyGet?.map((val, key) => {
                                        console.log('Map=>', val);

                                        return (
                                            <Picker.Item key={key} style={{ color: 'black' }} label={val} value={val} />
                                        )
                                    })
                                }
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
                               placeholderTextColor={'#C4C4C4'}
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
                                placeholderTextColor={'#C4C4C4'}
                                value={contact}
                                onChangeText={(text) => {
                                    // console.log(text);
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
                                placeholderTextColor={'#C4C4C4'}
                                value={address}
                                onChangeText={(text) => {
                                    // console.log(text);
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
                                placeholderTextColor={'#C4C4C4'}
                                value={advancedAmount}
                                onChangeText={(text) => {
                                    // console.log(text);
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
                                loginLoader ?
                                    null
                                    :
                                    addPersonValidation()
                            }
                        }>
                        {
                            loginLoader ?
                                <ActivityIndicator
                                    size={"large"}
                                    color="#00C0F0"
                                />
                                :
                                <Text style={styles.addText}>{"Add"}</Text>

                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={
                            () => {
                                navigate('Login');
                                getUserName();

                            }
                        }>
                        <Text style={styles.addText}>{"Logout"}</Text>
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
                                placeholderTextColor={'#C4C4C4'}
                                value={roomNo1}
                                onChangeText={(text) => {
                                    // console.log(text);
                                    // setRoomNo1(text);
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
                                placeholderTextColor={'#C4C4C4'}
                                value={noOfPerson}
                                onChangeText={(text) => {
                                    // console.log(text);
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
        borderWidth: .4,
        borderColor: 'black'
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
        borderWidth: .4,
        borderColor: 'black'
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
        borderWidth: .4,
        borderColor: 'black'
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
        borderColor: '#0396FF',
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
    allDeleteImageContainer: {
        // backgroundColor: 'green',
        // marginVertical:2
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 5,


    },
    allDeleteImage: {
        backgroundColor: '#C4C4C4',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderWidth: .4,
        borderColor: 'black'
    },
    allDeleteItems: {
        width: 22,
        height: 22,
        // resizeMode:'cover'
        resizeMode: 'contain',


    },
    singleDataContainer: {
        backgroundColor: 'lightgray',
        flexDirection: 'row',
        // width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 10,
        marginBottom: 10,
        // flexShrink:1,
        borderRadius: 5,
        // borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,


    },
    singleDataTextContainer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 100,
        // width: '60%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
    },
    singleDataText: {
        fontfamily: 'Calibri',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 17,
        color: '#121212',
        // marginHorizontal: 10,
        // flexGrow: 1,
        // flexShrink: 1,
    },
    singleDataImagesContainer: {
        flexDirection: 'row',
        // backgroundColor: 'green',
        // flexGrow: 1,
        width: '50%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginHorizontal: 5,
        // borderRadius:5,
        marginVertical: 5,

    },
    viewImageContainer: {
        backgroundColor: '#a8b6ee',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderRadius: 40,
        // borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // elevation: 5,
        borderWidth: .4,
        borderColor: 'black'
    },
    singleViewImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    editImageContainer: {
        backgroundColor: '#a8b6ee',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderRadius: 40,
        // borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // elevation: 5,
        borderWidth: .4,
        borderColor: 'black'
    },
    singleEditImage: {
        width: 15,
        height: 12,
        resizeMode: 'contain',

    },
    singleDeleteImageContainer: {
        backgroundColor: '#a8b6ee',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderRadius: 40,
        // borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // elevation: 5,
        borderWidth: .4,
        borderColor: 'black'
    },
    singleDeleteImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain',

    },
    singleWhatsappImageContainer: {
        backgroundColor: '#a8b6ee',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
        borderRadius: 40,
        // borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // elevation: 5,
        borderWidth: .4,
        borderColor: 'black'
    },
    singleWhatsappImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: 'black'
    },
    roomNoShowContainer: {
        backgroundColor: '#a8b6ee',
        // width: 30,
        // height: 30,
        margin: 3,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        // elevation: 5,
        justifyContent: 'center',
        alignItems: "center",
    },
    roomNoShowText: {
        fontfamily: 'Calibri',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 17,
        color: '#121212',
    }
})