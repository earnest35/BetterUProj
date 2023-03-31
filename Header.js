import { StatusBar } from 'expo-status-bar';
import { Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
export function Header(){
    return(
        <View>
        <Image source={betterULogo} style={headerStyles}/>
        </View>
    )
    } 
const betterULogo = require('./assets/BetterULogoFuture.jpg');
const headerStyles = StyleSheet.create({
    width:'100%',
    height:100,
    alignContent: 'center'
})