
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Header } from './Header'
//import { apiKey } from './Shh';
import { TextInput } from 'react-native';
import { Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
const { Configuration, OpenAIApi } = require("openai");
import { KeyboardAvoidingView } from 'react-native';
export function Ai(){
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("");
  const handleSendMessage = async () => {
    if (!input) return;
  
    const userMessage = { role: "user", content: input };
  
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    try {
      const response = await getChatCompletion(input);
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response },
      ]);
  
      setInput("");
    } catch (error) {
      console.error("Error fetching API:", error);
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "An error occurred. Please try again later." },
      ]);
    }
  };
  
  const getChatCompletion = async (input) => {
    const response = await fetch("http://172.26.150.213:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
  
    const data = await response.json();
    console.log(data.response);
    return data.response;
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
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
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
};
/*
const { Configuration, OpenAIApi } = require("openai");
const apiKey="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";

async function getChatCompletion(){
const configuration = new Configuration({
  apiKey: apiKey
});
const openai = new OpenAIApi(configuration);

const completion =  await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: "Hello world"}],
});
console.log(completion.data.choices[0].message);
}
getChatCompletion(); */
/* const response = await fetch("http://172.24.218.147:3001/api/chat"*/