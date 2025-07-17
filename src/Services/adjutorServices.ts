import axios from 'axios';

const ADJUTOR_API_URL = 'https://adjutor.lendsqr.com/v2/verification/karma';

interface KarmaLookupResponse {
  status: string;
  message: string;
  data: {
    karma_identity: string;
    amount_in_contention: string;
    reason: string | null;
    default_date: string;
    karma_type: {
      karma: string;
    };
    karma_identity_type: {
      identity_type: string;
    };
    reporting_entity: {
      name: string;
      email: string;
    };
  } | null;
  meta: {
    cost: number;
    balance: number;
  };
}

export const checkUserRisk = async (identity: string): Promise<{ isRisky: boolean; reason?: string }> => {
  try {
    const response = await axios.get<KarmaLookupResponse>(
      `${ADJUTOR_API_URL}/${identity}`,
      { headers: { Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}` } }
    );

    const userData = response.data.data;
    console.log(response.data)
    if (userData) {
      return { isRisky: true, reason: userData.reason || "User is blacklisted" };
    }

    return { isRisky: false };
  } catch (error) {
    console.error('Error checking risk status:', error);
    throw new Error('Failed to check user risk status');
  }
};
