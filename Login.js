
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebase } from './Firebase';
import "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Planner } from './Planner';
import { Header } from './Header';
export const Login = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [isInProgress, setIsInProgress] = useState(false);
   const auth = getAuth();
      const handleRegister = useCallback(async (email, password, setError) => {
        setIsInProgress(true);
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log(user);
          navigation.navigate('MainTabs', {
            screen: 'Planner',
          });
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        }
        setIsInProgress(false);
      },[auth,navigation]);
      const handleLogin = useCallback(async (email, password, setError) => {
        setIsInProgress(true);
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log(user);
          navigation.navigate('MainTabs', {
            screen: 'Planner',
          });
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        }
        setIsInProgress(false)
      },[auth,navigation]);
      const handleEmailChange = (text) => {
        if (!isInProgress) {
          setEmail(text);
        }
      };
      const handlePasswordChange = (text) => {
        if (!isInProgress) {
          setPassword(text);
        }
      };
  return (
    <KeyboardAvoidingView style={styles.BACKGROUND}>
      <Header/>
        <View style={styles.inputContainer}>
          <Text style={{color:'white',fontSize:20,textAlign:'center'}}>Login</Text>
            <Text style={{color:'white',fontSize:15,}}>Email</Text>
            <TextInput
            placeholder="Email"
            value={email}
            onChangeText={handleEmailChange}
            style={styles.input}/>
            <Text style={{color:'white',fontSize:15,marginTop:10}}>Password</Text>
            <TextInput
            value={password}
            placeholder="Password"
           onChangeText={handlePasswordChange}
            secureTextEntry
            style={styles.input}/>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity
           onPress={() =>handleLogin(email,password,console.log)}
            style={[styles.button,styles.buttonOutline,{positon:'relative'},{marginLeft:4}]}>
                <Text style={[styles.buttonText,{color:'black'},]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => handleRegister(email, password, console.log)}
            style={[styles.button,styles.buttonOutline,{positon:'relative'},{marginLeft:15}]}>
                <Text style={[styles.buttonText,{color:'black'}]}>Register</Text>
            </TouchableOpacity>
        </View>
        </View>

      
    </KeyboardAvoidingView>
  );
  
  }
const styles = StyleSheet.create({
  BACKGROUND:{
    backgroundColor:'#D4D4D4',
    height:'100%'
  },
    inputContainer:{
        width:250,
        height:300,
        position:'relative',
        backgroundColor:'black',
        top:200,
        left:75,
        right:85,
        borderRadius:10,
        shadowColor:'black',
        shadow:15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    input:{
        backgroundColor:'white',
        paddingHorizontal:15,
        paddingVertical:10,
        width:'95%',
        //marginTop:5
    },
    button:{
        backgroundColor:'#0782F9',
        width:"45%",
        height:40,
        marginTop:60,
        padding:8,
        borderRadius:5,
        alignItems:'center',
        textAlign:'center',
        justifyContent:'center'
    },
    buttonOutline:{
        backgroundColor:'white',
        //marginTop:5,
        borderColor:'black',
        borderWidth:1,
        justifyContent:'center',
        alignContent:'center'
    },
    buttonText:{
        color:'white',
        fontWeight:'700',
        fontSize:12,
        position:'absolute',
        top:'50%'
    }
})