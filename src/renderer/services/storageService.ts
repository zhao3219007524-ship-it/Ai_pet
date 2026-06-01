export class StorageService {
  async savePet(pet: any): Promise<void> {
    return (window as any).api.savePet(pet);
  }

  async getPets(): Promise<any[]> {
    return (window as any).api.getPets();
  }

  async getPet(id: string): Promise<any> {
    return (window as any).api.getPet(id);
  }

  async deletePet(id: string): Promise<void> {
    return (window as any).api.deletePet(id);
  }

  async saveChatHistory(petId: string, messages: any[]): Promise<void> {
    return (window as any).api.saveChatHistory(petId, messages);
  }

  async getChatHistory(petId: string, limit?: number): Promise<any[]> {
    return (window as any).api.getChatHistory(petId, limit);
  }
}
