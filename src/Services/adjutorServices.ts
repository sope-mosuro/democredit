import axios from 'axios';
const ADJUTOR_API_URL = 'https://adjutor.lendsqr.com/v2/validation/karma-lookup';
interface KarmaLookupResponse {
    status: string;
    message: string;
    data: {
      bvn: string;
      past_due_loan_amount_due: number;
      credit_delinquency: number;
      failed_selfie_bvn_check: number;
      loans: number;
      past_due_loans: number;
      duplicated_devices: number;
      shared_device_users: number;
    };
    meta: {
      cost: number;
      balance: number;
    };
  }
  
  export const checkUserRisk = async (bvn: string): Promise<{ isRisky: boolean; reason?: string }> => {
    try {
      const response = await axios.post<KarmaLookupResponse>(
        ADJUTOR_API_URL,
        { bvn },
        { headers: { Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}` } }
      );
  
      const userData = response.data.data;
  
      // Define criteria for blacklisting
      if (userData.past_due_loan_amount_due > 5000) {
        return { isRisky: true, reason: "User has past due loans exceeding 5000" };
      }
  
      if (userData.credit_delinquency > 0) {
        return { isRisky: true, reason: "User has a history of credit delinquency" };
      }
  
      if (userData.failed_selfie_bvn_check > 3) {
        return { isRisky: true, reason: "User failed BVN selfie verification multiple times" };
      }
  
      if (userData.duplicated_devices > 3 || userData.shared_device_users > 3) {
        return { isRisky: true, reason: "Suspicious device sharing or duplication detected" };
      }
  
      return { isRisky: false };
    } catch (error) {
      console.error('Error checking risk status:', error);
      throw new Error('Failed to check user risk status');
    }
  };