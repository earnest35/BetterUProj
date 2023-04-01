//Fat Big Black Nigger Penis
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebase } from './Firebase';
import "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Planner } from './Planner';
export const Login = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [isLogged,setIsLoggged] = useState(false);
    const auth = getAuth();
      const handleRegister = async (email, password, setError) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          // Registered and signed in
          const user = userCredential.user;
          console.log(user);
          navigation.navigate('Planner');
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        }
      };
      const handleLogin = async (email, password, setError) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          // Signed in
          const user = userCredential.user;
          console.log(user);
          navigation.navigate('Planner');
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
        }
      };
    
  return (
    <KeyboardAvoidingView>
        <View style={styles.inputContainer}>
          <Text style={{color:'white',fontSize:20,textAlign:'center'}}>Login</Text>
            <Text style={{color:'white',fontSize:15,}}>Email</Text>
            <TextInput
            placeholder="JohnDoe@gmail.com"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}/>
            <Text style={{color:'white',fontSize:15,marginTop:10}}>Password</Text>
            <TextInput
            value={password}
            placeholder="Password123"
           onChangeText={text => setPassword(text)}
            secureTextEntry
            style={styles.input}/>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity
           // onPress={() =>handleLogin(email,password,console.log)}
            style={[styles.button,styles.buttonOutline,{positon:'relative'},{marginLeft:4}]}>
                <Text style={[styles.buttonText,{color:'black'},]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
            //onPress={handleRegister(email, password, console.log)}
            style={[styles.button,styles.buttonOutline,{positon:'relative'},{marginLeft:15}]}>
                <Text style={[styles.buttonText,{color:'black'}]}>Register</Text>
            </TouchableOpacity>
        </View>
        </View>

      
    </KeyboardAvoidingView>
  );
  
  }
const styles = StyleSheet.create({
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