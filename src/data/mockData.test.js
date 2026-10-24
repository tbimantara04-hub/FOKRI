import { describe, expect, it } from 'vitest';
import { INITIAL_COMPETITIONS } from './mockData.js';

const expectedBranches = [
  ['Musabaqah Azan (MA)', 'ma'],
  ['Musabaqah Fahmil Quran (MFQ)', 'mfq'],
  ['Musabaqah Da’i Muda (MDM)', 'mdm'],
  ['Lomba Film Pendek Islami (LFPI)', 'lfpi'],
  ['Lomba Desain Media Dakwah Digital (LDMD)', 'ldmd'],
  ['Lomba Karya Tulis Islami (LKTI)', 'lkti'],
  ['Musabaqah Nasyid Islami (MNI)', 'mni'],
  ['Musabaqah Tartil Quran (MTQ)', 'mtq']
];

describe('FOKRI GAMES XII active competition catalog', () => {
  it('contains the eight requested names and slugs in the specified order', () => {
    expect(INITIAL_COMPETITIONS).toHaveLength(expectedBranches.length);
    expect(INITIAL_COMPETITIONS.map(({ name, slug }) => [name, slug])).toEqual(expectedBranches);
  });

  it('keeps stable, unique IDs and slugs for registrations and links', () => {
    expect(new Set(INITIAL_COMPETITIONS.map(({ id }) => id)).size).toBe(expectedBranches.length);
    expect(new Set(INITIAL_COMPETITIONS.map(({ slug }) => slug)).size).toBe(expectedBranches.length);
  });

  it('does not carry unverified Tilawatil Quran details into the Tartil Quran entry', () => {
    const mtq = INITIAL_COMPETITIONS.find(({ slug }) => slug === 'mtq');

    expect(mtq.name).toBe('Musabaqah Tartil Quran (MTQ)');
    expect(mtq.detailsPending).toBe(true);
    expect(mtq.status).not.toBe('REGISTRATION_OPEN');
    expect(mtq.quota).toBeNull();
    expect(mtq.categories).toHaveLength(0);
    expect(mtq.schedules).toHaveLength(0);
    expect(mtq.documentRequirements).toHaveLength(0);
    expect(mtq.prizes).toHaveLength(0);
    expect(mtq.rules).toBe('');
    expect(mtq.fullDescription).not.toContain('Tilawatil');
  });
});
