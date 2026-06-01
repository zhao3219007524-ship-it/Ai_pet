import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // AI相关
  sendMessage: (content: string, context?: string) => ipcRenderer.invoke('ai:sendMessage', content, context),
  
  // 存储相关
  savePet: (pet: any) => ipcRenderer.invoke('storage:savePet', pet),
  getPets: () => ipcRenderer.invoke('storage:getPets'),
  getPet: (id: string) => ipcRenderer.invoke('storage:getPet', id),
  deletePet: (id: string) => ipcRenderer.invoke('storage:deletePet', id),
  saveChatHistory: (petId: string, messages: any[]) =>
    ipcRenderer.invoke('storage:saveChatHistory', petId, messages),
  getChatHistory: (petId: string, limit?: number) =>
    ipcRenderer.invoke('storage:getChatHistory', petId, limit),
  saveEmotionProfile: (profile: any) =>
    ipcRenderer.invoke('storage:saveEmotionProfile', profile),
  getEmotionProfile: (petId: string) =>
    ipcRenderer.invoke('storage:getEmotionProfile', petId),
  
  // 模型相关
  generateModel: (imageUrl: string) =>
    ipcRenderer.invoke('model:generateModel', imageUrl),
  analyzeEmotion: (text: string) =>
    ipcRenderer.invoke('model:analyzeEmotion', text),
});
