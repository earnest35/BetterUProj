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
console.log(apiKey)
export function Ai(){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options, retries = 3, backoff = 500) => {
  try {
    const response = await fetch(url, options);
    if (response.status === 429 && retries > 0) {
      await sleep(backoff);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    return response;
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(backoff);
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
};


  // Function to handle sending messages to the API
  const handleSendMessage = async () => {
    if (!input) return; // Don't send an empty message

  const userMessage = { role: "user", content: input };

  // Add user message to the messages state
  setMessages([...messages, userMessage]);

  try {
    const apiEndpoint = `https://api.openai.com/v1/chat/completions`;

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Explain all concepts like you are a trained fitness professional and do not answer any questions not relating to health or fitness.",
        },
        ...messages,
        userMessage,
      ],
    };

    const response = await fetchWithRetry(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].text) {
      throw new Error("Invalid API response format");
    }

    const completion = data.choices[0].text.trim();

    // Add ChatGPT message to the messages state
    setMessages([...messages, userMessage, { role: "assistant", content: completion }]);

    setInput(""); // Reset input after sending message
  } catch (error) {
    console.error("Error fetching API:", error);
  }
  };

  // Function to render messages
  const renderMessage = ({ item }) => (
    <View style={styles.message}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  message: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    maxWidth: '75%',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

/* 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*/