<template>
  <div class="chat-window">
    <div class="messages">
      <div v-for="message in state.messages" :key="message.id">
        <div class="message">
          <div>
            <div class="title">{{ message.question }}</div>
            <pre><div class="message-text">{{ message.answer }}</div><div class="message-time">{{ message.time }}</div></pre>
          </div>
        </div>
      </div>
    </div>
    <div class="input-box">
      <input type="text" v-model="state.currentQuestion" @keydown.enter="queryAnswer()">
      <button @click="queryAnswer()">Send</button>
    </div>
  </div>
</template>
  
<script setup>
import { reactive } from 'vue'
import { getAnswer } from '@/api/chat.js'

const state = reactive({
  currentQuestion: "",
  messages: []

})
function queryAnswer() {
  console.log("test")
  getAnswer({question: state.currentQuestion}).then((res) => {
    console.log(res.data)
    if (res.data) {
      console.log(res.data)
      let message = {
        id: state.messages.length + 1,
        answer: state.currentQuestion,
        question: state.currentQuestion,
      }
      message.answer = res.data.msg
      state.messages.push(message)
      state.currentQuestion = ""
    }

  })
}
</script>
  
<style>
.chat-window {
  display: flex;
  flex-direction: column;
  height: auto;
  min-height: 200px;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px;
}

.messages {
  flex: 1;
  overflow-y: scroll;
}

.message {
  /* display: flex;
  flex-direction: column; */
  margin-bottom: 10px;
  text-align: left;
}

.message-text {
  background-color: #eee;
  border-radius: 5px;
  padding: 5px;
}

.message-time {
  font-size: 12px;
  color: #888;
  text-align: right;
}

.input-box {
  display: flex;
  margin-top: 10px;
}

input[type="text"] {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
}

button {
  border: none;
  background-color: #007aff;
  color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>