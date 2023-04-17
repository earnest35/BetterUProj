import {Image,ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import { db } from './Firebase';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import { foodItems } from './FoodComponent';
import { Header } from './Header';
export const Food = () => {
  const [selectedFood,setSelectedFood] = useState([]);
  const userFoodsCollection = collection(db, 'userFoods');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return unsubscribe;
  }, []);
  const foodRef = userId ? collection(userFoodsCollection, userId, 'foods') : null;
  const viewSelectedWorkouts = () => {
    setSelectedFood(foods => [...foods, food])
  }
  
  const handleAddFood = (food) => {
    const alreadySelected = selectedFood.find((selected) => selected.id === food.id);
    if (!alreadySelected) {
      setSelectedFood((prevSelectedFoods) => [...prevSelectedFoods, food]);
      console.log(`Added ${food.title} to selected foods.`);
      addDoc(foodRef,food)
    .then((docRef) =>{
      console.log(`Successfully posted ${food.title} with ID:${docRef.id}`)
    })
    .catch((error) =>{
      console.log(`Error adding post ${error}`)
    })
    } else {
      console.log(`${food.title} is already selected.`);
    }

    
  }
  
  const pairs = foodItems.reduce((result, item, index) => {
    if (index % 2 === 0) {
      result.push([item]);
    } else {
      result[result.length - 1].push(item);
    }
    return result;
  }, []);
  return(
    <ScrollView style={{flex:1,backgroundColor:'lightgray'}}>
      <Header/>
      <View style={{marginTop:30,marginBottom:30,borderRadius:5,overflow:'hidden'}}>
        <Text>Selected Foods:</Text>
        <ScrollView horizontal={true} contentContainerStyle={{flexDirection:'row', marginBottom:15, borderRadius:5, overflow:'hidden', justifyContent:'center', alignItems:'center'}}>
        {selectedFood.map((food,index) => (
          <Text key={index} style={{backgroundColor:'whitesmoke',color:'black',padding:8,marginHorizontal:5,fontSize:10,marginBottom: 5,fontSize:10}}>{food.title}</Text>
        ))}
        </ScrollView>
      </View>
    {pairs.map((pair, index) => (
      <View key={index} style={foodPageStyles.row}>
        <View style={foodPageStyles.column}>
          <View style={[foodPageStyles.leftContent]}>
            <Image source={pair[0].source} style={foodPageStyles.image} />
            <Text style={foodPageStyles.text}>{pair[0].title}</Text>
            <Text style={foodPageStyles.textCalories}>{pair[0].calories} calories</Text>
            <TouchableOpacity>
            <Text style={foodPageStyles.addNow}  onPress={() => handleAddFood(pair[0])}>Add Now</Text>
              </TouchableOpacity>
          </View>
        </View>
        {pair[1] && (
          <View style={[foodPageStyles.column]}>
            <View style={foodPageStyles.rightContent}>
              <Image source={pair[1].source} style={foodPageStyles.image} />
              <Text style={foodPageStyles.text}>{pair[1].title}</Text>
              <Text style={foodPageStyles.textCalories}>{pair[1].calories} calories</Text>
              <TouchableOpacity >
              <Text style={foodPageStyles.addNow} onPress={() => handleAddFood(pair[1])}>Add Now</Text>
              </TouchableOpacity>
              </View>
          </View>
        )}
      </View>
    ))}
  </ScrollView>
  );
}


const foodPageStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    justifyContent:'space-evenly',
    width:'100%',
    padding:5,
    position:'relative',
    marginHorizontal:10,
    height:200
  },
  text:{
    fontSize:12,
    position:'relative',
    bottom:'25%'

  },
  textCalories:{
  fontSize:10,
  position:'relative',
  top:'25%',
  right:'17%'

  },
  addNow:{
  position:'relative',
  left:'12%',
  top:'25%',
  backgroundColor:'lightblue',
  color:'white',
  padding:10,
  borderRadius:15
  },
  textAndButton:{
    justifyContent : 'center'
  },
  column: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin:10,
    width: '50%',
    height:'100%',
    backgroundColor:'white',
    position:'relative',
    left:'-5%',
    

  },
  leftContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:300,
    height:400
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:300,
    height:400
  },
  image: {
    width: 170,
    height: 100,
    position:'relative',
    bottom:'25%',


  },
  button:{
    backgroundColor:'blue'
  }
});
