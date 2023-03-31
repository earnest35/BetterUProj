import {Image,ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from './Firebase';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
export const Food = () => {
  const foodCollection = collection(db,'food');
  const [selectedFood,setSelectedFood] = useState([]);
  const viewSelectedWorkouts = () => {
    setSelectedFood(foods => [...foods, food])
  }
  const handleAddFood = (food) => {
    const alreadySelected = selectedFood.find((selected) => selected.id === food.id);
    if (!alreadySelected) {
      setSelectedFood((prevSelectedFoods) => [...prevSelectedFoods, food]);
      console.log(`Added ${food.title} to selected workouts.`);
    } else {
      console.log(`${food.title} is already selected.`);
    }

    addDoc(foodCollection,food)
    .then((docRef) =>{
      console.log(`Successfully posted ${food.title} with ID:${docRef.id}`)
    })
    .catch((error) =>{
      console.log(`Error adding post ${error}`)
    })
  }
  /*addDoc(postsCollection, newPost)
  .then((docRef) => {
    console.log('New post added with ID:', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding post:', error);
  }); */
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
const foodItems = [
  {id:1,title: "Grilled chicken breast (3 oz)", calories:140,source: require('./assets/grilledchicken.jpg')}, 
  {id:2,title: "Quinoa(1/2 cup cooked )", calories:111,source: require('./assets/quinoa.jpg')},
  {id:3,title: "Broccoli (1 cup chopped)", calories:55,source: require('./assets/broccoli.webp')},
  {id:4,title: "Greek Yogurt (6 oz)", calories:100,source: require('./assets/greekyogurt.jpg')},
  {id:5,title: "Sweet Potato (1 medium)", calories:103,source: require('./assets/sweetpotato.jpg')},
  {id:6,title: "Salmon (3 oz)", calories:155,source: require('./assets/salmon.jpg')},
  {id:7,title: "Brown Rice(1/2 cup cooked)", calories:140,source: require('./assets/brownrice.webp')},
  {id:8,title: "Spinach (1 cup raw)", calories:7,source: require('./assets/spinach.jpg')},
  {id:9,title: "Almonds(1 oz)", calories:163,source: require('./assets/almonds.jpg')},
  {id:10,title: "Blueberries(1 cup)", calories:84,source: require('./assets/blueberries.jpg')},

]

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
