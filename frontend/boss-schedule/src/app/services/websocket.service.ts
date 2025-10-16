import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

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
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      webSocketFactory: () => new SockJS(environment.sockJsUrl),
      onConnect: () => {
        console.log('✅ Connected to WebSocket');

        // Subscribe to all schedule-related messages
        this.stompClient.subscribe('/topic/schedules', (message: Message) => {
          const body = message.body;

          try {
            const data = JSON.parse(body);
            this.handleJsonMessage(data);
          } catch {
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
        console.log('⚠️ WebSocket disconnected');
      }
    });

    this.stompClient.activate();
  }

  // ✅ Handle structured JSON messages from backend
  private handleJsonMessage(data: any) {
    switch (data.type) {
      case 'zoomUpdate':
        console.log('📡 Received Zoom Update:', data);
        this.scheduleUpdates.next({
          type: 'zoomUpdate',
          action: data.action,
          level: data.level
        });
        break;

      case 'create':
      case 'update':
      case 'delete':
        console.log('📦 Schedule event received:', data);
        this.scheduleUpdates.next(data);
        break;

      default:
        console.log('ℹ️ Unknown JSON message type:', data);
        break;
    }
  }

  // 🧩 Fallback for plain text messages (legacy support)
  private handlePlainTextMessage(message: string) {
    console.log('📝 Plain text WebSocket message:', message);

    // Handle zoom message (e.g., "updated zoom to level: 150")
    const zoomMatch = message.match(/updated zoom to level:\s*(\d+)/i);
    if (zoomMatch) {
      const level = parseInt(zoomMatch[1], 10);
      console.log(`📏 Parsed zoom level: ${level}`);
      this.scheduleUpdates.next({ type: 'zoomUpdate', level });
      return;
    }

    // Handle deleted schedule
    const deleteMatch = message.match(/Deleted schedule with ID:\s*(\d+)/i);
    if (deleteMatch) {
      const id = parseInt(deleteMatch[1], 10);
      this.scheduleUpdates.next({ type: 'delete', id });
      return;
    }

    // Handle general update
    if (message.startsWith('Updated schedule with ID:')) {
      const id = parseInt(message.split(':')[1], 10);
      this.scheduleUpdates.next({ type: 'update', id });
      return;
    }

    // Handle other broadcasts
    if (message.startsWith('Schedules updated at')) {
      this.scheduleUpdates.next({ type: 'update', message });
    }
  }

  // 🧠 Expose as Observable for Angular components
  getScheduleUpdates() {
    return this.scheduleUpdates.asObservable();
  }
}
