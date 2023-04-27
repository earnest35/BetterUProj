import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Header } from './Header'
import { apiKey } from './Shh';
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
export function Ai(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  // Function to handle sending messages to the API
  const handleSendMessage = async () => {
    if (!input) return; // Don't send an empty message

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const apiEndpoint = `https://api.openai.com/v1/chat/completions`;
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful fitness assistant that can only answer questions relating to health or fitness"
        },
        {
          "role": "user",
          "content": input
        }
      ],
      "max_tokens": 100,
      "stop": "\n"
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify(apiRequestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API response:", JSON.stringify(data, null, 2));

      if (!data.choices || data.choices.length === 0 || !data.choices[0].content) {
        throw new Error(`Invalid API response format: ${JSON.stringify(data, null, 2)}`);
      }

      const completion = data.choices[0].content.trim();
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: completion }]);
      setInput(""); // Reset input after sending message
    } catch (error) {
      console.error("Error fetching API:", error);
      // Add a fallback message to the messages state
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "An error occurred. Please try again later." }]);
    }
  };
  
  
  
  // Function to render messages
  const renderMessage = ({ item }) => {
    if (!item.content) {
      console.error("Missing content for message:", JSON.stringify(item));
      return null;
    }
  
    const messageContainerStyle = item.role === "user" ? styles.userMessageContainer : styles.assistantMessageContainer;
    return (
      <View style={[styles.messageContainer, messageContainerStyle]}>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };
  
    

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Ai;

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '70%',
  },
  userMessageContainer: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  botMessageContainer: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 8,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  responseContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  responseText: {
    fontSize: 16,
    color: '#007AFF',
  },
  assistantMessageContainer: {
    backgroundColor: "#F3F3F3",
    alignSelf: "flex-start",
    maxWidth: "80%",
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
    marginLeft: 8,
  },
};

/* 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*/