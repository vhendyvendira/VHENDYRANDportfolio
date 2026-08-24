import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, increment, writeBatch } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// @ts-ignore - firestoreDatabaseId is in the JSON but not in the standard AppOptions type
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  const jsonError = JSON.stringify(errInfo);
  console.warn('Firestore Permission Issue: ', jsonError);
  throw new Error(jsonError);
}

const getIPHash = async (): Promise<string | null> => {
  const providers = [
    'https://api.ipify.org?format=json',
    'https://api.seeip.org/jsonip',
    'https://ipapi.co/json/'
  ];

  for (const url of providers) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) continue;
      const data = await response.json();
      const ip = data.ip || data.jsonip || data.ip_address;
      
      if (ip) {
        // Create a simple hash of the IP for privacy
        const msgUint8 = new TextEncoder().encode(ip);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
      }
    } catch (error) {
      // Silently try next provider
      continue;
    }
  }

  // Fallback: use a persistent local ID if IP detection fails
  try {
    let localId = localStorage.getItem('visitor_local_id');
    if (!localId) {
      localId = crypto.randomUUID();
      localStorage.setItem('visitor_local_id', localId);
    }
    return localId;
  } catch (e) {
    return null;
  }
};

export const getVisitorCount = async () => {
  const path = 'stats/global';
  try {
    const docRef = doc(db, 'stats', 'global');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().visitorCount as number;
    }
    return 1;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e) {
        console.error("Diagnostic error logged for system:", (e as Error).message);
      }
    } else {
      console.error("Error getting visitor count:", error);
    }
    return null; 
  }
};

export const trackVisit = async () => {
  // 1. Detect IP Hash
  const visitorHash = await getIPHash();
  if (!visitorHash) return;

  try {
    // 2. Check if this visitor has been tracked before
    const visitorPath = `uniqueVisitors/${visitorHash}`;
    const visitorRef = doc(db, 'uniqueVisitors', visitorHash);
    
    let visitorSnap;
    try {
      visitorSnap = await getDoc(visitorRef);
    } catch (error) {
       if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
         handleFirestoreError(error, OperationType.GET, visitorPath);
       }
       throw error;
    }

    if (visitorSnap.exists()) {
      // Already counted this IP
      return;
    }

    // 3. Increment count and record visitor atomically
    const batch = writeBatch(db);
    const statsRef = doc(db, 'stats', 'global');
    const statsPath = 'stats/global';
    
    let statsSnap;
    try {
       statsSnap = await getDoc(statsRef);
    } catch (error) {
       if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
         handleFirestoreError(error, OperationType.GET, statsPath);
       }
       throw error;
    }

    if (statsSnap.exists()) {
      batch.update(statsRef, {
        visitorCount: increment(1)
      });
    } else {
      batch.set(statsRef, {
        visitorCount: 1
      });
    }

    batch.set(visitorRef, {
      visitedAt: new Date().toISOString()
    });

    try {
      await batch.commit();
    } catch (error) {
      if (error instanceof Error && (error.message.includes('permission') || error.message.includes('insufficient'))) {
        handleFirestoreError(error, OperationType.WRITE, 'batch-commit-stats-and-visitor');
      }
      throw error;
    }
  } catch (error) {
    // Only log if it's not the diagnostic JSON error we just threw
    if (!(error instanceof Error && error.message.startsWith('{'))) {
      console.error("Error tracking unique visit:", error);
    }
  }
};
