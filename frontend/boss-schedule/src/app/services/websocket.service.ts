import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; // ✅ Import SockJS
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient!: Client;
  private scheduleUpdates = new Subject<any>();

  constructor() {
    this.connect();
  }

  private connect() {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to schedule updates
        this.stompClient.subscribe('/topic/schedules', (message: Message) => {
          const body = message.body;

          try {
            const data = JSON.parse(body); // Try parsing JSON
            console.log('New schedule received:', data);
            this.handleScheduleCreate(data);
          } catch (error) {
            // If parsing fails, treat it as plain text
            console.log('Received plain text message:', body);
            this.handlePlainTextMessage(body);
          }
        });
      }
    });

    this.stompClient.activate();
  }

// Handle newly created schedules (JSON)
  private handleScheduleCreate(schedule: any) {
    this.scheduleUpdates.next({ type: 'create', data: schedule });
  }

// Handle plain text messages (update or delete)
  private handlePlainTextMessage(message: string) {
    let match = message.match(/Updated schedule with ID: (\d+)/);
    if (match) {
      const id = parseInt(match[1], 10);
      console.log(`Schedule with ID ${id} was updated`);
      this.handleScheduleUpdate(id);
      return;
    }

    match = message.match(/Deleted schedule with ID: (\d+)/);
    if (match) {
      const id = parseInt(match[1], 10);
      console.log(`Schedule with ID ${id} was deleted`);
      this.handleScheduleDelete(id);
    }
  }

// Handle schedule updates
  private handleScheduleUpdate(id: number) {
    this.scheduleUpdates.next({ type: 'update', id });
  }

// Handle schedule deletions
  private handleScheduleDelete(id: number) {
    this.scheduleUpdates.next({ type: 'delete', id });
  }


  getScheduleUpdates() {
    return this.scheduleUpdates.asObservable();
  }
}
