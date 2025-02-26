import {Injectable} from '@angular/core';
import {Client, Message} from '@stomp/stompjs';
import SockJS from 'sockjs-client'; // ✅ Import SockJS
import {Subject} from 'rxjs';
import {environment} from "../../environments/environment";

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
    // Initialize the STOMP client without brokerURL
    this.stompClient = new Client({
      reconnectDelay: 5000, // Reconnect after 5 seconds if disconnected
      debug: (str) => console.log(str), // Log STOMP debug messages
      webSocketFactory: () => new SockJS(environment.sockJsUrl), // Use SockJS for WebSocket fallback
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
      },
      onStompError: (frame) => {
        console.error('STOMP protocol error:', frame.headers['message']);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      }
    });

    // Activate the STOMP client
    this.stompClient.activate();
  }

  // Handle newly created schedules (JSON)
  private handleScheduleCreate(schedule: any) {
    this.scheduleUpdates.next({type: 'create', data: schedule});
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
    this.scheduleUpdates.next({type: 'update', id});
  }

  // Handle schedule deletions
  private handleScheduleDelete(id: number) {
    this.scheduleUpdates.next({type: 'delete', id});
  }

  // Expose schedule updates as an observable
  getScheduleUpdates() {
    return this.scheduleUpdates.asObservable();
  }
}
