export const PARTICIPANT_DOCUMENTS_BUCKET = 'participant-documents';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const assertUuid = (value, fieldName) => {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    throw new Error(`${fieldName} must be a valid UUID.`);
  }
};

const assertFilename = (filename) => {
  if (typeof filename !== 'string' || filename.length === 0 || filename.length > 255) {
    throw new Error('Filename is required and must be 255 characters or fewer.');
  }

  if (filename === '.' || filename === '..' || filename.includes('/') || filename.includes('\\')) {
    throw new Error('Filename must be a single safe path segment.');
  }

  if (filename.includes('..') || /[\u0000-\u001f\u007f]/.test(filename)) {
    throw new Error('Filename contains an unsafe path sequence.');
  }
};

export const buildParticipantDocumentPath = ({ userId, competitionId, registrationId, filename }) => {
  assertUuid(userId, 'userId');
  assertUuid(competitionId, 'competitionId');
  assertUuid(registrationId, 'registrationId');
  assertFilename(filename);

  const path = `${userId}/${competitionId}/${registrationId}/${filename}`;
  if (path.split('/').length !== 4 || path.split('/').some((segment) => segment.length === 0)) {
    throw new Error('Document path must contain exactly four non-empty segments.');
  }

  return path;
};

export const isParticipantDocumentPath = (path) => {
  if (typeof path !== 'string') return false;

  const segments = path.split('/');
  if (segments.length !== 4 || segments.some((segment) => segment.length === 0)) return false;

  try {
    buildParticipantDocumentPath({
      userId: segments[0],
      competitionId: segments[1],
      registrationId: segments[2],
      filename: segments[3]
    });
    return true;
  } catch {
    return false;
  }
};