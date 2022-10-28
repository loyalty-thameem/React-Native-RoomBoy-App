import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, push, ref } from 'firebase/database';
import { db } from '../Firebase/firebase-config';

const LoginScreen = ({ navigation: { navigate } }) => {
    const [checked, setChecked] = React.useState(false);
    // console.log('state checked', checked);
    const [rememberChecked, setRememberChecked] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [focus, setFocus] = React.useState({
        style1: false,
        style2: false,
        style3: false,
    });
    const customStyle1 = !focus.style1 ? styles.usernameTextInputContainer : styles.usernameTextInputContainerFocus;
    const customStyle2 = !focus.style2 ? styles.textinputTextContainer : styles.textinputTextContainerFocus;
    const customStyle3 = !focus.style3 ? styles.textinputTextContainer1 : styles.textinputTextContainerFocus1;

    // GET LOCALSTORAGE FOR VALIDATION PURPOSE...
    const [getUserName, setGetUserName] = React.useState([]);
    // console.log('getusername ', getUserName);

    //GETTING USERNAME FROM LOCALSTORAGE...
    let dataAra = [];
    Object.keys(getUserName).forEach((key) => {
        if (getUserName[key] === getUserName[key]) {
            // console.log('The Object key getUsername', getUserName[key].username);
            let usernameValue = getUserName[key] === null ? 'null' : getUserName[key].username;
            dataAra.push(usernameValue);
        }
    })
    // console.log('dataAra', dataAra);
    // console.log('dataAra.includes(username)', dataAra.includes(username));

    //NOT NEEDED BELOW LOOP CODE...
    let element = '';
    for (let index = 0; index < getUserName.length; index++) {
        element = getUserName[index] === null ? 'null' : getUserName[index].username;
        // console.log('element', element);
    }
    const dataCheck = [];
    dataCheck.push(element);
    // console.log('Datacheck', dataCheck);
    // console.log('element3', element);
    const getUserVal = async () => {
        try {
            const data = await AsyncStorage.getItem('signUser');
            const dataItems = JSON.parse(data);
            console.log('getUser value from local storage', dataItems);
            setGetUserName(oldArray => [...oldArray, dataItems]);
        } catch (error) {
            console.log('Error', error);
        }
    }
    React.useEffect(() => {
        getUserVal();
    }, []);
    React.useEffect(() => {
    }, [getUserName])

    //LOGIN VALIDATION
    const loginValidation = () => {
        if (username.length === 0) {
            Alert.alert('Please Enter your username');
        }
        else if (password.length === 0) {
            Alert.alert('Please Enter your password')
        }
        else if (rememberChecked === false) {
            Alert.alert('Please accept remember me')
        }
        else if (checked === true) {
            Alert.alert('Temporarily user not allowed')
        }
        else if (hellodata === null || !hellodata.includes(username)) {
            Alert.alert("Please register username and password doesn't exists")
        }
        else if (checked === false && username && password) {
            navigate('Home');
            Alert.alert('Thank you')
            setChecked(false);
            setRememberChecked(false);
            setUsername('');
            setPassword('');
            setFocus({ style2: false })
            storeUser();
            getUserVal();
        }
        else {
            Alert.alert('Your login details invalid');
        }
    }

    // HEADER IMAGES...
    const icon = checked === false ? require('../../assets/images/admin_background.png') : require('../../assets/images/user_background.png')

    //SIGN PAGE...
    const [ifSignIn, setIfSignIn] = React.useState(false);
    const [confirmPassword, setConfirmPassword] = React.useState('');

    //SIGNUP LOCALSTORAGE...
    const signupValue = {
        username,
        // password
    }
    const storeUser = async () => {
        try {
            await AsyncStorage.setItem('signUser', JSON.stringify(signupValue));
        } catch (error) {
            console.log('error', error);
        }
    }
    // STORE FIREBASE...
    function newUserData() {
        // push(ref(db, `username_${signupValue.username}`), {
        push(ref(db, "username"), {
            username: signupValue.username
        })
    }
    // GET FIREBASE STORE...
    const [userNameData, setUserNameData] = React.useState([]);
    console.log('UserNameData first ==>', userNameData);
    React.useEffect(() => {
        // return onValue(ref(db, `username_${signupValue.username}`), querySnapShot => {
        return onValue(ref(db, 'username'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let dataItems = { ...data };
            console.log('Useeffect return dataitems ===>', dataItems);
            setUserNameData(dataItems);
        })
    }, [])
    console.log('UserNameData second ==>', userNameData);
    let helloKey = Object.keys(userNameData);
    console.log('Hello keys ===', helloKey);
    // let hellodata = helloKey.length > 1 ? (helloKey.map(key => userNameData[key].username)) : null;
    let hellodata = helloKey.length > 0 ? (helloKey.map(key => userNameData[key].username)) : null;
    console.log('hellodata', hellodata);
    // SIGNUP VALIDATION... 
    const signUpValidation = () => {
        if (username.length === 0) {
            Alert.alert('Please Enter your username');
        }
        // else if (username === getUserName.username) {
        //     Alert.alert('Username already exists')
        // }
        else if (password.length === 0) {
            Alert.alert('Please Enter your password')
        }
        else if (confirmPassword.length === 0) {
            Alert.alert('Please Enter your confirm password')
        }
        else if (password !== confirmPassword) {
            Alert.alert('Please Enter passoword properly')
        }
        else if (checked === true) {
            Alert.alert('Temporarily user not allowed')
        }
        // else if (dataAra.includes(username)) {
        else if (hellodata === null) {
            navigate('Home');
            Alert.alert('Thank you')
            setChecked(false);
            setUsername('');
            setPassword('');
            setConfirmPassword('')
            setIfSignIn(false);
            setFocus({ style3: false });
            storeUser();
            getUserVal();
            //FIREBASE STORE...
            newUserData();
        }
        else if (hellodata.includes(username)) {
            Alert.alert('Username already exists')
        }
        else if (checked === false && username && password && confirmPassword) {
            navigate('Home');
            Alert.alert('Thank you')
            setChecked(false);
            setUsername('');
            setPassword('');
            setConfirmPassword('')
            setIfSignIn(false);
            setFocus({ style3: false });
            storeUser();
            getUserVal();
            //FIREBASE STORE...
            newUserData();
        }
        else {
            setIfSignIn(false);
        }
    }
    // LOGIN LOADER FOR GETTING DATA TEMPORARLY...
    const [loginLoader, setLoginLoader] = React.useState(false);
    setTimeout(() => {
        setLoginLoader(true);
    }, 3000);
    return (
        <>
            {
                !loginLoader ? <ActivityIndicator size={'large'} color="#00C0F0" />
                    :
                    <View style={styles.container}>

                        <View style={styles.backgroundImageContainer}>
                            <Image
                                source={icon}
                                style={styles.backgroundImage}
                            />
                        </View>

                        <View style={styles.curveMainContainer}>

                            <View style={styles.customNavigatorContainer}>
                                <Text style={styles.loginText}>{ifSignIn ? "Signup" : "Login"}</Text>
                            </View>
                            <View style={styles.inputFieldContainer}>
                                <View style={styles.phoneLabelContainer}>
                                    <Text style={styles.phoneText}>{"Username"}</Text>
                                </View>
                                <View style={customStyle1}>
                                    <TextInput
                                        placeholder='Your Username'
                                        placeholderTextColor={'#C4C4C4'}
                                        onChangeText={(usernameTextValue) => {
                                            // console.log('usernameTextValue', usernameTextValue);
                                            setUsername(usernameTextValue);
                                        }}
                                        value={username}
                                        style={styles.usernameTextInput}
                                        onFocus={() => setFocus({ style1: !false })}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputFieldContainer2}>
                                <View style={styles.passwordLabelContainer}>
                                    <Text style={styles.passwordText}>{"Password"}</Text>
                                </View>
                                <View style={customStyle2}>
                                    <TextInput
                                        placeholder='Your Password'
                                        placeholderTextColor={'#C4C4C4'}
                                        onChangeText={(passwordTextValue) => {
                                            // console.log(passwordTextValue);
                                            setPassword(passwordTextValue);
                                        }}
                                        value={password}
                                        style={styles.passwordTextInput}
                                        onFocus={() => setFocus({ style2: !false })}
                                        secureTextEntry={true}
                                    />
                                </View>
                            </View>
                            {
                                ifSignIn &&
                                <View style={styles.inputFieldContainer3}>
                                    <View style={styles.passwordLabelContainer}>
                                        <Text style={styles.passwordText}>{"Confirm Password"}</Text>
                                    </View>
                                    <View style={customStyle3}>
                                        <TextInput
                                            placeholder='Confirm Password'
                                            placeholderTextColor={'#C4C4C4'}
                                            onChangeText={(passwordTextValue) => {
                                                // console.log(passwordTextValue);
                                                setConfirmPassword(passwordTextValue);
                                            }}
                                            value={confirmPassword}
                                            style={styles.confirmPasswordTextInput}
                                            onFocus={() => setFocus({ style3: !false })}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                            }
                            {
                                !ifSignIn &&
                                <View style={styles.remembermeAndForgetContainer}>
                                    <View style={styles.rememberContainer}>
                                        <View style={styles.squareCheckBoxContainer}>
                                            <BouncyCheckbox
                                                size={20}
                                                fillColor="#7B61FF"
                                                unfillColor="#FFFFFF"
                                                iconStyle={{ borderColor: 'red', color: 'black' }}
                                                innerIconStyle={{ borderWidth: 2, color: 'black' }}
                                                checkIconImageSource={
                                                    require('../../assets/images/checkicon.png')
                                                }
                                                textStyle={{ fontFamily: 'JosefinSans-Regular' }}
                                                isChecked={rememberChecked}
                                                disableBuiltInState
                                                onPress={(rememberCheck) => {
                                                    // setChecked(!checked)
                                                    // console.log("222", !checked);
                                                    setRememberChecked(!rememberChecked)
                                                    console.log("rememberChecked", !rememberChecked);
                                                }}
                                            />
                                        </View>
                                        <View style={styles.rememberLabelContainer}>
                                            <Text style={styles.rememberLabelText}>{"Remember me"}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.forgetPasswordLabelContainer}>
                                        <Text style={styles.forgetPasswordLabelText}>{"Forget password?"}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={styles.adminOrUserContainer}>
                                <View style={styles.adminContainer}>
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor="#0396FF"
                                        unfillColor="white"
                                        iconStyle={{ borderColor: 'red', color: 'black' }}
                                        innerIconStyle={{ borderWidth: 2, color: 'black' }}
                                        checkIconImageSource={
                                            require('../../assets/images/checkicon.png')
                                        }
                                        textStyle={{ fontFamily: 'JosefinSans-Regular' }}
                                        isChecked={!checked}
                                        disableBuiltInState
                                        onPress={(secondCheck) => {
                                            setChecked(!checked)
                                            console.log("Admin", !checked);
                                        }}
                                    />
                                    <Text style={styles.adminLabelText}>{"Admin"}</Text>
                                </View>
                                <View style={styles.userLabelContainer}>
                                    <BouncyCheckbox
                                        size={25}
                                        fillColor="#0396FF"
                                        unfillColor="white"
                                        iconStyle={{ borderColor: 'red', color: 'black' }}
                                        innerIconStyle={{ borderWidth: 2, color: 'black' }}
                                        checkIconImageSource={
                                            require('../../assets/images/checkicon.png')
                                        }
                                        textStyle={{ fontFamily: 'JosefinSans-Regular' }}
                                        isChecked={checked}
                                        disableBuiltInState
                                        onPress={(secondCheck) => {
                                            setChecked(!checked)
                                            console.log("User", !checked);
                                        }}
                                    />
                                    <Text style={styles.userLabelText}>{"User"}</Text>
                                </View>
                            </View>
                            {!ifSignIn ?
                                <TouchableOpacity style={styles.loginButtonContainer}
                                    onPress={() => {

                                        loginValidation()
                                    }}>

                                    <Text style={styles.loginLabelText}>{"Login"}</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.loginButtonContainer}
                                    onPress={() => {

                                        signUpValidation()
                                    }}>

                                    <Text style={styles.loginLabelText}>{'Signup'}</Text>
                                </TouchableOpacity>
                            }
                            <View style={styles.orAndSignupContainer}>
                                <Text style={styles.orText}>{"OR"}</Text>
                                {
                                    !ifSignIn
                                        ?
                                        <TouchableOpacity style={styles.singupContainer}
                                            onPress={() => {

                                                setIfSignIn(true);
                                                setChecked(false);
                                                setUsername('');
                                                setPassword('');
                                                setFocus({ style2: false })
                                            }}>

                                            <Text style={styles.singupText}>{"Signup"}</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity style={styles.singupContainer}
                                            onPress={() => {

                                                setIfSignIn(false);
                                                setChecked(false);
                                                setRememberChecked(false);
                                                setUsername('');
                                                setPassword('');
                                                setConfirmPassword('');
                                                setFocus({ style2: false })
                                            }}>

                                            <Text style={styles.singupText}>{'Login'}</Text>
                                        </TouchableOpacity>
                                }

                            </View>
                            {
                                !ifSignIn &&
                                <View style={styles.socialLoginContainer}>
                                    <TouchableOpacity style={styles.facebookImageContainer}>
                                        <Image
                                            style={styles.facebookImage}
                                            source={require('../../assets/images/facebook_logo.jpg')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.googleImageContainer}>
                                        <Image
                                            style={styles.googleImage}
                                            source={require('../../assets/images/google_logo.png')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.twitterImageContainer}>
                                        <Image
                                            style={styles.twitterImage}
                                            source={require('../../assets/images/twitter_logo.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }

                        </View>
                    </View>
            }
        </>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
    },
    backgroundImageContainer: {

    },
    backgroundImage: {
        width: '100%',
        height: 200
    },
    curveMainContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

    },
    customNavigatorContainer: {
        // backgroundColor: 'red',
        marginVertical: 15,
        borderBottomColor: '#0396FF',
        borderBottomWidth: 2,
    },
    loginContainer: {

    },
    loginText: {
        textAlign: 'center',
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 17,
        color: '#121212',
        marginBottom: 5,
    },
    signupContainer: {

    },
    signupText: {

    },
    inputFieldContainer: {
        // backgroundColor: 'green',
    },
    phoneLabelContainer: {
        // backgroundColor: 'red',
        marginLeft: 20
    },
    phoneText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',
    },
    usernameTextInputContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,

    },
    usernameTextInputContainerFocus: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#0396FF',
    },
    usernameTextInput: {
        paddingLeft: 15,

    },
    inputFieldContainer2: {

    },
    passwordLabelContainer: {
        marginLeft: 20,
        marginTop: 10,
    },
    passwordText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 17,
        color: '#121212',

    },
    textinputTextContainer: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,

    },
    textinputTextContainer1: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,


    },
    textinputTextContainerFocus: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1.2,
        borderColor: '#0396FF',
    },
    textinputTextContainerFocus1: {
        backgroundColor: '#F3F3F3',
        flexGrow: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1.2,
        borderColor: '#0396FF',
    },
    passwordTextInput: {
        paddingLeft: 15,

    },
    confirmPasswordTextInput: {
        paddingLeft: 15,

    },
    remembermeAndForgetContainer: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    rememberContainer: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',

    },
    squareCheckBoxContainer: {
        backgroundColor: '#FFFFFF',
        width: 30,
    },
    rememberLabelContainer: {

    },
    rememberLabelText: {
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 12,
        color: '#181818',
    },
    forgetPasswordLabelContainer: {
        marginHorizontal: 20,
    },
    forgetPasswordLabelText: {
        color: '#7B61FF',
    },
    adminOrUserContainer: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15
    },
    adminContainer: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    adminLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 17,
        color: '#121212',
    },
    userLabelContainer: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',


    },
    userLabelText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        lineHeight: 17,
        color: '#121212',
    },
    loginButtonContainer: {
        backgroundColor: '#0396FF',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    loginLabelText: {
        fontFamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 17,
        color: '#EFEAEA',
    },
    orAndSignupContainer: {
        // backgroundColor:'red',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,

    },
    orText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 13,
        lineHeight: 17,
        color: '#121212',
    },
    singupContainer: {
        // backgroundColor:'green',

    },
    singupText: {
        fontfamily: 'Rubik',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 15,
        lineHeight: 17,
        color: '#121212',
        marginVertical: 10
    },
    socialLoginContainer: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    facebookImageContainer: {
        marginHorizontal: 10,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    facebookImage: {
        width: 25,
        height: 25,
        borderRadius: 20,
    },
    googleImageContainer: {
        marginHorizontal: 10,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    googleImage: {
        width: 30,
        height: 30,
        borderRadius: 20,

    },
    twitterImageContainer: {
        marginHorizontal: 10,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    twitterImage: {
        width: 30,
        height: 30,
        borderRadius: 20,

    }
})