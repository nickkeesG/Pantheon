class ChatDaemon {
  name: string;

  constructor(name: string) {
      this.name = name;
  }

  async generateComment(ideaId: number) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Hi, my name is ${this.name}`;
  }
}

export default ChatDaemon;