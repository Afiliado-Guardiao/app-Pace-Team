# Paywallo SDK: Setup & Core Integration

This guide covers the fundamental steps to integrate the Paywallo SDK into a React Native (Expo) or Next.js project.

## 1. Installation

Install the main SDK package:
```bash
npm install @virex-tech/paywallo-sdk
```

## 2. Configuration

### Environment Variables
Store your `APP_KEY` in your environment files. For Expo, use the `EXPO_PUBLIC_` prefix:
```env
EXPO_PUBLIC_PAYWALLO_APP_KEY=your_key_here
```

## 3. Implementation Pattern (Singleton)

Instead of calling `PaywalloClient` directly, use a Service wrapper. This ensures tracking events are queued/handled correctly if the SDK hasn't finished initializing.

### PaywalloService Structure
```typescript
import { PaywalloClient } from "@virex-tech/paywallo-sdk";

class PaywalloService {
  private isInitialized = false;
  private configurePromise: Promise<void> | null = null;
  private timeoutId: NodeJS.Timeout | null = null;

  setInitialized(value: boolean): void {
    this.isInitialized = value;
  }

  setConfigurePromise(promise: Promise<void>): void {
    this.configurePromise = promise;
  }

  async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;

    if (this.configurePromise) {
      try {
        await Promise.race([
          this.configurePromise,
          new Promise((_, reject) => {
            this.timeoutId = setTimeout(() => {
              reject(new Error("Paywallo configuration timeout"));
            }, 10000);
          }),
        ]);
      } catch (error) {
        console.warn("[Paywallo] Initialization timeout:", error);
      } finally {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
      }
    }
  }

  async initialize(appKey: string): Promise<void> {
    await PaywalloClient.init({ appKey });
    this.isInitialized = true;
  }

  async track(eventName: string, properties?: any): Promise<void> {
    await this.ensureInitialized();
    await PaywalloClient.track(eventName, { properties, timestamp: Date.now() });
  }

  async identify(userId: string, properties?: any): Promise<void> {
    await this.ensureInitialized();
    await PaywalloClient.identify({
      email: properties?.email,
      properties: { ...properties, userId },
    });
  }
}

export const paywalloService = new PaywalloService();
```

## 4. App Initialization
Initialize the service in your root hook or `App` component.

```typescript
useEffect(() => {
  const key = process.env.EXPO_PUBLIC_PAYWALLO_API_KEY;
  if (key) {
    const initPromise = paywalloService.initialize(key);
    paywalloService.setConfigurePromise(initPromise);
  }
}, []);
```

## 5. User Session
```typescript
// Login
await paywalloService.identify(user.id, { email: user.email });

// Logout
await PaywalloClient.reset();
```
