import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native'
import React from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, push, ref } from 'firebase/database';
import { db } from '../Firebase/firebase-config';
import auth from '@react-native-firebase/auth';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
    webClientId:
        "399119903726-51vlje8agmd0t83ntuist3sohcmcnfgf.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
});
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
        style4: false,
        style5: false,
    });
    const customStyle1 = !focus.style1 ? styles.usernameTextInputContainer : styles.usernameTextInputContainerFocus;
    const customStyle2 = !focus.style2 ? styles.textinputTextContainer : styles.textinputTextContainerFocus;
    const customStyle3 = !focus.style3 ? styles.textinputTextContainer1 : styles.textinputTextContainerFocus1;
    const customStyle4 = !focus.style4 ? styles.textinputTextContainer1 : styles.textinputTextContainerFocus1;
    const customStyle5 = !focus.style5 ? styles.textinputTextContainer1 : styles.textinputTextContainerFocus1;
    //GOOGLE LOGIN

    // function configureGoogleSign() {
    //     GoogleSignin.configure({
    //         scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    //         webClientId: '399119903726-51vlje8agmd0t83ntuist3sohcmcnfgf.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    //         offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //         hostedDomain: '', // specifies a hosted domain restriction
    //         forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    //         accountName: '', // [Android] specifies an account name on the device that should be used
    //         iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    //         googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    //         openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
    //         profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    //     });
    // }
    // React.useEffect(() => {
    //     GoogleSignin.configure({
    //         scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
    //         webClientId:
    //             '399119903726-51vlje8agmd0t83ntuist3sohcmcnfgf.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    //         offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //     });
    // }, []);
    // React.useEffect(()=>{
    //     GoogleSignin.configure({
    //         webClientId:
    //             '399119903726-51vlje8agmd0t83ntuist3sohcmcnfgf.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    //     });
    // },[])
    const [googleloggedIn, setGoogleloggedIn] = React.useState(false);
    const [googleUserInfo, setGoogleUserInfo] = React.useState(null);
    // setTimeout(() => {
    //     console.log('goggleUserInfo',googleUserInfo);
    //     console.log('goggleUserInfo',googleUserInfo.displayName);
    //     console.log('goggleUserInfo',JSON.stringify(googleUserInfo.providerData));
    // }, 4000);
    const signIn = async () => {
        try {
            const { accessToken, idToken } = await GoogleSignin.signIn();
            // console.log('GOOGLE SINGIN ACCESSTOKEN', accessToken)
            // console.log('GOOGLE SINGIN idToken', idToken)
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // console.log('googleCredential', googleCredential)
            if (signupEmail !== 0) {
                // setSignupEmail(userAuth.email)
                // setSignupPassword(userAuth.email)
                navigate('Home');
                Alert.alert('Successfully registered!')
                setChecked(false);
                setUsername('');
                setPassword('');
                // setSignupEmail('')
                // setSignupPassword('')
                setSignupConfirmPassword('')
                setIfSignIn(false);
                setFocus({ style3: false });
                setFocus({ style4: false });
                setFocus({ style5: false });
                storeUser();
                getUserVal();
                //FIREBASE STORE...
                newUserData();
            }
            else {
                Alert('else')
            }
            setSignupEmail('')
            setSignupPassword('')
            return auth().signInWithCredential(googleCredential);

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                Alert.alert('Process Cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert('Signin in progress');
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
                // play services not available or outdated
            } else {
                // some other error happened
                Alert.alert('Something else went wrong... ', error.toString())
                //     //   setError(error)

            }
        }

    };
    const onAuthStateChanged = async userAuth => {
        if (!userAuth) {
            return;
        }
        if (userAuth) {
            console.log("userAuth=====>", userAuth);
            setGoogleUserInfo(userAuth);
            setSignupEmail(userAuth.email);
            setSignupPassword(userAuth.email);
            storeUser();
            getUserVal();

        }
        setSignupEmail('')
        setSignupPassword('')
        return () => userReference();
    };
    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        console.log('Useeffect subscriber', subscriber);
        return () => {
            subscriber;
        };
    }, []);
    // const signOut = async () => {
    //     auth().signOut();

    //     setGoogleUserInfo(null);

    //     return () => userReference();
    //   };
    // const signIn = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const { accessToken, idToken } = await GoogleSignin.signIn();
    //         console.log('GOOGLE SINGIN ACCESSTOKEN', accessToken)
    //         console.log('GOOGLE SINGIN idToken', idToken)
    //         setGoogleloggedIn(true);
    //     } catch (error) {
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //             // user cancelled the login flow
    //             Alert.alert('Process Cancelled');
    //         } else if (error.code === statusCodes.IN_PROGRESS) {
    //             Alert.alert('Signin in progress');
    //             // operation (f.e. sign in) is in progress already
    //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //             Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
    //             // play services not available or outdated
    //         } else {
    //             // some other error happened
    //             Alert.alert('Something else went wrong... ', error.toString())
    //             //     //   setError(error)

    //         }
    //     }
    // };
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   console.log("userInfo",userInfo)
    //   setGoogleLoginUserInfo(userInfo);
    // } catch (error) {
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     // user cancelled the login flow
    //     // Alert.alert('failed')
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     // Alert.alert('failed2')

    //     // operation (e.g. sign in) is in progress already
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     // play services not available or outdated
    //     // Alert.alert('failed3')

    //   } else {
    //     // some other error happened
    //     // Alert.alert('failed4')

    //   }
    // }
    // };
    const [googleLoginGetUserInfo, setGoogleLoginGetUserInfo] = React.useState('');
    console.log("Google googleLoginGetUserInfo login user info===>", googleLoginGetUserInfo)

    const getCurrentUserInfo = async () => {
        // try {
        //   const userInfo = await GoogleSignin.signInSilently();
        //   setGoogleLoginGetUserInfo(userInfo);
        // } catch (error) {
        //   if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        //     // user has not signed in yet
        //     Alert.alert('error SIGN_IN_REQUIRED')
        //   } else {
        //     // some other error
        //     Alert.alert('error SIGN_IN_REQUIRED else')

        //   }
        // }
        try {
            const userInfo = await GoogleSignin.signInSilently()
            console.log('userInfo get', userInfo);
            setGoogleLoginGetUserInfo(userInfo)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                // when user hasn't signed in yet
                Alert.alert('Please Sign in')
                //   setIsLoggedIn(false)
            } else {
                Alert.alert('Something else went wrong... ', error.toString())
                //   setIsLoggedIn(false)
            }
        }
    };

    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        console.log('issignedIn', isSignedIn);
        this.setState({ isLoginScreenPresented: !isSignedIn });
    };
    const getCurrentUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        setGoogleLoginGetUserInfo(currentUser);
    };
    const signOut = async () => {
        // try {
        //     await GoogleSignin.signOut();
        //     this.setState({ user: null }); // Remember to remove the user from your app's state as well
        // } catch (error) {
        //     console.error(error);
        // }
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setGoogleloggedIn(false);
            setGoogleUserInfo([]);
        } catch (error) {
            console.error(error);
        }
    };
    const revokeAccess = async () => {
        try {
            await GoogleSignin.revokeAccess();

            // Google Account disconnected from your app.
            // Perform clean-up actions, such as deleting data associated with the disconnected account.
        } catch (error) {
            console.error(error);
        }
    };

    // GET LOCALSTORAGE FOR VALIDATION PURPOSE...
    const [getUserName, setGetUserName] = React.useState([]);
    // console.log('getusername ', getUserName);

    //GETTING USERNAME FROM LOCALSTORAGE...
    let dataAra = [];
    Object.keys(getUserName).forEach((key) => {
        if (getUserName[key] === getUserName[key]) {
            // console.log('The Object key getUsername', getUserName[key].username);
            let usernameValue = getUserName[key] === null ? 'null' : getUserName[key].signupEmail;
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
        if (signupEmail.length === 0) {
            Alert.alert('Please Enter your email');
        }
        else if (signupPassword.length === 0) {
            Alert.alert('Please Enter your password')
        }
        else if (rememberChecked === false) {
            Alert.alert('Please accept remember me')
        }
        else if (checked === true) {
            Alert.alert('Temporarily user not allowed')
        }
        else if (regex.test(signupEmail) === false) {
            Alert.alert(signupEmail + ' ' + 'is not a valid email address')
        }
        // FIREBASE CAN'T ACCEPTED @ AND . IN URL TYPE SO I REPLACED FOR @ AND .
        else if (usernamedata === null || !usernamedata.includes(signupEmail.replace('@', 'AT').replace('.', 'DOT'))) {
            Alert.alert("Please register email doesn't exists")
        }
        else if (userpassworddata === null || !userpassworddata.includes(signupPassword)) {
            Alert.alert('Please enter register password')
        }
        else if (checked === false && signupEmail && signupPassword) {
            // console.log('MY world =====>',username);
            // console.log('MY world =====>',password);
            navigate('Home');
            Alert.alert('Welcome!')
            setChecked(false);
            setRememberChecked(false);
            setUsername('');
            setPassword('');
            setSignupEmail('')
            setSignupPassword('')
            setFocus({ style1: false })
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
    const [signupEmail, setSignupEmail] = React.useState('');
    const [signupPassword, setSignupPassword] = React.useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = React.useState('');

    //SIGNUP LOCALSTORAGE...
    const signupValue = {
        // FIREBASE CAN'T ACCEPTED @ AND . IN URL TYPE SO I REPLACED FOR @ AND .
        signupEmail: signupEmail.replace(/\@/gi, 'AT').replace(/\./gi, 'DOT'),
        // signupPassword
        // WHY I HIDE ABOVE LINE BECAUSE I USED TWO TYPES ONE IS NORMAL LOGIN ANOTHER ONE IS GOOGLE LOGIN
        signupPassword: signupPassword.replace(/\@/gi, 'AT').replace(/\./gi, 'DOT')
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
        push(ref(db, 'user'), {
            username: signupValue.signupEmail,
            password: signupValue.signupPassword
        })

    }
    // Google login after replace the email and password

    // GET FIREBASE STORE...
    const [userNameData, setUserNameData] = React.useState([]);
    console.log('UserNameData first ==>', userNameData);
    React.useEffect(() => {
        // return onValue(ref(db, `username_${signupValue.username}`), querySnapShot => {
        setLoginLoader(false);
        return onValue(ref(db, 'user'), querySnapShot => {
            let data = querySnapShot.val() || {};
            let dataItems = { ...data };
            console.log('Useeffect return dataitems ===>', dataItems);
            setUserNameData(dataItems);
            setLoginLoader(true);
        })
    }, [])
    console.log('UserNameData second ==>', userNameData);
    let helloKey = Object.keys(userNameData);
    console.log('Hello keys ===', helloKey);
    // let usernamedata = helloKey.length > 1 ? (helloKey.map(key => userNameData[key].username)) : null;
    let usernamedata = helloKey.length > 0 ? (helloKey.map(key => userNameData[key].username)) : null;
    let userpassworddata = helloKey.length > 0 ? (helloKey.map(key => userNameData[key].password)) : null;
    console.log('usernamedata', usernamedata);
    console.log('userpassworddata', userpassworddata);
    // REGULAR EXPRESSION FOR EMAIL VALIDATION
    // UPPERCASE LETTER IS ALLOWED FOR EMAIL
    // let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    // UPPERCASE LETTER NOT ALLOWED FOR EMAIL
    let regex = new RegExp('^[a-z]+\@[^\s]+\.[^\s]+$');

    // SIGNUP VALIDATION... 
    const signUpValidation = () => {
        if (signupEmail.length === 0) {
            Alert.alert('Please Enter your email');
        }
        // else if (username === getUserName.username) {
        //     Alert.alert('Username already exists')
        // }
        else if (signupPassword.length === 0) {
            Alert.alert('Please Enter your password')
        }
        else if (signupConfirmPassword.length === 0) {
            Alert.alert('Please Enter your confirm password')
        }
        else if (signupPassword !== signupConfirmPassword) {
            Alert.alert('Password and confirm password mismatched')
        }
        else if (checked === true) {
            Alert.alert('Temporarily user not allowed')
        }
        else if (regex.test(signupEmail) === false) {
            Alert.alert(signupEmail + ' ' + 'is not a valid email address')
        }
        // else if (dataAra.includes(username)) {
        else if (usernamedata === null) {
            // navigate('Home');
            Alert.alert('Successfully registered!')
            setChecked(false);
            setUsername('');
            setPassword('');
            setSignupEmail('')
            setSignupPassword('')
            setSignupConfirmPassword('')
            setIfSignIn(false);
            setFocus({ style3: false });
            setFocus({ style4: false });
            setFocus({ style5: false });
            storeUser();
            getUserVal();
            //FIREBASE STORE...
            newUserData();
            //LOGIN
            navigate('Login')

        }
        else if (usernamedata.includes(signupEmail)) {
            Alert.alert('Email already exists')
        }
        // else if (userpassworddata.includes(signupPassword)) {
        //     Alert.alert('User password already exists')
        // }
        else if (checked === false && signupEmail && signupPassword && signupConfirmPassword) {
            // navigate('Home');
            Alert.alert('Successfully registered!')
            setChecked(false);
            setUsername('');
            setPassword('');
            setSignupEmail('')
            setSignupPassword('')
            setSignupConfirmPassword('')
            setIfSignIn(false);
            setFocus({ style3: false });
            storeUser();
            getUserVal();
            //FIREBASE STORE...
            newUserData();
            //LOGIN
            navigate('Login')
        }
        else {
            setIfSignIn(false);
        }
    }
    // LOGIN LOADER FOR GETTING DATA TEMPORARLY...
    const [loginLoader, setLoginLoader] = React.useState(false);
    // setTimeout(() => {
    //     setLoginLoader(true);
    // }, 10000);
    //
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}>
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
                        {
                            !ifSignIn &&
                            <>
                                <View style={styles.inputFieldContainer}>
                                    <View style={styles.phoneLabelContainer}>
                                        <Text style={styles.phoneText}>{"Email"}</Text>
                                    </View>
                                    <View style={customStyle1}>
                                        <TextInput
                                            placeholder='Your Email'
                                            placeholderTextColor={'#C4C4C4'}
                                            keyboardType='email-address'
                                            autoCapitalize='none'
                                            autoComplete='email'
                                            textContentType='emailAddress'
                                            autoCorrect={false}
                                            onChangeText={(usernameTextValue) => {
                                                // console.log('usernameTextValue', usernameTextValue);
                                                setSignupEmail(usernameTextValue);
                                            }}
                                            value={signupEmail}
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
                                                setSignupPassword(passwordTextValue);
                                            }}
                                            value={signupPassword}
                                            style={styles.passwordTextInput}
                                            onFocus={() => setFocus({ style2: !false })}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                            </>
                        }
                        {
                            ifSignIn &&
                            <>
                                <View style={styles.inputFieldContainer}>
                                    <View style={styles.phoneLabelContainer}>
                                        <Text style={styles.phoneText}>{"Email"}</Text>
                                    </View>
                                    <View style={customStyle4}>
                                        <TextInput
                                            placeholder='Your Email'
                                            placeholderTextColor={'#C4C4C4'}
                                            keyboardType='email-address'
                                            autoCapitalize='none'
                                            autoComplete='email'
                                            textContentType='emailAddress'
                                            autoCorrect={false}
                                            onChangeText={(usernameTextValue) => {
                                                // console.log('usernameTextValue', usernameTextValue);
                                                setSignupEmail(usernameTextValue);
                                            }}
                                            value={signupEmail}
                                            style={styles.usernameTextInput}
                                            onFocus={() => setFocus({ style4: !false })}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputFieldContainer2}>
                                    <View style={styles.passwordLabelContainer}>
                                        <Text style={styles.passwordText}>{"Password"}</Text>
                                    </View>
                                    <View style={customStyle5}>
                                        <TextInput
                                            placeholder='Your Password'
                                            placeholderTextColor={'#C4C4C4'}
                                            onChangeText={(passwordTextValue) => {
                                                // console.log(passwordTextValue);
                                                setSignupPassword(passwordTextValue);
                                            }}
                                            value={signupPassword}
                                            style={styles.passwordTextInput}
                                            onFocus={() => setFocus({ style5: !false })}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
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
                                                setSignupConfirmPassword(passwordTextValue);
                                            }}
                                            value={signupConfirmPassword}
                                            style={styles.confirmPasswordTextInput}
                                            onFocus={() => setFocus({ style3: !false })}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                            </>

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
                                    {
                                        !loginLoader ? null
                                            :
                                            loginValidation()
                                    }
                                }}>
                                {
                                    !loginLoader ? <ActivityIndicator size={'large'} color="#00C0F0" />
                                        :
                                        <Text style={styles.loginLabelText}>{"Login"}</Text>
                                }
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.loginButtonContainer}
                                onPress={() => {
                                    {
                                        !loginLoader ? null :
                                            signUpValidation()
                                    }
                                }}>
                                {
                                    !loginLoader ? <ActivityIndicator size={'large'} color="#00C0F0" />
                                        :
                                        <Text style={styles.loginLabelText}>{'Signup'}</Text>
                                }
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
                                            // setUsername('');
                                            // setPassword('');
                                            setSignupEmail('');
                                            setSignupPassword('');
                                            setFocus({ style1: false })
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
                                            setSignupEmail('')
                                            setSignupPassword('')
                                            setSignupConfirmPassword('')
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
                                <TouchableOpacity style={styles.googleImageContainer}
                                    onPress={() => {
                                        !loginLoader ? null :
                                            signIn()
                                    }
                                    }
                                >
                                    {
                                        !loginLoader ?
                                            <ActivityIndicator size={'large'} color="#00C0F0" />
                                            :
                                            <Image
                                                style={styles.googleImage}
                                                source={require('../../assets/images/google_logo.png')}
                                            />
                                    }

                                </TouchableOpacity>
                                <TouchableOpacity style={styles.twitterImageContainer}
                                    >
                                    <Image
                                        style={styles.twitterImage}
                                        source={require('../../assets/images/twitter_logo.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                        }

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

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