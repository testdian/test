import I18N from '@src/lang/I18N';

export const safeParseJson = (jsonString: string | undefined) => {
  try {
    return jsonString ? JSON.parse(jsonString) : [];
  } catch (error) {
    console.error(I18N.eca.jsonDecoding, error);
    return [];
  }
};
