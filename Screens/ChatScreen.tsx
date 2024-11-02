import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  BackHandler,
  Alert,
} from 'react-native';
import axios from 'axios';
import Sound from 'react-native-sound';

// sounds
const userMessageSound = new Sound(
  'user-message.mp3',
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('Failed to load sound', error);
    }
  },
);

const botReplySound = new Sound('bot-reply.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('Failed to load sound', error);
  }
});

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  createdAt: Date;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Initial messages
    const welcomeMessage: Message = {
      id: '1',
      text: 'Type "Start" to start the conversation or "Restart" to restart the conversation.',
      sender: 'bot',
      createdAt: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === '') {
      return;
    }

    userMessageSound.play();

    // Adding user message to chat
    const userMessage: Message = {
      id: `${new Date().getTime()}`,
      text: inputText,
      sender: 'user',
      createdAt: new Date(),
    };
    setMessages(prevMessages => [userMessage, ...prevMessages]);
    setInputText('');

    try {
      // Send the user's message to the bot API
      const response = await axios.post('http://192.168.242.183:5000/chat', {
        user_id: 1,
        message: inputText,
      });
      const botMessage: Message = {
        id: `${new Date().getTime() + 1}`,
        text: response.data.message,
        sender: 'bot',
        createdAt: new Date(),
      };

      botReplySound.play();

      setMessages(prevMessages => [botMessage, ...prevMessages]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({item}: {item: Message}) => {
    const isUserMessage = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.botMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003049',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#0077b6',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  botMessage: {
    backgroundColor: '#0077b6',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
