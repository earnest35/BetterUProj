import { StatusBar } from 'expo-status-bar';
import { Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
export function Header(){
    const betterULogo = require("./assets/BetterULogo.png");
    return(
        <View style={headerStyles.container}>
        <Image  source={betterULogo} style={headerStyles.img}/>
        </View>
    )
    } 
const headerStyles = StyleSheet.create({
    container:{
    position:'relative',
    left:60,
    right:'50%',
    top:-25,
    width:'100%',
    height:100,
    alignContent: 'center'
    },
    img:{
        width:250,
        height:250
    }
})