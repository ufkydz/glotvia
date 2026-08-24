import { UserProfile, LanguageId } from '../types';
import { 
  getCurrentUser as getLocalUser, 
  setCurrentUser as setLocalUser, 
  getAllUsers, 
  saveUsers, 
  deleteUserAccount,
  sanitizeUser
} from '../utils/authStorage';
import { syncUserToFirestore, getUserFromFirestore, deleteUserFromFirestore } from './firebaseDbService';

/**
 * Unified User Repository Pattern
 */
export class UserRepository {
  /**
   * Get active logged in user
   */
  static getCurrentUser(): UserProfile {
    return getLocalUser();
  }

  /**
   * Save user profile locally and sync to Cloud Firestore
   */
  static async saveUser(user: UserProfile): Promise<void> {
    setLocalUser(user);
    try {
      await syncUserToFirestore(user);
    } catch (e) {
      console.warn('UserRepository: Cloud sync background notice:', e);
    }
  }

  /**
   * Fetch latest user data from Firestore and update local storage if found
   */
  static async syncRemoteUser(emailOrId: string): Promise<UserProfile | null> {
    try {
      const remote = await getUserFromFirestore(emailOrId);
      if (remote) {
        setLocalUser(remote);
        return remote;
      }
    } catch (e) {
      console.warn('UserRepository: Remote fetch error:', e);
    }
    return null;
  }

  /**
   * Delete user permanently across local and cloud storage
   */
  static async deleteUser(emailOrId: string): Promise<boolean> {
    try {
      await deleteUserFromFirestore(emailOrId);
      deleteUserAccount(emailOrId);
      return true;
    } catch (e) {
      console.error('UserRepository: deleteUser error:', e);
      return false;
    }
  }
}
