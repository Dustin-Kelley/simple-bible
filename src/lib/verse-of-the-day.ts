import { getSdkHeaders } from '@youversion/platform-react-native-expo-core/sdk-version';

/**
 * Same local day-of-year the YouVersion SDK uses for Verse of the Day, so a
 * jump lands on the verse the card is showing.
 */
export function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0).getTime();
  return Math.floor((date.getTime() - start) / 86400000);
}

type VerseOfTheDayCredentials = {
  appKey: string;
  apiHost: string;
  installationId: string;
};

/**
 * Passage id for today's verse, such as `JHN.3.16`.
 * Uses the same path as `@youversion/platform-core` `getVOTD`.
 */
export async function fetchVerseOfTheDayPassageId(
  credentials: VerseOfTheDayCredentials,
): Promise<string | null> {
  const day = dayOfYear(new Date());
  const host = credentials.apiHost || 'api.youversion.com';

  try {
    const response = await fetch(`https://${host}/v1/verse_of_the_days/${day}`, {
      headers: {
        'X-YVP-App-Key': credentials.appKey,
        'X-YVP-Installation-Id': credentials.installationId,
        ...getSdkHeaders(),
      },
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { passage_id?: unknown };
    if (typeof body.passage_id !== 'string' || body.passage_id.length === 0) return null;
    return body.passage_id;
  } catch {
    return null;
  }
}
