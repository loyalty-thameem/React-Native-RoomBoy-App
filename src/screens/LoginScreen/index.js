import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";

const LoginScreen = ({ navigation: { navigate } }) => {
    const [checked, setChecked] = React.useState(false);
    console.log('state checked', checked);
    const [rememberChecked, setRememberChecked] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [focus, setFocus] = React.useState({
        style1: false,
        style2: false,
    });
    const customStyle1 = !focus.style1 ? styles.usernameTextInputContainer : styles.usernameTextInputContainerFocus;
    const customStyle2 = !focus.style2 ? styles.textinputTextContainer : styles.textinputTextContainerFocus;
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
        else if (checked === false && username && password) {
            navigate('Home');
            Alert.alert('Thank you')
        }
        else {
            Alert.alert('Your login details invalid');
        }
    }
    // HEADER IMAGES...
    const icon = checked === false ? require('../../assets/images/admin_background.png') : require('../../assets/images/user_background.png')
    return (
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image
                    source={icon}
                    style={styles.backgroundImage}
                />
            </View>
            <View style={styles.curveMainContainer}>
                <View style={styles.customNavigatorContainer}>
                    {/* <View style={styles.loginContainer}> */}
                    <Text style={styles.loginText}>{"Login"}</Text>
                    {/* </View> */}
                    {/* <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>{"Sign up"}</Text>
                    </View> */}
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
                                console.log('usernameTextValue', usernameTextValue);
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
                                console.log(passwordTextValue);
                                setPassword(passwordTextValue);
                            }}
                            value={password}

                            style={styles.passwordTextInput}
                            onFocus={() => setFocus({ style2: !false })}
                            secureTextEntry={true}
                        />
                    </View>
                </View>
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
                <TouchableOpacity style={styles.loginButtonContainer}
                    onPress={() => {
                        loginValidation()
                    }}>
                    <Text style={styles.loginLabelText}>{"Login"}</Text>
                </TouchableOpacity>
                <View style={styles.orAndSignupContainer}>
                    <Text style={styles.orText}>{"OR"}</Text>
                    <TouchableOpacity style={styles.singupContainer}>
                        <Text style={styles.singupText}>{"Signup"}</Text>
                    </TouchableOpacity>
                </View>
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
            </View>
        </View>
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
    textinputTextContainerFocus: {
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
        marginVertical:10,
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
        elevation: 5
    },
    facebookImage: {
        width: 25,
        height: 25
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
        height: 30
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
        height: 30
    }
})