import {Image,ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';
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
import { auth } from './Firebase';
export const Food = () => {
  const [selectedFood,setSelectedFood] = useState([]);
  const userFoodCollection = collection(db, 'userFoods');

  const handleAddFood = async (food) => {
    if (!auth.currentUser) {
      alert('User not logged in. Please log in to add workout.');
      return;
    }
  const currentUser = auth.currentUser;
  const currentDate = new Date();
  const foodWithDateAndUser = { ...food, date: currentDate, userId: currentUser.uid };

  try {
    await addDoc(userFoodCollection, foodWithDateAndUser);
    console.log(`Successfully posted ${food.title}`);
    setSelectedFood((prevSelectedFoods) => [...prevSelectedFoods, food]);
    console.log(`Added ${food.title} to selected foods.`);
  } catch (error) {
    console.log(`Error adding food: ${error}`);
  }
};
return (
  <View style={{ flex: 1, backgroundColor: 'lightgray', paddingTop: 20 }}>
    <Header />
    <View style={foodPageStyles.selectedFoodsContainer}>
      <Text style={foodPageStyles.selectedFoodsTitle}>Selected Foods:</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={foodPageStyles.selectedFoodsScroll}
      >
        {selectedFood.map((food, index) => (
          <Text
            key={index}
            style={foodPageStyles.selectedFoodItem}
          >
            {food.title}
          </Text>
        ))}
      </ScrollView>
    </View>
    <FlatList
      data={foodItems}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      renderItem={({ item }) => (
        <View style={foodPageStyles.card}>
          <View style={foodPageStyles.cardContent}>
            <Image source={item.source} style={foodPageStyles.image} />
            <Text style={foodPageStyles.title}>{item.title}</Text>
            <Text style={foodPageStyles.calories}>{item.calories} calories</Text>
            <TouchableOpacity
              onPress={() => handleAddFood(item)}
              style={foodPageStyles.addButton}
            >
              <Text style={foodPageStyles.addButtonText}>Add Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  </View>
);
      }

const foodPageStyles = StyleSheet.create({
  selectedFoodsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  selectedFoodsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedFoodsScroll: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  selectedFoodItem: {
    backgroundColor: 'whitesmoke',
    color: 'black',
    padding: 8,
    marginHorizontal: 5,
    fontSize: 10,
    borderRadius: 5,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
  },
  calories: {
    fontSize: 14,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
})