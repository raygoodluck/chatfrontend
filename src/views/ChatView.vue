<template>
    <div>
        <h1>Simple Chat Test </h1>
    </div>
    <ChatWindow/>
</template>
  
<script>
import ChatWindow from '@/components/ChatWindow.vue'

export default {
    name: 'ChatView',
    components: {
        ChatWindow,
    }
}
</script>
  