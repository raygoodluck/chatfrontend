import createAxios from '@/utils/axios'
const chatControllerUrl = '/api/chat/'


export function getAnswer(params = {}) {
  // return {
  //   answer: "sdfs",
  //   question: "dddd",
  // }.question
  return createAxios({
      url: chatControllerUrl + 'getAnswer',
      method: 'POST',
      data: params,
  })
}


