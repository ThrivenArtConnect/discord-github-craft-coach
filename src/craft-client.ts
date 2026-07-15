export class CraftClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  async getTodaysTasks() {
    const response = await fetch(`${this.apiUrl}/tasks?scope=active`, {
      headers: this.headers
    });
    return response.json();
  }

  async getTodaysNotes(date = 'today') {
    const response = await fetch(`${this.apiUrl}/blocks?date=${date}`, {
      headers: this.headers
    });
    return response.json();
  }

  async addCheckInNote(content: string) {
    return fetch(`${this.apiUrl}/blocks`, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocks: [{ type: 'text', markdown: content, listStyle: 'bullet' }],
        position: { position: 'end', date: 'today' }
      })
    });
  }

  async updateTask(taskId: string, state: 'todo' | 'done' | 'canceled') {
    return fetch(`${this.apiUrl}/tasks/update`, {
      method: 'POST',
      headers: { ...this.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tasksToUpdate: [{ id: taskId, state }]
      })
    });
  }
}
