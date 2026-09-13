import { describe, expect, it } from 'vitest';
import { buildParticipantDocumentPath, isParticipantDocumentPath } from './storagePath.js';

const ids = {
  userId: '11111111-1111-4111-8111-111111111111',
  competitionId: '22222222-2222-4222-8222-222222222222',
  registrationId: '33333333-3333-4333-8333-333333333333'
};

describe('participant document storage paths', () => {
  it('builds the canonical four-segment path', () => {
    expect(buildParticipantDocumentPath({ ...ids, filename: 'file.pdf' }))
      .toBe(`${ids.userId}/${ids.competitionId}/${ids.registrationId}/file.pdf`);
  });

  it('rejects traversal, separators, invalid UUIDs, and extra segments', () => {
    expect(() => buildParticipantDocumentPath({ ...ids, filename: '../file.pdf' })).toThrow();
    expect(() => buildParticipantDocumentPath({ ...ids, filename: 'nested/file.pdf' })).toThrow();
    expect(() => buildParticipantDocumentPath({ ...ids, userId: 'not-a-uuid', filename: 'file.pdf' })).toThrow();
    expect(isParticipantDocumentPath(`${ids.userId}/random/file.pdf`)).toBe(false);
    expect(isParticipantDocumentPath(`${ids.userId}/${ids.competitionId}/${ids.registrationId}/file.pdf/extra`)).toBe(false);
  });
});