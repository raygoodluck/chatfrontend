<template>
  <div class="chat-window">
    <div class="messages">
      <div v-for="message in state.messages" :key="message.id">
        <div class="message">
          <div>
            <div class="title">Q: {{ message.question }}</div>
            <div class="content">
              A:
              <pre><div class="message-text">{{ message.answer }}</div></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-box">
      <input type="text" v-model="state.currentQuestion" @keydown.enter="queryAnswer()">
      <button :disabled="state.currentDisabled" @click="queryAnswer()">Send</button>
    </div>
  </div>
</template>
  
<script setup>
import { reactive } from 'vue'
import { getAnswer } from '@/api/chat.js'

const state = reactive({
  currentQuestion: "",
  currentDisabled: false,
  messages: []

})
let messageLength = 1;
function queryAnswer() {
  if (state.currentQuestion == '') {
    return;
  }
  state.currentDisabled = true;
  messageLength++;
  let currentQ = state.currentQuestion;
  getAnswer({ question: currentQ }).then((res) => {
    if (res.data) {
      let message = {
        id: messageLength,
        question: currentQ,
      }
      // console.log(res.data)
      state.messages.push(message);
      message.answer = res.data.msg;
      state.currentQuestion = "";
      state.currentDisabled = false;
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
  font-size: 16px;
}

.messages pre {
  margin: 0;
  line-height: 20px;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;

}

.message {
  margin-top: 0;
  display: flex;
  flex-direction: column;
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