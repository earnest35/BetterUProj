import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { TouchableWithoutFeedback } from 'react-native';
import { Header } from './Header';
import { db } from './Firebase';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth } from './Firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect } from 'react';
export const HealthItems = ({ items }) => {
    return (
      <View>
        {items.map((item, index) => (
          <Text key={index}>{item.title}</Text>
        ))}
      </View>
    );
  };
  export const FoodItems = ({ items }) => {
    return (
      <View>
        {items.map((item, index) => (
          <Text key={index}>{item.title}</Text>
        ))}
      </View>
    );
  };
  export const WorkoutItems = ({ items }) => {
    return (
      <View>
        {items.map((item, index) => (
          <Text key={index}>{item.title}</Text>
        ))}
      </View>
    );
  };
      